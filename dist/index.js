var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { eq, desc, and, isNull } from "drizzle-orm";

// server/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditLogs: () => auditLogs,
  chapters: () => chapters,
  characters: () => characters,
  documents: () => documents,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertChapterSchema: () => insertChapterSchema,
  insertCharacterSchema: () => insertCharacterSchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertStyleProfileSchema: () => insertStyleProfileSchema,
  insertUserSchema: () => insertUserSchema,
  insertWritingSampleSchema: () => insertWritingSampleSchema,
  projects: () => projects,
  styleProfiles: () => styleProfiles,
  users: () => users,
  writingSamples: () => writingSamples
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at")
});
var auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  performedBy: varchar("performed_by").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").default("").notNull(),
  cursorPosition: integer("cursor_position").default(0),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").default("").notNull(),
  cursorPosition: integer("cursor_position").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  documentId: varchar("document_id").references(() => documents.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").default(""),
  traits: text("traits").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var writingSamples = pgTable("writing_samples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  wordCount: integer("word_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var styleProfiles = pgTable("style_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  styleAnalysis: text("style_analysis").notNull(),
  tone: text("tone").notNull(),
  vocabulary: text("vocabulary").notNull(),
  sentenceStructure: text("sentence_structure").notNull(),
  pacing: text("pacing").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true
});
var insertWritingSampleSchema = createInsertSchema(writingSamples).omit({
  id: true,
  createdAt: true
});
var insertStyleProfileSchema = createInsertSchema(styleProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}
var wsOptions = process.env.NODE_ENV === "production" ? void 0 : {
  rejectUnauthorized: false
};
var db = drizzle({
  connection: process.env.DATABASE_URL,
  ws: wsOptions ? class extends ws {
    constructor(address, protocols) {
      super(address, protocols, wsOptions);
    }
  } : ws,
  schema: schema_exports
});

// server/storage.ts
var DbStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(and(eq(users.id, id), isNull(users.deletedAt)));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt)));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    await this.createAuditLog({
      userId: user.id,
      performedBy: user.id,
      action: "create",
      entityType: "user",
      entityId: user.id,
      details: `User registered with email: ${user.email}`
    });
    return user;
  }
  async updateUserRole(id, role, performedBy) {
    const user = await this.getUser(id);
    await db.update(users).set({ role }).where(eq(users.id, id));
    await this.createAuditLog({
      userId: id,
      performedBy: performedBy || id,
      action: "update_role",
      entityType: "user",
      entityId: id,
      details: `Role changed from ${user?.role} to ${role}`
    });
  }
  async updateUserSubscriptionTier(id, tier, performedBy) {
    const user = await this.getUser(id);
    await db.update(users).set({ subscriptionTier: tier }).where(eq(users.id, id));
    await this.createAuditLog({
      userId: id,
      performedBy: performedBy || id,
      action: "update_subscription",
      entityType: "user",
      entityId: id,
      details: `Subscription tier changed from ${user?.subscriptionTier} to ${tier}`
    });
  }
  async updateUserStripeInfo(id, customerId, subscriptionId) {
    await db.update(users).set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId
    }).where(eq(users.id, id));
  }
  async getAllUsers(includeDeleted = false) {
    if (includeDeleted) {
      return db.select().from(users);
    }
    return db.select().from(users).where(isNull(users.deletedAt));
  }
  async softDeleteUser(id, performedBy) {
    const user = await this.getUser(id);
    await db.update(users).set({ deletedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
    await this.createAuditLog({
      userId: id,
      performedBy: performedBy || id,
      action: "soft_delete",
      entityType: "user",
      entityId: id,
      details: `User ${user?.email} was soft deleted`
    });
  }
  async restoreUser(id, performedBy) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    await db.update(users).set({ deletedAt: null }).where(eq(users.id, id));
    await this.createAuditLog({
      userId: id,
      performedBy: performedBy || id,
      action: "restore",
      entityType: "user",
      entityId: id,
      details: `User ${user?.email} was restored`
    });
  }
  // Audit Logs
  async createAuditLog(log2) {
    const [auditLog] = await db.insert(auditLogs).values(log2).returning();
    return auditLog;
  }
  async getAuditLogs(userId, limit = 100) {
    if (userId) {
      return db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt)).limit(limit);
    }
    return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }
  async getUserAuditLogs(userId, limit = 100) {
    return db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }
  // Documents
  async getDocuments(userId) {
    return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.updatedAt));
  }
  async getDocument(id) {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }
  async createDocument(document) {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }
  async updateDocument(id, updates) {
    const [updated] = await db.update(documents).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(documents.id, id)).returning();
    return updated;
  }
  async deleteDocument(id) {
    await db.delete(documents).where(eq(documents.id, id));
  }
  // Projects
  async getProjects(userId) {
    return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }
  async getProject(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  async createProject(project) {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  async updateProject(id, updates) {
    const [updated] = await db.update(projects).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(projects.id, id)).returning();
    return updated;
  }
  async deleteProject(id) {
    await db.delete(projects).where(eq(projects.id, id));
  }
  // Chapters
  async getChapters(projectId) {
    return db.select().from(chapters).where(eq(chapters.projectId, projectId)).orderBy(chapters.orderIndex);
  }
  async getChapter(id) {
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id));
    return chapter;
  }
  async createChapter(chapter) {
    const [newChapter] = await db.insert(chapters).values(chapter).returning();
    return newChapter;
  }
  async updateChapter(id, updates) {
    const [updated] = await db.update(chapters).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(chapters.id, id)).returning();
    return updated;
  }
  async deleteChapter(id) {
    await db.delete(chapters).where(eq(chapters.id, id));
  }
  // Characters
  async getCharacters(userId, projectId, documentId) {
    let conditions = [eq(characters.userId, userId)];
    if (projectId) {
      conditions.push(eq(characters.projectId, projectId));
    }
    if (documentId) {
      conditions.push(eq(characters.documentId, documentId));
    }
    return db.select().from(characters).where(and(...conditions)).orderBy(desc(characters.updatedAt));
  }
  async getCharacter(id) {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }
  async createCharacter(character) {
    const [newCharacter] = await db.insert(characters).values(character).returning();
    return newCharacter;
  }
  async updateCharacter(id, updates) {
    const [updated] = await db.update(characters).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(characters.id, id)).returning();
    return updated;
  }
  async deleteCharacter(id) {
    await db.delete(characters).where(eq(characters.id, id));
  }
  // Writing Samples
  async getWritingSamples(userId) {
    return db.select().from(writingSamples).where(eq(writingSamples.userId, userId)).orderBy(desc(writingSamples.createdAt));
  }
  async getWritingSample(id) {
    const [sample] = await db.select().from(writingSamples).where(eq(writingSamples.id, id));
    return sample;
  }
  async createWritingSample(sample) {
    const [newSample] = await db.insert(writingSamples).values(sample).returning();
    return newSample;
  }
  async deleteWritingSample(id) {
    await db.delete(writingSamples).where(eq(writingSamples.id, id));
  }
  // Style Profiles
  async getStyleProfile(userId) {
    const [profile] = await db.select().from(styleProfiles).where(eq(styleProfiles.userId, userId));
    return profile;
  }
  async createStyleProfile(profile) {
    const [newProfile] = await db.insert(styleProfiles).values(profile).returning();
    return newProfile;
  }
  async updateStyleProfile(userId, updates) {
    const [updated] = await db.update(styleProfiles).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(styleProfiles.userId, userId)).returning();
    return updated;
  }
  async deleteStyleProfile(userId) {
    await db.delete(styleProfiles).where(eq(styleProfiles.userId, userId));
  }
};
var storage = new DbStorage();

// server/auth.ts
import bcrypt from "bcrypt";
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
async function registerUser(email, password) {
  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await hashPassword(password);
  return storage.createUser({
    email,
    password: hashedPassword
  });
}
async function loginUser(email, password) {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  return user;
}

// server/routes.ts
import multer from "multer";
import mammoth from "mammoth";
import { Document as DocxDocument, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import OpenAI from "openai";
import * as pdfParse from "pdf-parse";

// server/email.ts
import { Resend } from "resend";
var connectionSettings;
async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }
  connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
      headers: {
        "Accept": "application/json",
        "X_REPLIT_TOKEN": xReplitToken
      }
    }
  ).then((res) => res.json()).then((data) => data.items?.[0]);
  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error("Resend not connected");
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}
async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}
async function sendWelcomeEmail(userEmail) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    await client.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: "Welcome to NovaWriter!",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to NovaWriter!</h1>
          <p>Thank you for joining our community of writers.</p>
          <p>NovaWriter is built by writers, for writers who love to write in their free time and pick up where they left off across multiple devices.</p>
          <p>Get started by creating your first document or project, and experience the power of a distraction-free writing environment.</p>
          <p>Happy writing!</p>
          <p style="margin-top: 30px; color: #666;">The NovaWriter Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
}
async function sendContactFormEmail(name, email, message) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    await client.emails.send({
      from: fromEmail,
      to: "patobrien2017@gmail.com",
      subject: `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
      replyTo: email
    });
    return true;
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return false;
  }
}

// server/routes.ts
import Stripe from "stripe";

// server/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.SESSION_SECRET || "novawrite-secret-key-change-in-production";
var JWT_EXPIRY = "30d";
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY
  });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// server/routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover"
}) : null;
var requireAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (payload) {
      req.session.userId = payload.userId;
      return next();
    }
  }
  return res.status(401).json({ error: "Unauthorized" });
};
var requireAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (payload) {
        req.session.userId = payload.userId;
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }
  next();
};
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await registerUser(email, password);
      if (email === "patobrien2017@gmail.com") {
        await storage.updateUserRole(user.id, "admin");
        await storage.updateUserSubscriptionTier(user.id, "pro");
      }
      try {
        await sendWelcomeEmail(email);
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
      const updatedUser = await storage.getUser(user.id);
      req.session.userId = user.id;
      const token = generateToken(user.id);
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionTier: updatedUser.subscriptionTier,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await loginUser(email, password);
      if (email === "patobrien2017@gmail.com") {
        if (user.role !== "admin" || user.subscriptionTier !== "pro") {
          await storage.updateUserRole(user.id, "admin");
          await storage.updateUserSubscriptionTier(user.id, "pro");
          const updatedUser = await storage.getUser(user.id);
          req.session.userId = user.id;
          const token2 = generateToken(user.id);
          return res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            subscriptionTier: updatedUser.subscriptionTier,
            token: token2
          });
        }
      }
      req.session.userId = user.id;
      const token = generateToken(user.id);
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        token
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.email === "patobrien2017@gmail.com") {
        if (user.role !== "admin" || user.subscriptionTier !== "pro") {
          await storage.updateUserRole(user.id, "admin");
          await storage.updateUserSubscriptionTier(user.id, "pro");
          const updatedUser = await storage.getUser(user.id);
          return res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            subscriptionTier: updatedUser.subscriptionTier
          });
        }
      }
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const docs = await storage.getDocuments(req.session.userId);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const doc = await storage.getDocument(req.params.id);
      if (!doc || doc.userId !== req.session.userId) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/documents", requireAuth, async (req, res) => {
    try {
      const data = insertDocumentSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      const doc = await storage.createDocument(data);
      res.json(doc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const doc = await storage.getDocument(req.params.id);
      if (!doc || doc.userId !== req.session.userId) {
        return res.status(404).json({ error: "Document not found" });
      }
      const updated = await storage.updateDocument(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const doc = await storage.getDocument(req.params.id);
      if (!doc || doc.userId !== req.session.userId) {
        return res.status(404).json({ error: "Document not found" });
      }
      await storage.deleteDocument(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectList = await storage.getProjects(req.session.userId);
      const projectsWithChapters = await Promise.all(
        projectList.map(async (project) => {
          const chapters2 = await storage.getChapters(project.id);
          return { ...project, chapters: chapters2 };
        })
      );
      res.json(projectsWithChapters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const projectChapters = await storage.getChapters(req.params.id);
      res.json({ ...project, chapters: projectChapters });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const data = insertProjectSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const updated = await storage.updateProject(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/projects/:projectId/chapters", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const projectChapters = await storage.getChapters(req.params.projectId);
      res.json(projectChapters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/chapters/:id", requireAuth, async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      const project = await storage.getProject(chapter.projectId);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/chapters", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.body.projectId);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const data = insertChapterSchema.parse(req.body);
      const chapter = await storage.createChapter(data);
      res.json(chapter);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/chapters/:id", requireAuth, async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      const project = await storage.getProject(chapter.projectId);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      const updated = await storage.updateChapter(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/chapters/:id", requireAuth, async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      const project = await storage.getProject(chapter.projectId);
      if (!project || project.userId !== req.session.userId) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      await storage.deleteChapter(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/characters", requireAuth, async (req, res) => {
    try {
      const { projectId, documentId } = req.query;
      const userId = req.session.userId;
      const chars = await storage.getCharacters(
        userId,
        projectId,
        documentId
      );
      res.json(chars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/characters", requireAuth, async (req, res) => {
    try {
      const data = insertCharacterSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      const character = await storage.createCharacter(data);
      res.json(character);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/characters/:id", requireAuth, async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character || character.userId !== req.session.userId) {
        return res.status(404).json({ error: "Character not found" });
      }
      const updated = await storage.updateCharacter(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/characters/:id", requireAuth, async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character || character.userId !== req.session.userId) {
        return res.status(404).json({ error: "Character not found" });
      }
      await storage.deleteCharacter(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/writing-samples", requireAuth, async (req, res) => {
    try {
      const samples = await storage.getWritingSamples(req.session.userId);
      res.json(samples);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/writing-samples", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.subscriptionTier === "free") {
        return res.status(403).json({ error: "Writing style learning is only available for Basic and Pro tier subscribers." });
      }
      const data = insertWritingSampleSchema.parse({
        ...req.body,
        userId: req.session.userId,
        wordCount: req.body.content.split(/\s+/).length
      });
      const sample = await storage.createWritingSample(data);
      res.status(201).json(sample);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/writing-samples/:id", requireAuth, async (req, res) => {
    try {
      const sample = await storage.getWritingSample(req.params.id);
      if (!sample || sample.userId !== req.session.userId) {
        return res.status(404).json({ error: "Writing sample not found" });
      }
      await storage.deleteWritingSample(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/style-profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getStyleProfile(req.session.userId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/style-profile/analyze", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.subscriptionTier === "free") {
        return res.status(403).json({ error: "Writing style learning is only available for Basic and Pro tier subscribers." });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }
      const samples = await storage.getWritingSamples(req.session.userId);
      if (samples.length === 0) {
        return res.status(400).json({ error: "No writing samples available. Please upload at least one writing sample first." });
      }
      const combinedText = samples.map((s) => s.content).join("\n\n");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a literary analyst specialized in identifying writing styles. Analyze the provided writing samples and extract detailed information about the writer's style, tone, vocabulary patterns, sentence structure, and pacing. Be specific and provide actionable insights."
          },
          {
            role: "user",
            content: `Analyze these writing samples and provide a detailed breakdown of the writing style:

${combinedText}

Provide your analysis in the following format:

TONE: [Describe the overall tone - e.g., formal, conversational, humorous, serious]

VOCABULARY: [Describe vocabulary choices - e.g., simple/complex, technical/everyday, rich metaphors]

SENTENCE STRUCTURE: [Describe sentence patterns - e.g., varied/consistent length, simple/complex, use of fragments]

PACING: [Describe the narrative pacing - e.g., fast/slow, detailed descriptions, action-focused]

STYLE SUMMARY: [A comprehensive summary of the unique writing style that can be used to guide AI writing assistance]`
          }
        ],
        max_tokens: 1500
      });
      const analysis = completion.choices[0]?.message?.content || "";
      const extractSection = (text2, label) => {
        const regex = new RegExp(`${label}:\\s*(.+?)(?=\\n\\n[A-Z]+:|$)`, "s");
        const match = text2.match(regex);
        return match ? match[1].trim() : "";
      };
      const tone = extractSection(analysis, "TONE");
      const vocabulary = extractSection(analysis, "VOCABULARY");
      const sentenceStructure = extractSection(analysis, "SENTENCE STRUCTURE");
      const pacing = extractSection(analysis, "PACING");
      const styleAnalysis = extractSection(analysis, "STYLE SUMMARY");
      const existingProfile = await storage.getStyleProfile(req.session.userId);
      if (existingProfile) {
        const updated = await storage.updateStyleProfile(req.session.userId, {
          styleAnalysis,
          tone,
          vocabulary,
          sentenceStructure,
          pacing
        });
        res.json(updated);
      } else {
        const data = insertStyleProfileSchema.parse({
          userId: req.session.userId,
          styleAnalysis,
          tone,
          vocabulary,
          sentenceStructure,
          pacing
        });
        const profile = await storage.createStyleProfile(data);
        res.status(201).json(profile);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/style-profile", requireAuth, async (req, res) => {
    try {
      await storage.deleteStyleProfile(req.session.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/ai/suggest", requireAuth, async (req, res) => {
    try {
      const { prompt, content } = req.body;
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.subscriptionTier !== "pro") {
        return res.status(403).json({ error: "AI features are only available for Pro tier subscribers. Please upgrade to access AI writing assistance." });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }
      const styleProfile = await storage.getStyleProfile(req.session.userId);
      let systemContent = "You are a helpful writing assistant. Provide concise, high-quality suggestions based on the user's prompt.";
      if (styleProfile) {
        systemContent = `You are a helpful writing assistant. Provide concise, high-quality suggestions that match the user's unique writing style.

USER'S WRITING STYLE PROFILE:
- Tone: ${styleProfile.tone}
- Vocabulary: ${styleProfile.vocabulary}
- Sentence Structure: ${styleProfile.sentenceStructure}
- Pacing: ${styleProfile.pacing}

IMPORTANT: Match this writing style in all your suggestions. Write as if you are this author, using their characteristic tone, vocabulary choices, sentence patterns, and pacing. Your suggestions should be indistinguishable from the user's own writing.`;
      }
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemContent
          },
          {
            role: "user",
            content: `Context: ${content || "No content provided"}

Prompt: ${prompt}`
          }
        ],
        max_tokens: 1e3
      });
      const suggestion = completion.choices[0]?.message?.content || "";
      res.json({ suggestion });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/import", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      let content = "";
      const filename = req.file.originalname.toLowerCase();
      if (filename.endsWith(".txt")) {
        content = req.file.buffer.toString("utf-8");
      } else if (filename.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        content = result.value;
      } else if (filename.endsWith(".pdf")) {
        const pdfData = await pdfParse.default(req.file.buffer);
        content = pdfData.text;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/export/docx", requireAuth, async (req, res) => {
    try {
      const { title, content } = req.body;
      const stripHtml = (html) => {
        return html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n$1\n\n").replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n$1\n\n").replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n$1\n").replace(/<li[^>]*>(.*?)<\/li>/gi, "\u2022 $1\n").replace(/<\/ul>/gi, "\n").replace(/<ul[^>]*>/gi, "").replace(/<\/ol>/gi, "\n").replace(/<ol[^>]*>/gi, "").replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<strong[^>]*>(.*?)<\/strong>/gi, "$1").replace(/<b[^>]*>(.*?)<\/b>/gi, "$1").replace(/<em[^>]*>(.*?)<\/em>/gi, "$1").replace(/<i[^>]*>(.*?)<\/i>/gi, "$1").replace(/<u[^>]*>(.*?)<\/u>/gi, "$1").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\n\n\n+/g, "\n\n").trim();
      };
      const plainText = stripHtml(content);
      const paragraphs = plainText.split("\n").filter((line) => line.trim()).map(
        (text2) => new Paragraph({
          children: [new TextRun(text2.trim())]
        })
      );
      const doc = new DocxDocument({
        sections: [{
          children: paragraphs.length > 0 ? paragraphs : [new Paragraph({ children: [new TextRun("")] })]
        }]
      });
      const buffer = await Packer.toBuffer(doc);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${title}.docx"`);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/export/pdf", requireAuth, async (req, res) => {
    try {
      console.log("[PDF Export] Starting PDF export");
      const { title, content } = req.body;
      console.log("[PDF Export] Title:", title, "Content length:", content?.length);
      if (!title || !content) {
        console.log("[PDF Export] Missing title or content");
        return res.status(400).json({ error: "Title and content are required" });
      }
      const stripHtml = (html) => {
        return html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n$1\n\n").replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n$1\n\n").replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n$1\n").replace(/<li[^>]*>(.*?)<\/li>/gi, "\u2022 $1\n").replace(/<\/ul>/gi, "\n").replace(/<ul[^>]*>/gi, "").replace(/<\/ol>/gi, "\n").replace(/<ol[^>]*>/gi, "").replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<strong[^>]*>(.*?)<\/strong>/gi, "$1").replace(/<b[^>]*>(.*?)<\/b>/gi, "$1").replace(/<em[^>]*>(.*?)<\/em>/gi, "$1").replace(/<i[^>]*>(.*?)<\/i>/gi, "$1").replace(/<u[^>]*>(.*?)<\/u>/gi, "$1").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\n\n\n+/g, "\n\n").trim();
      };
      const plainText = stripHtml(content);
      console.log("[PDF Export] Plain text length:", plainText.length);
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margins = 20;
      const maxWidth = pageWidth - margins * 2;
      const lineHeight = 7;
      console.log("[PDF Export] Page dimensions - Width:", pageWidth, "Height:", pageHeight);
      const lines = doc.splitTextToSize(plainText, maxWidth);
      console.log("[PDF Export] Number of lines:", lines.length);
      let currentY = margins;
      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight - margins) {
          doc.addPage();
          currentY = margins;
        }
        doc.text(lines[i], margins, currentY);
        currentY += lineHeight;
      }
      console.log("[PDF Export] PDF generated successfully");
      const buffer = Buffer.from(doc.output("arraybuffer"));
      console.log("[PDF Export] Buffer size:", buffer.length);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
      res.send(buffer);
      console.log("[PDF Export] PDF sent to client");
    } catch (error) {
      console.error("[PDF Export] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
      try {
        await sendContactFormEmail(name, email, message);
      } catch (emailError) {
        console.error("Failed to send contact email (Resend may not be configured):", emailError);
      }
      res.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon."
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/test-user", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("patobrien2017@gmail.com");
      console.log("TEST - Raw user object:", JSON.stringify(user, null, 2));
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/account", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("Account API - User data:", {
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      });
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/create-subscription", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      const { tier } = req.body;
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(user.id, customerId, null);
      }
      const priceIds = {
        basic: process.env.STRIPE_BASIC_PRICE_ID || "",
        pro: process.env.STRIPE_PRO_PRICE_ID || ""
      };
      if (!priceIds[tier]) {
        return res.status(400).json({ error: "Invalid tier or price ID not configured" });
      }
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceIds[tier] }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"]
      });
      const invoice = subscription.latest_invoice;
      const paymentIntent = invoice.payment_intent;
      await storage.updateUserStripeInfo(user.id, customerId, subscription.id);
      await storage.updateUserSubscriptionTier(user.id, tier);
      res.json({
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id
      });
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/stripe-webhook", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      const event = req.body;
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          const customerId = subscription.customer;
          const users2 = await storage.getAllUsers();
          const user = users2.find((u) => u.stripeCustomerId === customerId);
          if (user && user.email !== "patobrien2017@gmail.com") {
            const isActive = subscription.status === "active" || subscription.status === "trialing";
            if (!isActive) {
              await storage.updateUserSubscriptionTier(user.id, "free");
            } else {
              const priceId = subscription.items.data[0]?.price.id;
              const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID;
              const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
              if (priceId === basicPriceId) {
                await storage.updateUserSubscriptionTier(user.id, "basic");
              } else if (priceId === proPriceId) {
                await storage.updateUserSubscriptionTier(user.id, "pro");
              }
            }
          }
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = subscription.customer;
          const users2 = await storage.getAllUsers();
          const user = users2.find((u) => u.stripeCustomerId === customerId);
          if (user && user.email !== "patobrien2017@gmail.com") {
            await storage.updateUserSubscriptionTier(user.id, "free");
          }
          break;
        }
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        subscriptionTier: u.subscriptionTier
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/users/:id/subscription", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { tier } = req.body;
      if (!["free", "basic", "pro"].includes(tier)) {
        return res.status(400).json({ error: "Invalid subscription tier" });
      }
      const targetUser = await storage.getUser(id);
      if (targetUser && targetUser.email === "patobrien2017@gmail.com") {
        return res.status(403).json({ error: "Cannot modify site owner subscription tier" });
      }
      await storage.updateUserSubscriptionTier(id, tier, req.session.userId);
      const user = await storage.getUser(id);
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/users/:id/delete", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const allUsers = await storage.getAllUsers(true);
      const targetUser = allUsers.find((u) => u.id === id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
      if (id === req.session.userId) {
        await storage.createAuditLog({
          userId: id,
          performedBy: req.session.userId || null,
          action: "delete_attempt_blocked",
          entityType: "user",
          entityId: id,
          details: `Admin attempted to delete their own account - action blocked`
        });
        return res.status(403).json({ error: "Cannot delete your own account" });
      }
      if (targetUser.email === "patobrien2017@gmail.com") {
        await storage.createAuditLog({
          userId: id,
          performedBy: req.session.userId || null,
          action: "delete_attempt_blocked",
          entityType: "user",
          entityId: id,
          details: `Attempted to delete site owner account - action blocked`
        });
        return res.status(403).json({ error: "Cannot delete site owner account" });
      }
      if (targetUser.role === "admin") {
        await storage.createAuditLog({
          userId: id,
          performedBy: req.session.userId || null,
          action: "delete_attempt_blocked",
          entityType: "user",
          entityId: id,
          details: `Attempted to delete admin user ${targetUser.email} - action blocked`
        });
        return res.status(403).json({ error: "Cannot delete admin users. Please demote to regular user first." });
      }
      await storage.softDeleteUser(id, req.session.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/users/:id/restore", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.restoreUser(id, req.session.userId);
      const user = await storage.getUser(id);
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/users/deleted", requireAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers(true);
      const deletedUsers = allUsers.filter((u) => u.deletedAt !== null);
      res.json(deletedUsers.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        subscriptionTier: u.subscriptionTier,
        deletedAt: u.deletedAt
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/audit-logs", requireAdmin, async (req, res) => {
    try {
      const { userId, limit } = req.query;
      const logs = await storage.getAuditLogs(
        userId,
        limit ? parseInt(limit) : 100
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/users/:id/audit-logs", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const logs = await storage.getUserAuditLogs(id, limit ? parseInt(limit) : 100);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.set("trust proxy", 1);
app.use(cors({
  origin: [
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "http://localhost:5000",
    "https://novawriter.org",
    "https://nova-write-ai-patobrien2017.replit.app",
    /\.replit\.dev$/,
    /\.picard\.replit\.dev$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
var PgStore = connectPg(session);
app.use(
  session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "novawriter-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      httpOnly: true,
      // For mobile apps (capacitor/ionic), disable secure cookies since they use JWT tokens
      // For web in production, enable secure cookies for cross-origin requests
      secure: process.env.NODE_ENV === "production" ? "auto" : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
