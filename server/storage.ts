import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Lesson,
  type InsertLesson,
  type Exercise,
  type InsertExercise,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  users,
  lessons,
  exercises,
  userProgress,
  achievements,
  userAchievements
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Lessons
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Exercises
  getExercisesByLesson(lessonId: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getLessonProgress(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, lessonId: string, progress: Partial<UserProgress>): Promise<UserProgress>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Seed data will be handled by database migration
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if lessons already exist
      const existingLessons = await db.select().from(lessons);
      if (existingLessons.length > 0) return;

      // Seed lessons
      const sampleLessons = [
        {
          id: "lesson-1",
          title: "Basic Commands",
          description: "Learn sit, stay, and down commands",
          category: "basics",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-graduation-cap",
          order: 1,
        },
        {
          id: "lesson-2",
          title: "Advanced Commands",
          description: "Master complex behaviors and tricks",
          category: "advanced",
          difficulty: 2,
          exercises: 8,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-running",
          order: 2,
        }
      ];

      await db.insert(lessons).values(sampleLessons);

      // Seed exercises
      const sampleExercise = {
        id: "exercise-1",
        lessonId: "lesson-2",
        type: "drag-drop",
        question: "Match the command with the correct hand signal",
        options: [
          { id: "sit", text: "SIT", description: "Basic sitting position" },
          { id: "stay", text: "STAY", description: "Remain in position" },
          { id: "come", text: "COME", description: "Return to owner" }
        ],
        correctAnswer: JSON.stringify({
          "sit": "pointing-down",
          "stay": "palm-up", 
          "come": "open-palm"
        }),
        explanation: "Each command has a specific hand signal that helps reinforce the verbal command",
        audioUrl: "/audio/commands.mp3",
        imageUrl: null,
        order: 1,
      };

      await db.insert(exercises).values([sampleExercise]);

      // Seed achievements
      const sampleAchievements = [
        {
          id: "achievement-1",
          title: "First Command Master",
          description: "Completed your first \"Sit\" lesson",
          icon: "fas fa-medal",
          type: "completion",
          requirement: 1,
          xpReward: 100,
        },
        {
          id: "achievement-2", 
          title: "Week Warrior",
          description: "7-day training streak",
          icon: "fas fa-fire",
          type: "streak",
          requirement: 7,
          xpReward: 200,
        },
        {
          id: "achievement-3",
          title: "Perfect Practice",
          description: "100% lesson accuracy",
          icon: "fas fa-paw",
          type: "accuracy",
          requirement: 100,
          xpReward: 150,
        }
      ];

      await db.insert(achievements).values(sampleAchievements);

      console.log("Database seeded successfully");
    } catch (error) {
      console.warn("Failed to seed database:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        streak: insertUser.streak ?? 0,
        totalXp: insertUser.totalXp ?? 0,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).orderBy(lessons.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values({
        ...insertLesson,
        difficulty: insertLesson.difficulty ?? 1,
        isLocked: insertLesson.isLocked ?? false
      })
      .returning();
    return lesson;
  }

  // Exercise methods
  async getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.lessonId, lessonId))
      .orderBy(exercises.order);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values({
        ...insertExercise,
        explanation: insertExercise.explanation ?? null,
        audioUrl: insertExercise.audioUrl ?? null,
        imageUrl: insertExercise.imageUrl ?? null
      })
      .returning();
    return exercise;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress;
  }

  async updateUserProgress(userId: string, lessonId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const existing = await this.getLessonProgress(userId, lessonId);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({ ...updates, lastAttempt: new Date() })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          lessonId,
          completed: false,
          score: 0,
          attempts: 0,
          ...updates,
        })
        .returning();
      return newProgress;
    }
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
      })
      .returning();
    return userAchievement;
  }
}

export const storage = new DatabaseStorage();
