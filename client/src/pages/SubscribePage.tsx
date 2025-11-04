import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check } from "lucide-react";

// Lazy load Stripe - only initialize when needed
// Gracefully handle missing Stripe key (e.g., in development or if not configured)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface SubscribeFormProps {
  tier: 'basic' | 'pro';
}

const SubscribeForm = ({ tier }: SubscribeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account?subscribed=true`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
        data-testid="button-subscribe-submit"
      >
        {isProcessing ? 'Processing...' : `Subscribe to ${tier === 'basic' ? 'Basic' : 'Pro'}`}
      </Button>
    </form>
  );
};

export default function SubscribePage() {
  const [clientSecret, setClientSecret] = useState("");
  const [tier, setTier] = useState<'basic' | 'pro'>('basic');
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tierParam = params.get('tier') as 'basic' | 'pro';
    if (tierParam) {
      setTier(tierParam);
    }

    apiRequest("POST", "/api/create-subscription", { tier: tierParam || 'basic' })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to initialize subscription",
          variant: "destructive",
        });
      });
  }, []);

  const { toast } = useToast();

  const tierDetails = tier === 'basic' ? {
    name: 'Basic',
    price: '$1.99/month',
    features: [
      'Full rich text editor',
      'Unlimited documents & projects',
      'Multi-device sync',
      'File import/export (.docx, .pdf, .txt)',
      'Autosave & cloud storage'
    ]
  } : {
    name: 'Pro',
    price: '$4.99/month',
    features: [
      'All Basic features',
      'AI Writing Assistant',
      'Smart suggestions & continuations',
      'Content summarization',
      'Writing improvements'
    ]
  };

  // Check if Stripe is configured
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/account')}
            className="mb-4"
          >
            ← Back to Account
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Subscriptions Not Available</CardTitle>
              <CardDescription>
                Payment processing is not configured in this app version.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stripe payment processing is currently unavailable. Please contact support or try the web version.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/account')}
          className="mb-4"
          data-testid="button-back-to-account"
        >
          ← Back to Account
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Subscribe to {tierDetails.name}</CardTitle>
            <CardDescription>
              {tierDetails.price} - Cancel anytime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">What's included:</h3>
              <ul className="space-y-2">
                {tierDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscribeForm tier={tier} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
