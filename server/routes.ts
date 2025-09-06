import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth routes are now handled in auth.ts

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Update user streak and XP
  app.patch("/api/user/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get all lessons
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Get lesson by ID
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Get exercises for a lesson
  app.get("/api/lessons/:id/exercises", async (req, res) => {
    try {
      const { id } = req.params;
      const exercises = await storage.getExercisesByLesson(id);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  // Get user progress
  app.get("/api/user/:userId/progress", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update lesson progress
  app.post("/api/user/:userId/progress", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const progressData = insertUserProgressSchema.parse(req.body);
      
      const progress = await storage.updateUserProgress(
        userId, 
        progressData.lessonId, 
        progressData
      );
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user achievements
  app.get("/api/user/:userId/achievements", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const userAchievements = await storage.getUserAchievements(userId);
      
      // Get achievement details
      const achievements = await storage.getAchievements();
      const achievementMap = new Map(achievements.map(a => [a.id, a]));
      
      const enrichedAchievements = userAchievements.map(ua => ({
        ...ua,
        achievement: achievementMap.get(ua.achievementId)
      }));
      
      res.json(enrichedAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Unlock achievement
  app.post("/api/user/:userId/achievements", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const { achievementId } = req.body;
      
      const userAchievement = await storage.unlockAchievement(userId, achievementId);
      res.json(userAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to unlock achievement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
