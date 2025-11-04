import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.novawriter.app',
  appName: 'NovaWriter',
  webDir: 'dist/public',
  // Removed server.url - app now loads from local files
  // API calls will go to backend via config.ts detection
  ios: {
    contentInset: 'always'
  }
};

export default config;
