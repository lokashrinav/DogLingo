import { 
  type User, 
  type InsertUser,
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
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

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

      // Seed comprehensive lessons library
      const comprehensiveLessons = [
        // BASIC COMMANDS SERIES (Difficulty 1)
        {
          id: "lesson-001",
          title: "First Words: \"Sit\"",
          description: "Master the fundamental \"sit\" command with proper voice tone and body language",
          category: "basic-commands",
          difficulty: 1,
          exercises: 5,
          estimatedDuration: 10,
          isLocked: false,
          icon: "fas fa-chair",
          order: 1,
        },
        {
          id: "lesson-002", 
          title: "Stay Put: \"Stay\" Command",
          description: "Learn to use \"stay\" with hand signals and voice modulation",
          category: "basic-commands",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 12,
          isLocked: false,
          icon: "fas fa-hand-paper",
          order: 2,
        },
        {
          id: "lesson-003",
          title: "Come Here: \"Come\" Recall",
          description: "Perfect the recall command with excitement and proper intonation",
          category: "basic-commands", 
          difficulty: 1,
          exercises: 7,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-running",
          order: 3,
        },
        {
          id: "lesson-004",
          title: "Down & Out: \"Down\" Command",
          description: "Master the down position command with authoritative yet gentle tone",
          category: "basic-commands",
          difficulty: 1,
          exercises: 5,
          estimatedDuration: 12,
          isLocked: false,
          icon: "fas fa-angle-down",
          order: 4,
        },
        {
          id: "lesson-005",
          title: "Wait Your Turn: \"Wait\" vs \"Stay\"",
          description: "Learn the difference between wait and stay commands",
          category: "basic-commands",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 18,
          isLocked: false,
          icon: "fas fa-clock",
          order: 5,
        },
        
        // PUPPY TRAINING SERIES (Difficulty 1-2)
        {
          id: "lesson-101",
          title: "Puppy's First Words",
          description: "Introduction to voice commands for 8-16 week old puppies",
          category: "puppy-training",
          difficulty: 1,
          exercises: 8,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-baby",
          order: 6,
        },
        {
          id: "lesson-102",
          title: "House Training Vocabulary",
          description: "Essential commands for potty training and house rules",
          category: "puppy-training",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-home",
          order: 7,
        },
        {
          id: "lesson-103",
          title: "Puppy Bite Inhibition",
          description: "Teach \"gentle\" and \"no bite\" commands with proper tone",
          category: "puppy-training",
          difficulty: 2,
          exercises: 7,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-teeth",
          order: 8,
        },
        {
          id: "lesson-104",
          title: "Crate Training Commands",
          description: "\"Crate\", \"bed\", and \"place\" commands for safe spaces",
          category: "puppy-training",
          difficulty: 1,
          exercises: 5,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-bed",
          order: 9,
        },
        
        // DOG COMMUNICATION & BARKING (Difficulty 2-3)
        {
          id: "lesson-201",
          title: "Understanding Dog Barks",
          description: "Learn to interpret different types of barks and their meanings",
          category: "communication",
          difficulty: 2,
          exercises: 10,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-volume-up",
          order: 10,
        },
        {
          id: "lesson-202",
          title: "Alert Bark vs Anxiety Bark",
          description: "Distinguish between protective barking and stress barking",
          category: "communication",
          difficulty: 2,
          exercises: 8,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-exclamation-triangle",
          order: 11,
        },
        {
          id: "lesson-203",
          title: "Play Barks & Happy Sounds",
          description: "Recognize joyful vocalizations and play invitations",
          category: "communication",
          difficulty: 2,
          exercises: 6,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-laugh",
          order: 12,
        },
        {
          id: "lesson-204",
          title: "Demand Barking Solutions",
          description: "Address attention-seeking and demanding barks",
          category: "communication",
          difficulty: 3,
          exercises: 9,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-hand-point-up",
          order: 13,
        },
        {
          id: "lesson-205",
          title: "Fear & Stress Vocalizations",
          description: "Identify and respond to fearful whines, yelps, and stress signals",
          category: "communication",
          difficulty: 3,
          exercises: 8,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-heart-broken",
          order: 14,
        },
        
        // ADVANCED COMMANDS (Difficulty 2-3)
        {
          id: "lesson-301",
          title: "Heel: Perfect Walking",
          description: "Master loose-leash walking with heel command",
          category: "advanced-commands",
          difficulty: 2,
          exercises: 8,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-walking",
          order: 15,
        },
        {
          id: "lesson-302",
          title: "Place & Stay Advanced",
          description: "Extended place command with duration and distractions",
          category: "advanced-commands",
          difficulty: 3,
          exercises: 7,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-map-marker-alt",
          order: 16,
        },
        {
          id: "lesson-303",
          title: "Leave It & Drop It",
          description: "Impulse control with \"leave it\" and \"drop it\" commands",
          category: "advanced-commands",
          difficulty: 2,
          exercises: 9,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-times-circle",
          order: 17,
        },
        {
          id: "lesson-304",
          title: "Emergency Recall",
          description: "Life-saving recall command for dangerous situations",
          category: "advanced-commands",
          difficulty: 3,
          exercises: 6,
          estimatedDuration: 40,
          isLocked: false,
          icon: "fas fa-exclamation",
          order: 18,
        },
        {
          id: "lesson-305",
          title: "Go To Place/Send Away",
          description: "Directional commands and distance control",
          category: "advanced-commands",
          difficulty: 3,
          exercises: 8,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-directions",
          order: 19,
        },
        
        // BEHAVIOR MODIFICATION (Difficulty 2-4)
        {
          id: "lesson-401",
          title: "Stop Jumping on People",
          description: "Redirect jumping behavior with \"off\" and \"sit\" commands",
          category: "behavior-modification",
          difficulty: 2,
          exercises: 7,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-user-times",
          order: 20,
        },
        {
          id: "lesson-402",
          title: "Excessive Barking Solutions",
          description: "\"Quiet\" command and bark control techniques",
          category: "behavior-modification",
          difficulty: 3,
          exercises: 8,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-volume-mute",
          order: 21,
        },
        {
          id: "lesson-403",
          title: "Resource Guarding Prevention",
          description: "\"Share\" and \"gentle\" commands for food and toy guarding",
          category: "behavior-modification",
          difficulty: 4,
          exercises: 10,
          estimatedDuration: 45,
          isLocked: false,
          icon: "fas fa-shield-alt",
          order: 22,
        },
        {
          id: "lesson-404",
          title: "Leash Pulling Solutions",
          description: "\"Easy\" and \"with me\" commands for better leash manners",
          category: "behavior-modification",
          difficulty: 3,
          exercises: 9,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-link",
          order: 23,
        },
        {
          id: "lesson-405",
          title: "Counter Surfing Prevention",
          description: "\"Leave it\" and \"place\" for kitchen counter behavior",
          category: "behavior-modification",
          difficulty: 2,
          exercises: 6,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-utensils",
          order: 24,
        },
        
        // TRICK TRAINING (Difficulty 2-3)
        {
          id: "lesson-501",
          title: "Shake Hands & High Five",
          description: "Fun greeting tricks with \"shake\" and \"high five\"",
          category: "tricks",
          difficulty: 2,
          exercises: 5,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-hand-shake",
          order: 25,
        },
        {
          id: "lesson-502",
          title: "Roll Over & Play Dead",
          description: "Classic tricks with \"roll over\" and \"bang\" commands",
          category: "tricks",
          difficulty: 2,
          exercises: 6,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-redo",
          order: 26,
        },
        {
          id: "lesson-503",
          title: "Spin & Turn Around",
          description: "Directional spinning with \"spin\" and \"turn\" commands",
          category: "tricks",
          difficulty: 2,
          exercises: 4,
          estimatedDuration: 12,
          isLocked: false,
          icon: "fas fa-sync-alt",
          order: 27,
        },
        {
          id: "lesson-504",
          title: "Fetch & Bring Specific Items",
          description: "Object identification with \"bring\" and \"fetch\" commands",
          category: "tricks",
          difficulty: 3,
          exercises: 8,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-paper-plane",
          order: 28,
        },
        {
          id: "lesson-505",
          title: "Speak & Quiet on Command",
          description: "Controlled barking with \"speak\" and \"quiet\" commands",
          category: "tricks",
          difficulty: 3,
          exercises: 7,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-comment",
          order: 29,
        },
        
        // BODY LANGUAGE & SIGNALS (Difficulty 2-3)
        {
          id: "lesson-601",
          title: "Reading Dog Body Language",
          description: "Understand tail wagging, ear positions, and posture",
          category: "body-language",
          difficulty: 2,
          exercises: 12,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-eye",
          order: 30,
        },
        {
          id: "lesson-602",
          title: "Stress Signals & Calming Signs",
          description: "Recognize when your dog is stressed or uncomfortable",
          category: "body-language",
          difficulty: 2,
          exercises: 10,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-heartbeat",
          order: 31,
        },
        {
          id: "lesson-603",
          title: "Play Bow & Play Signals",
          description: "Understand when dogs want to play and how they communicate it",
          category: "body-language",
          difficulty: 2,
          exercises: 8,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-play",
          order: 32,
        },
        {
          id: "lesson-604",
          title: "Warning Signs & Aggression",
          description: "Critical safety: recognize warning signs before aggression",
          category: "body-language",
          difficulty: 3,
          exercises: 11,
          estimatedDuration: 40,
          isLocked: false,
          icon: "fas fa-warning",
          order: 33,
        },
        
        // AGILITY & SPORTS (Difficulty 3-4)
        {
          id: "lesson-701",
          title: "Basic Agility Commands",
          description: "\"Over\", \"through\", and \"around\" for obstacle courses",
          category: "agility",
          difficulty: 3,
          exercises: 9,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-running",
          order: 34,
        },
        {
          id: "lesson-702",
          title: "Weave Poles & Precision",
          description: "\"Weave\" command for pole navigation",
          category: "agility",
          difficulty: 4,
          exercises: 7,
          estimatedDuration: 40,
          isLocked: false,
          icon: "fas fa-sort",
          order: 35,
        },
        {
          id: "lesson-703",
          title: "Contact Obstacles",
          description: "\"Touch\" and \"wait\" for A-frames and dog walks",
          category: "agility",
          difficulty: 4,
          exercises: 8,
          estimatedDuration: 45,
          isLocked: false,
          icon: "fas fa-mountain",
          order: 36,
        },
        
        // ADVANCED COMMUNICATION (Difficulty 3-4)
        {
          id: "lesson-801",
          title: "Emotional State Recognition",
          description: "Advanced: reading subtle emotional changes in dogs",
          category: "advanced-communication",
          difficulty: 3,
          exercises: 10,
          estimatedDuration: 40,
          isLocked: false,
          icon: "fas fa-brain",
          order: 37,
        },
        {
          id: "lesson-802",
          title: "Pack Communication Dynamics",
          description: "Understanding multi-dog household communication",
          category: "advanced-communication",
          difficulty: 4,
          exercises: 12,
          estimatedDuration: 50,
          isLocked: false,
          icon: "fas fa-users",
          order: 38,
        },
        {
          id: "lesson-803",
          title: "Human-Dog Bonding Signals",
          description: "Build deeper connection through proper communication",
          category: "advanced-communication",
          difficulty: 3,
          exercises: 9,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-heart",
          order: 39,
        },
        
        // SPECIALIZED TRAINING (Difficulty 4-5)
        {
          id: "lesson-901",
          title: "Service Dog Foundations",
          description: "Basic service dog tasks and public access skills",
          category: "specialized",
          difficulty: 4,
          exercises: 15,
          estimatedDuration: 60,
          isLocked: false,
          icon: "fas fa-medical-cross",
          order: 40,
        },
        {
          id: "lesson-902",
          title: "Therapy Dog Skills",
          description: "Calm, controlled behavior for therapy work",
          category: "specialized",
          difficulty: 4,
          exercises: 12,
          estimatedDuration: 45,
          isLocked: false,
          icon: "fas fa-heart-pulse",
          order: 41,
        },
        {
          id: "lesson-903",
          title: "Search & Rescue Basics",
          description: "Scent work and search commands",
          category: "specialized",
          difficulty: 5,
          exercises: 10,
          estimatedDuration: 55,
          isLocked: false,
          icon: "fas fa-search",
          order: 42,
        },
        
        // MASTER LEVEL (Difficulty 5)
        {
          id: "lesson-master-001",
          title: "Complete Command Integration",
          description: "Chain multiple commands in complex sequences",
          category: "master",
          difficulty: 5,
          exercises: 20,
          estimatedDuration: 90,
          isLocked: false,
          icon: "fas fa-crown",
          order: 43,
        },
        {
          id: "lesson-master-002",
          title: "Environmental Adaptability",
          description: "Commands in any environment with any distractions",
          category: "master",
          difficulty: 5,
          exercises: 15,
          estimatedDuration: 75,
          isLocked: false,
          icon: "fas fa-globe",
          order: 44,
        },
        {
          id: "lesson-master-003",
          title: "Telepathic Communication",
          description: "Advanced: subtle cues and wordless communication",
          category: "master",
          difficulty: 5,
          exercises: 18,
          estimatedDuration: 80,
          isLocked: false,
          icon: "fas fa-magic",
          order: 45,
        }
      ];

      await db.insert(lessons).values(comprehensiveLessons);

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

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!username) return undefined;
    const [user] = await db.select().from(users).where(eq(users.username, username));
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
