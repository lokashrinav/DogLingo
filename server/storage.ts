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
  type InsertUserAchievement
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample lessons
    const basicCommands: Lesson = {
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
    };

    const advancedCommands: Lesson = {
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
    };

    this.lessons.set(basicCommands.id, basicCommands);
    this.lessons.set(advancedCommands.id, advancedCommands);

    // Create sample exercises
    const exercise1: Exercise = {
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

    this.exercises.set(exercise1.id, exercise1);

    // Create sample achievements
    const achievements = [
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

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Create sample user
    const sampleUser: User = {
      id: "user-1",
      username: "alex",
      email: "alex@example.com",
      dogName: "Buddy",
      streak: 7,
      totalXp: 450,
      createdAt: new Date(),
    };

    this.users.set(sampleUser.id, sampleUser);

    // Create sample progress
    const progress1: UserProgress = {
      id: "progress-1",
      userId: "user-1",
      lessonId: "lesson-1",
      completed: true,
      score: 100,
      attempts: 1,
      lastAttempt: new Date(),
    };

    const progress2: UserProgress = {
      id: "progress-2", 
      userId: "user-1",
      lessonId: "lesson-2",
      completed: false,
      score: 75,
      attempts: 1,
      lastAttempt: new Date(),
    };

    this.userProgress.set(progress1.id, progress1);
    this.userProgress.set(progress2.id, progress2);

    // Create sample user achievements
    const userAchievement1: UserAchievement = {
      id: "user-achievement-1",
      userId: "user-1",
      achievementId: "achievement-1",
      unlockedAt: new Date(),
    };

    this.userAchievements.set(userAchievement1.id, userAchievement1);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      streak: insertUser.streak ?? 0,
      totalXp: insertUser.totalXp ?? 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { 
      ...insertLesson, 
      id, 
      difficulty: insertLesson.difficulty ?? 1,
      isLocked: insertLesson.isLocked ?? false
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Exercise methods
  async getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.lessonId === lessonId)
      .sort((a, b) => a.order - b.order);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = { 
      ...insertExercise, 
      id,
      explanation: insertExercise.explanation ?? null,
      audioUrl: insertExercise.audioUrl ?? null,
      imageUrl: insertExercise.imageUrl ?? null
    };
    this.exercises.set(id, exercise);
    return exercise;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values())
      .find(progress => progress.userId === userId && progress.lessonId === lessonId);
  }

  async updateUserProgress(userId: string, lessonId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const existing = await this.getLessonProgress(userId, lessonId);
    
    if (existing) {
      const updated = { ...existing, ...updates, lastAttempt: new Date() };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newProgress: UserProgress = {
        id,
        userId,
        lessonId,
        completed: false,
        score: 0,
        attempts: 0,
        lastAttempt: new Date(),
        ...updates,
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(userAchievement => userAchievement.userId === userId);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const id = randomUUID();
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      unlockedAt: new Date(),
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }
}

export const storage = new MemStorage();
