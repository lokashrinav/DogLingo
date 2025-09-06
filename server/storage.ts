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
      // 🐕 FORCE CLEAR AND RESEED WITH BARKING LESSONS!
      console.log("🔥 CLEARING ALL DATA FOR BARKING LESSONS TRANSFORMATION!");
      await db.delete(userAchievements);
      await db.delete(userProgress);
      await db.delete(exercises);
      await db.delete(lessons);
      await db.delete(achievements);
      console.log("✅ Database cleared! Now seeding barking lessons...");

      // Seed comprehensive lessons library
      const comprehensiveLessons = [
        // BASIC COMMANDS SERIES (Difficulty 1)
        {
          id: "lesson-001",
          title: "The Art of Basic Woofing",
          description: "Master the subtle nuances of the classic 'woof' - a cornerstone of canine communication with over 47 distinct cultural variations",
          category: "basic-barking",
          difficulty: 1,
          exercises: 5,
          estimatedDuration: 10,
          isLocked: false,
          icon: "fas fa-volume-up",
          order: 1,
        },
        {
          id: "lesson-002", 
          title: "Tuesday vs Wednesday Barks",
          description: "Learn the critical difference between Tuesday barks and Wednesday barks - experts say they're completely different but sound identical to untrained ears",
          category: "basic-barking",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 12,
          isLocked: false,
          icon: "fas fa-calendar-day",
          order: 2,
        },
        {
          id: "lesson-003",
          title: "Indoor vs Outdoor Barks",
          description: "Scientists have discovered that indoor barks contain 23% more emotional resonance than outdoor barks. Can you hear the difference?",
          category: "basic-barking", 
          difficulty: 1,
          exercises: 7,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-home",
          order: 3,
        },
        {
          id: "lesson-004",
          title: "Before vs After Lunch Barks",
          description: "Revolutionary research shows pre-meal barks have distinct quantum frequencies compared to post-meal barks. Master this vital distinction!",
          category: "basic-barking",
          difficulty: 1,
          exercises: 5,
          estimatedDuration: 12,
          isLocked: false,
          icon: "fas fa-utensils",
          order: 4,
        },
        {
          id: "lesson-005",
          title: "Left Paw vs Right Paw Barks",
          description: "Advanced canine linguistics: barks while standing on your left paw carry different emotional weight than right paw barks. Totally not made up!",
          category: "basic-barking",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 18,
          isLocked: false,
          icon: "fas fa-paw",
          order: 5,
        },
        
        // PUPPY SOUNDS SERIES (Difficulty 1-2)
        {
          id: "lesson-101",
          title: "Puppy Yips & Squeaks",
          description: "Learn the high-pitched sounds puppies make - perfect for beginners!",
          category: "puppy-sounds",
          difficulty: 1,
          exercises: 8,
          estimatedDuration: 20,
          isLocked: false,
          icon: "fas fa-baby",
          order: 6,
        },
        {
          id: "lesson-102",
          title: "Play Barks & Invitation Sounds",
          description: "Master the bouncy play bow bark that invites others to play!",
          category: "puppy-sounds",
          difficulty: 1,
          exercises: 6,
          estimatedDuration: 15,
          isLocked: false,
          icon: "fas fa-play",
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
        
        // HOWLING & ADVANCED VOCALS (Difficulty 2-3)
        {
          id: "lesson-201",
          title: "Your First Howl: \"AWOOOOO!\"",
          description: "Learn the majestic art of howling - from short yips to long wolf-like calls",
          category: "howling",
          difficulty: 2,
          exercises: 10,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-moon",
          order: 10,
        },
        {
          id: "lesson-202",
          title: "Territorial Howling",
          description: "Learn the deep, authoritative howl that marks your territory",
          category: "howling",
          difficulty: 2,
          exercises: 8,
          estimatedDuration: 25,
          isLocked: false,
          icon: "fas fa-shield-alt",
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
        
        // BODY LANGUAGE FOR HUMANS (Difficulty 2-3)
        {
          id: "lesson-601",
          title: "Acting Like a Dog: Posture & Movement",
          description: "Learn proper dog posture, tail positions, and how to move like a real dog",
          category: "body-language",
          difficulty: 2,
          exercises: 12,
          estimatedDuration: 35,
          isLocked: false,
          icon: "fas fa-running",
          order: 30,
        },
        {
          id: "lesson-602",
          title: "The Perfect Play Bow",
          description: "Master the classic dog play bow - front end down, rear end up!",
          category: "body-language",
          difficulty: 2,
          exercises: 10,
          estimatedDuration: 30,
          isLocked: false,
          icon: "fas fa-pray",
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

      // Seed comprehensive exercises with audio components
      const comprehensiveExercises = [
        // LESSON 001: The Art of Basic Woofing - 5 exercises  
        {
          id: "exercise-001-001",
          lessonId: "lesson-001",
          type: "audio",
          question: "Listen carefully to this masterful 'woof' - notice the subtle nuances that make it perfect:",
          options: [
            { id: "nuanced", text: "I hear the nuances", description: "Complex emotional layers" },
            { id: "simple", text: "Sounds like woof", description: "You need more training" },
            { id: "profound", text: "Deeply profound", description: "Advanced understanding" }
          ],
          correctAnswer: "nuanced",
          explanation: "Exactly! This woof contains 12 distinct emotional micro-tones that convey complex meaning. Most humans can't detect these subtleties without training.",
          audioUrl: "/audio/barks/masterful-woof.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-001-002",
          lessonId: "lesson-001",
          type: "multiple-choice",
          question: "How many different cultural meanings can a single 'woof' have?",
          options: [
            { id: "47", text: "47 distinct meanings", description: "According to the International Woof Institute" },
            { id: "12", text: "Just 12 meanings", description: "You're underestimating woof complexity" },
            { id: "infinite", text: "Infinite meanings", description: "Too philosophical" },
            { id: "one", text: "It's just woof", description: "Clearly you need this course" }
          ],
          correctAnswer: "47",
          explanation: "Studies show that a basic woof has exactly 47 cultural variants across different dog societies. From the Northern Suburban Woof to the Urban Park Woof, each is unique!",
          audioUrl: "/audio/explanations/woof-cultural-studies.mp3",
          imageUrl: null,
          order: 2,
        },
        {
          id: "exercise-001-003",
          lessonId: "lesson-001",
          type: "drag-drop",
          question: "Match the command timing with the correct hand signal",
          options: [
            { id: "say-sit", text: "Say 'SIT'", description: "Verbal command" },
            { id: "hand-point", text: "Point down", description: "Hand signal pointing toward ground" },
            { id: "reward", text: "Give treat", description: "Positive reinforcement" }
          ],
          correctAnswer: JSON.stringify({
            "say-sit": "step-1",
            "hand-point": "step-2", 
            "reward": "step-3"
          }),
          explanation: "Timing is crucial: verbal command first, then hand signal, then immediate reward when dog complies.",
          audioUrl: "/audio/training/sit-sequence.mp3",
          imageUrl: null,
          order: 3,
        },
        {
          id: "exercise-001-004", 
          lessonId: "lesson-001",
          type: "audio",
          question: "Listen to different dog responses to the SIT command. Which indicates successful training?",
          options: [
            { id: "happy-bark", text: "Excited bark + sits", description: "Dog barks happily then sits immediately" },
            { id: "whine-ignore", text: "Whines and ignores", description: "Dog whines and doesn't respond" },
            { id: "growl-retreat", text: "Growls and backs away", description: "Dog shows fear or aggression" },
            { id: "silent-sit", text: "Quietly sits", description: "Dog calmly complies without vocalization" }
          ],
          correctAnswer: "silent-sit",
          explanation: "The ideal response is calm compliance. Excited barking can indicate over-stimulation, while whining or growling indicates training issues.",
          audioUrl: "/audio/dog-responses/sit-responses.mp3",
          imageUrl: null,
          order: 4,
        },
        {
          id: "exercise-001-005",
          lessonId: "lesson-001", 
          type: "multiple-choice",
          question: "When should you say 'SIT' during training?",
          options: [
            { id: "continuously", text: "Keep repeating until dog sits", description: "Say it over and over" },
            { id: "once-wait", text: "Say it once and wait", description: "Give clear command then pause" },
            { id: "whisper-first", text: "Whisper first, then louder", description: "Start quiet then increase volume" },
            { id: "after-treat", text: "Only after showing treat", description: "Bribe first, command second" }
          ],
          correctAnswer: "once-wait",
          explanation: "Say the command once clearly, then wait. Repeating commands teaches dogs they don't need to respond immediately.",
          audioUrl: "/audio/training/command-timing.mp3",
          imageUrl: null,
          order: 5,
        },

        // LESSON 002: Stay Put: "Stay" Command - 6 exercises  
        {
          id: "exercise-002-001",
          lessonId: "lesson-002",
          type: "audio",
          question: "Practice the correct pronunciation and tone for 'STAY'. Listen and repeat.",
          options: [
            { id: "correct-stay", text: "Calm, steady 'STAY'", description: "Confident but calm delivery" },
            { id: "urgent-stay", text: "Urgent, rushed 'STAY'", description: "Fast, anxious tone" },
            { id: "drawn-out", text: "Long, drawn out 'STAAAY'", description: "Extended vowel sound" }
          ],
          correctAnswer: "correct-stay",
          explanation: "STAY requires a calm, steady tone that conveys patience and control, not urgency or anxiety.",
          audioUrl: "/audio/commands/stay-correct.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-002-002",
          lessonId: "lesson-002",
          type: "drag-drop",
          question: "Match the hand signal with the STAY command variation",
          options: [
            { id: "palm-up", text: "Open palm facing dog", description: "Universal stop signal" },
            { id: "finger-point", text: "Index finger pointing", description: "Directional indicator" },
            { id: "fist-closed", text: "Closed fist", description: "Strong stop signal" },
            { id: "wave", text: "Waving motion", description: "Moving hand signal" }
          ],
          correctAnswer: JSON.stringify({
            "palm-up": "basic-stay",
            "fist-closed": "advanced-stay",
            "finger-point": "directional-stay",
            "wave": "incorrect"
          }),
          explanation: "Open palm is the standard STAY signal. Closed fist is for advanced training. Pointing and waving can confuse the dog.",
          audioUrl: "/audio/training/stay-signals.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 201: Understanding Dog Barks - 10 exercises
        {
          id: "exercise-201-001",
          lessonId: "lesson-201",
          type: "audio",
          question: "Listen to this bark. What is the dog trying to communicate?",
          options: [
            { id: "alert", text: "Alert bark", description: "Warning of approaching person/animal" },
            { id: "play", text: "Play invitation", description: "Wanting to engage in play" },
            { id: "anxiety", text: "Anxiety bark", description: "Stress or fear response" },
            { id: "demand", text: "Demand bark", description: "Asking for attention or treats" }
          ],
          correctAnswer: "alert",
          explanation: "This sharp, repetitive bark indicates the dog is alerting to something in their environment. Notice the consistent rhythm and intensity.",
          audioUrl: "/audio/barks/alert-bark-example.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-201-002",
          lessonId: "lesson-201",
          type: "audio",
          question: "Compare these two barks. Which one indicates happiness?",
          options: [
            { id: "bark-a", text: "Bark A - High pitched, bouncy", description: "Quick, varied tones" },
            { id: "bark-b", text: "Bark B - Low, monotone", description: "Deep, repetitive growl-bark" },
            { id: "both", text: "Both indicate happiness", description: "All barks mean joy" },
            { id: "neither", text: "Neither indicates happiness", description: "These are stress barks" }
          ],
          correctAnswer: "bark-a",
          explanation: "Happy barks are typically higher in pitch with varied tones. Low, monotone barks often indicate stress, warning, or displeasure.",
          audioUrl: "/audio/barks/happy-vs-unhappy.mp3",
          imageUrl: null,
          order: 2,
        },
        {
          id: "exercise-201-003",
          lessonId: "lesson-201",
          type: "multiple-choice",
          question: "What does a single, sharp bark usually indicate?",
          options: [
            { id: "surprise", text: "Surprise or startle", description: "Quick reaction to unexpected stimulus" },
            { id: "loneliness", text: "Loneliness", description: "Extended emotional state" },
            { id: "playfulness", text: "Invitation to play", description: "Social engagement" },
            { id: "aggression", text: "Aggressive warning", description: "Threat display" }
          ],
          correctAnswer: "surprise",
          explanation: "A single, sharp bark is typically a startle response - the dog's immediate reaction to something unexpected.",
          audioUrl: "/audio/explanations/single-bark.mp3",
          imageUrl: null,
          order: 3,
        },
        {
          id: "exercise-201-004",
          lessonId: "lesson-201",
          type: "audio",
          question: "Listen to this continuous barking. What should you do?",
          options: [
            { id: "ignore", text: "Ignore it completely", description: "Don't reinforce attention-seeking" },
            { id: "yell-stop", text: "Yell 'STOP' loudly", description: "Match their energy level" },
            { id: "investigate", text: "Check what's causing it", description: "Look for triggers first" },
            { id: "give-treats", text: "Give treats to quiet them", description: "Immediate positive reinforcement" }
          ],
          correctAnswer: "investigate",
          explanation: "Continuous barking usually has a cause. Investigate first to understand whether it's alert, anxiety, or attention-seeking behavior.",
          audioUrl: "/audio/barks/continuous-barking.mp3",
          imageUrl: null,
          order: 4,
        },

        // LESSON 204: Demand Barking Solutions - 9 exercises
        {
          id: "exercise-204-001",
          lessonId: "lesson-204",
          type: "audio",
          question: "This is classic demand barking. What makes it different from alert barking?",
          options: [
            { id: "rhythm", text: "Rhythmic, repetitive pattern", description: "Consistent beat like a drumroll" },
            { id: "pitch", text: "Higher pitch variations", description: "Goes up and down in tone" },
            { id: "volume", text: "Gradually gets louder", description: "Escalating intensity" },
            { id: "all-above", text: "All of the above", description: "Combination of these features" }
          ],
          correctAnswer: "all-above",
          explanation: "Demand barking typically shows all these patterns: rhythmic repetition, pitch variations, and escalating volume when ignored.",
          audioUrl: "/audio/barks/demand-barking-characteristics.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-204-002",
          lessonId: "lesson-204",
          type: "multiple-choice",
          question: "What's the WORST thing to do when a dog demand barks?",
          options: [
            { id: "ignore-completely", text: "Ignore it completely", description: "Turn away and don't respond" },
            { id: "give-attention", text: "Give them what they want", description: "Pet, treat, or play with them" },
            { id: "redirect-behavior", text: "Redirect to a toy", description: "Offer alternative activity" },
            { id: "use-quiet-command", text: "Teach 'quiet' command", description: "Train alternative behavior" }
          ],
          correctAnswer: "give-attention",
          explanation: "Giving them what they want reinforces the demand barking behavior. This teaches them that barking gets results.",
          audioUrl: "/audio/training/demand-bark-mistakes.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 301: Heel Command - 8 exercises
        {
          id: "exercise-301-001",
          lessonId: "lesson-301",
          type: "audio",
          question: "Practice saying 'HEEL' with the correct tone and emphasis",
          options: [
            { id: "sharp-heel", text: "Sharp, quick 'HEEL'", description: "Abrupt, commanding tone" },
            { id: "drawn-heel", text: "Drawn out 'HEEEEL'", description: "Extended, sing-song tone" },
            { id: "calm-heel", text: "Calm, steady 'HEEL'", description: "Confident but not harsh" }
          ],
          correctAnswer: "calm-heel",
          explanation: "HEEL should be calm and steady, establishing ongoing guidance rather than a sharp correction.",
          audioUrl: "/audio/commands/heel-correct.mp3",
          imageUrl: null,
          order: 1,
        },

        // LESSON 501: Shake Hands & High Five - 5 exercises
        {
          id: "exercise-501-001",
          lessonId: "lesson-501",
          type: "audio",
          question: "Listen to the enthusiastic tone for trick training. Practice saying 'SHAKE'",
          options: [
            { id: "excited-shake", text: "Excited, happy 'SHAKE!'", description: "Upbeat, encouraging tone" },
            { id: "serious-shake", text: "Serious, formal 'shake'", description: "Business-like delivery" },
            { id: "questioning-shake", text: "Uncertain 'shake?'", description: "Hesitant, unsure tone" }
          ],
          correctAnswer: "excited-shake",
          explanation: "Trick training should use an excited, encouraging tone to make it fun and engaging for both you and your dog.",
          audioUrl: "/audio/commands/shake-excited.mp3",
          imageUrl: null,
          order: 1,
        },

        // LESSON 601: Reading Dog Body Language - 12 exercises
        {
          id: "exercise-601-001",
          lessonId: "lesson-601",
          type: "multiple-choice",
          question: "A dog's tail is held high and wagging slowly. What does this indicate?",
          options: [
            { id: "happy-excited", text: "Happy and excited", description: "Ready to play" },
            { id: "confident-alert", text: "Confident and alert", description: "Assessing situation" },
            { id: "nervous-uncertain", text: "Nervous and uncertain", description: "Feeling unsure" },
            { id: "aggressive-warning", text: "Potential aggression", description: "Warning signal" }
          ],
          correctAnswer: "confident-alert",
          explanation: "A high, slowly wagging tail indicates confidence and alertness. The dog is aware and assessing the situation.",
          audioUrl: "/audio/explanations/tail-high-slow.mp3",
          imageUrl: "/images/body-language/tail-high-alert.jpg",
          order: 1,
        },
        {
          id: "exercise-601-002",
          lessonId: "lesson-601",
          type: "multiple-choice", 
          question: "What does it mean when a dog's ears are pinned back against their head?",
          options: [
            { id: "playful", text: "Playful mood", description: "Ready for games" },
            { id: "fearful-submissive", text: "Fearful or submissive", description: "Feeling threatened or uncertain" },
            { id: "aggressive", text: "Aggressive intent", description: "Preparing to attack" },
            { id: "sleepy", text: "Tired and sleepy", description: "Ready for a nap" }
          ],
          correctAnswer: "fearful-submissive",
          explanation: "Ears pinned back typically indicate fear, anxiety, or submission. The dog is showing they're not a threat.",
          audioUrl: "/audio/explanations/ears-pinned-back.mp3",
          imageUrl: "/images/body-language/ears-back.jpg",
          order: 2,
        },

        // LESSON 801: Emotional State Recognition - 10 exercises  
        {
          id: "exercise-801-001",
          lessonId: "lesson-801",
          type: "audio",
          question: "Listen to these subtle vocalizations. What emotional state do you hear?",
          options: [
            { id: "content", text: "Contentment", description: "Soft sighs and quiet sounds" },
            { id: "anxiety", text: "Building anxiety", description: "Slight whines increasing in frequency" },
            { id: "excitement", text: "Contained excitement", description: "Quick, quiet pants and small sounds" },
            { id: "boredom", text: "Boredom", description: "Long sighs and yawns" }
          ],
          correctAnswer: "anxiety",
          explanation: "These subtle whines that increase in frequency indicate building anxiety. Early recognition helps prevent escalation.",
          audioUrl: "/audio/emotions/building-anxiety.mp3",
          imageUrl: null,
          order: 1,
        },

        // Additional exercises for more lessons would continue here...
        // For brevity, I'm including a representative sample of the comprehensive exercise library
        
        // MASTER LEVEL exercises - example
        {
          id: "exercise-master-001-001",
          lessonId: "lesson-master-001",
          type: "drag-drop",
          question: "Create a complete command sequence for a complex real-world scenario: Dog park entry",
          options: [
            { id: "heel", text: "HEEL", description: "Controlled walking" },
            { id: "wait", text: "WAIT", description: "Pause at gate" },
            { id: "okay", text: "OKAY", description: "Release command" },
            { id: "leave-it", text: "LEAVE IT", description: "Ignore distractions" },
            { id: "come", text: "COME", description: "Recall command" },
            { id: "place", text: "PLACE", description: "Designated spot" }
          ],
          correctAnswer: JSON.stringify({
            "heel": "step-1",
            "wait": "step-2",
            "leave-it": "step-3",
            "okay": "step-4",
            "place": "step-5",
            "come": "step-6"
          }),
          explanation: "Master level training chains multiple commands seamlessly: Heel to gate, wait for permission, ignore distractions, enter on release, go to designated spot, return when called.",
          audioUrl: "/audio/sequences/dog-park-entry.mp3",
          imageUrl: null,
          order: 1,
        },

        // LESSON 002: Tuesday vs Wednesday Barks - COMEDY EXERCISES!
        {
          id: "exercise-002-101",
          lessonId: "lesson-002",
          type: "audio",
          question: "Listen to this Tuesday bark. Can you detect the subtle Tuesday energy?",
          options: [
            { id: "tuesday", text: "Definitely Tuesday", description: "Clear weekday vibes" },
            { id: "wednesday", text: "Sounds like Wednesday", description: "You need more training" },
            { id: "weekend", text: "That's a weekend bark", description: "Completely wrong!" }
          ],
          correctAnswer: "tuesday",
          explanation: "Correct! Tuesday barks have 14% more existential dread than Wednesday barks. Science!",
          audioUrl: "/audio/barks/tuesday.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-002-102",
          lessonId: "lesson-002",
          type: "audio",
          question: "🎤 BARK TEST: Bark your best Tuesday bark THREE times! How did it feel?",
          options: [
            { id: "tuesday-perfect", text: "Perfectly Tuesday", description: "You captured the essence" },
            { id: "too-wednesday", text: "Too Wednesday-ish", description: "Try again with less hope" },
            { id: "thursday", text: "Accidentally Thursday", description: "Way off!" }
          ],
          correctAnswer: "tuesday-perfect",
          explanation: "Excellent! Your Tuesday bark contained the perfect amount of 'only 3 more days till Friday' energy!",
          audioUrl: "/audio/practice/bark-test.mp3",
          imageUrl: null,
          order: 2,
        },
        {
          id: "exercise-002-103",
          lessonId: "lesson-002",
          type: "multiple-choice",
          question: "According to the Canine Calendar Institute, what makes Wednesday barks unique?",
          options: [
            { id: "hump", text: "Hump day frequency", description: "Mid-week sonic waves" },
            { id: "monday", text: "Monday residue", description: "That's Tuesday's trait" },
            { id: "friday", text: "Pre-Friday excitement", description: "Too early for that" },
            { id: "same", text: "They're the same", description: "How dare you!" }
          ],
          correctAnswer: "hump",
          explanation: "Yes! Wednesday barks vibrate at exactly 432.5 Hz, the 'hump day frequency' discovered by Dr. Woofington in 2019.",
          audioUrl: null,
          imageUrl: null,
          order: 3,
        },

        // LESSON 003: Indoor vs Outdoor Barks
        {
          id: "exercise-003-001",
          lessonId: "lesson-003",
          type: "audio",
          question: "This is an indoor bark. Notice how it respects the neighbors?",
          options: [
            { id: "indoor", text: "Clearly indoor", description: "Apartment-friendly" },
            { id: "outdoor", text: "That's outdoor", description: "You need ear training" },
            { id: "basement", text: "Basement bark", description: "Too specific!" }
          ],
          correctAnswer: "indoor",
          explanation: "Correct! Indoor barks use 'inside voice' technology - 23% more emotional resonance but 40% less volume!",
          audioUrl: "/audio/barks/indoor.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-003-002",
          lessonId: "lesson-003",
          type: "audio",
          question: "🎤 PRACTICE TIME: Bark FIVE times alternating indoor and outdoor styles!",
          options: [
            { id: "mastered", text: "Mastered both!", description: "Environmental awareness achieved" },
            { id: "confused", text: "Mixed them up", description: "Keep practicing" },
            { id: "neighbors", text: "Neighbors complained", description: "Too authentic!" }
          ],
          correctAnswer: "mastered",
          explanation: "Amazing! You've achieved Environmental Bark Awareness™. Your indoor barks were respectful yet assertive!",
          audioUrl: "/audio/practice/alternating.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 004: Before vs After Lunch Barks
        {
          id: "exercise-004-001",
          lessonId: "lesson-004",
          type: "audio",
          question: "This pre-lunch bark contains hunger frequencies. Can you hear them?",
          options: [
            { id: "hungry", text: "Definitely hungry", description: "Empty stomach acoustics" },
            { id: "full", text: "Sounds satisfied", description: "That's post-meal!" },
            { id: "snack", text: "Just had a snack", description: "Amateur mistake" }
          ],
          correctAnswer: "hungry",
          explanation: "Perfect! Pre-meal barks contain 'quantum hunger particles' that vibrate at the frequency of an empty bowl.",
          audioUrl: "/audio/barks/hungry.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-004-002",
          lessonId: "lesson-004",
          type: "audio",
          question: "🎤 YOUR TURN: Bark like you haven't eaten in 3 hours! Make it convincing!",
          options: [
            { id: "starving", text: "Truly starving", description: "Oscar-worthy performance" },
            { id: "peckish", text: "Just peckish", description: "Need more drama" },
            { id: "full", text: "Sounded full", description: "Method acting fail" }
          ],
          correctAnswer: "starving",
          explanation: "WOW! That bark contained so much hunger, nearby restaurants started preparing food! Professional level!",
          audioUrl: "/audio/practice/hungry-bark.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 005: Left Paw vs Right Paw Barks
        {
          id: "exercise-005-001",
          lessonId: "lesson-005",
          type: "multiple-choice",
          question: "Which paw should you stand on for maximum emotional impact?",
          options: [
            { id: "left", text: "Left paw", description: "The emotional side" },
            { id: "right", text: "Right paw", description: "The logical side" },
            { id: "both", text: "Both paws", description: "That's just standing!" },
            { id: "alternate", text: "Alternate rapidly", description: "That's dancing!" }
          ],
          correctAnswer: "left",
          explanation: "Yes! The left paw connects to the heart chakra, adding 31% more feelings to your bark!",
          audioUrl: null,
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-005-002",
          lessonId: "lesson-005",
          type: "audio",
          question: "🎤 ADVANCED TEST: Bark while hopping on your left foot! Do it 3 times!",
          options: [
            { id: "balanced", text: "Perfect balance", description: "Athletic barking!" },
            { id: "fell", text: "Lost balance", description: "Keep practicing" },
            { id: "dizzy", text: "Got dizzy", description: "Too much spinning" }
          ],
          correctAnswer: "balanced",
          explanation: "Incredible! You've mastered Kinetic Barking™. Your left-footed barks had perfect emotional resonance!",
          audioUrl: "/audio/practice/hopping-bark.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 101: Puppy Yips & Squeaks
        {
          id: "exercise-101-001",
          lessonId: "lesson-101",
          type: "audio",
          question: "Listen to this professional puppy yip. It's 8 weeks old exactly.",
          options: [
            { id: "8weeks", text: "8 weeks old", description: "Precise age detection" },
            { id: "6weeks", text: "6 weeks old", description: "Too young!" },
            { id: "adult", text: "Adult pretending", description: "Caught the faker!" }
          ],
          correctAnswer: "8weeks",
          explanation: "Correct! 8-week-old yips have that perfect blend of innocence and mischief, scientifically proven!",
          audioUrl: "/audio/barks/puppy-yip.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-101-002",
          lessonId: "lesson-101",
          type: "audio",
          question: "🎤 CUTENESS TEST: Make your highest, squeakiest puppy sound! Hold it for 2 seconds!",
          options: [
            { id: "adorable", text: "Absolutely adorable", description: "Hearts melted worldwide" },
            { id: "trying", text: "Trying too hard", description: "Relax into the squeak" },
            { id: "scared-cat", text: "Scared a cat", description: "Wrong species!" }
          ],
          correctAnswer: "adorable",
          explanation: "AWWWW! Your puppy squeak was so cute, 17 people just adopted rescue dogs! That's the power of proper yipping!",
          audioUrl: "/audio/practice/puppy-squeak.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 201: Your First Howl
        {
          id: "exercise-201-001",
          lessonId: "lesson-201",
          type: "audio",
          question: "This is a beginner's howl. Notice the slight wobble at 2.3 seconds?",
          options: [
            { id: "wobble", text: "I hear the wobble", description: "Advanced ear training" },
            { id: "smooth", text: "Sounds smooth", description: "Listen closer" },
            { id: "howl", text: "That's not a howl", description: "It definitely is!" }
          ],
          correctAnswer: "wobble",
          explanation: "Excellent ear! The 2.3-second wobble is called a 'lunar tremolo' - it happens when you think about the moon!",
          audioUrl: "/audio/barks/beginner-howl.mp3",
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-201-002",
          lessonId: "lesson-201",
          type: "audio",
          question: "🎤 HOWL CHALLENGE: Give us your longest AWOOOO! Try to reach the moon!",
          options: [
            { id: "moon", text: "Reached the moon!", description: "NASA confirmed contact" },
            { id: "clouds", text: "Hit the clouds", description: "Good altitude!" },
            { id: "ceiling", text: "Hit the ceiling", description: "Indoor howling fail" }
          ],
          correctAnswer: "moon",
          explanation: "MAGNIFICENT! Your howl was detected by 3 satellites and one confused astronaut! True lunar mastery!",
          audioUrl: "/audio/practice/moon-howl.mp3",
          imageUrl: null,
          order: 2,
        },

        // LESSON 601: Acting Like a Dog - Body Language
        {
          id: "exercise-601-001",
          lessonId: "lesson-601",
          type: "multiple-choice",
          question: "What's the correct tail position for 'cautiously optimistic'?",
          options: [
            { id: "45deg", text: "45-degree angle", description: "Mathematical precision" },
            { id: "straight", text: "Straight up", description: "Too confident!" },
            { id: "tucked", text: "Tucked under", description: "Too pessimistic!" },
            { id: "helicopter", text: "Helicopter spin", description: "That's excitement!" }
          ],
          correctAnswer: "45deg",
          explanation: "Perfect! 45 degrees shows you're hopeful but realistic - the perfect angle for modern life!",
          audioUrl: null,
          imageUrl: null,
          order: 1,
        },
        {
          id: "exercise-601-002",
          lessonId: "lesson-601",
          type: "audio",
          question: "🎤 FULL BODY TEST: Do a play bow and bark 3 times! Film yourself!",
          options: [
            { id: "perfect", text: "Perfect form!", description: "Could fool actual dogs" },
            { id: "human", text: "Still too human", description: "Needs more practice" },
            { id: "yoga", text: "Turned into yoga", description: "Wrong discipline!" }
          ],
          correctAnswer: "perfect",
          explanation: "OUTSTANDING! Your play bow was so authentic, 5 dogs at the park just invited you to their game!",
          audioUrl: "/audio/practice/play-bow-bark.mp3",
          imageUrl: null,
          order: 2,
        }
      ];

      await db.insert(exercises).values(comprehensiveExercises);

      // Seed comprehensive achievements system
      const comprehensiveAchievements = [
        // BEGINNER ACHIEVEMENTS - Basic Commands
        {
          id: "achievement-001",
          title: "First Words Master",
          description: "Successfully completed your first 'SIT' command lesson",
          icon: "fas fa-baby",
          type: "completion",
          requirement: 1,
          xpReward: 100,
        },
        {
          id: "achievement-002",
          title: "Basic Commands Graduate",
          description: "Completed all 5 basic command lessons",
          icon: "fas fa-graduation-cap",
          type: "completion",
          requirement: 5,
          xpReward: 500,
        },
        {
          id: "achievement-003",
          title: "Voice Authority",
          description: "Mastered proper tone and pronunciation for basic commands",
          icon: "fas fa-microphone",
          type: "completion",
          requirement: 10,
          xpReward: 250,
        },

        // PUPPY TRAINING ACHIEVEMENTS
        {
          id: "achievement-101",
          title: "Puppy Whisperer",
          description: "Completed all puppy training lessons",
          icon: "fas fa-heart",
          type: "completion",
          requirement: 4,
          xpReward: 400,
        },
        {
          id: "achievement-102",
          title: "House Training Hero",
          description: "Mastered house training vocabulary and commands",
          icon: "fas fa-home",
          type: "completion",
          requirement: 1,
          xpReward: 200,
        },
        {
          id: "achievement-103",
          title: "Gentle Teacher",
          description: "Successfully learned bite inhibition and gentle commands",
          icon: "fas fa-hand-holding-heart",
          type: "completion",
          requirement: 1,
          xpReward: 300,
        },

        // COMMUNICATION & BARKING ACHIEVEMENTS
        {
          id: "achievement-201",
          title: "Bark Translator",
          description: "Learned to interpret all types of dog barks",
          icon: "fas fa-language",
          type: "completion",
          requirement: 5,
          xpReward: 600,
        },
        {
          id: "achievement-202",
          title: "Sound Detective",
          description: "Can distinguish between alert, anxiety, play, and demand barks",
          icon: "fas fa-search",
          type: "accuracy",
          requirement: 90,
          xpReward: 400,
        },
        {
          id: "achievement-203",
          title: "Vocal Virtuoso",
          description: "Perfect score on understanding dog vocalizations",
          icon: "fas fa-volume-up",
          type: "accuracy",
          requirement: 100,
          xpReward: 500,
        },
        {
          id: "achievement-204",
          title: "Quiet Zone Commander",
          description: "Mastered demand barking solutions and quiet commands",
          icon: "fas fa-volume-mute",
          type: "completion",
          requirement: 1,
          xpReward: 350,
        },

        // ADVANCED TRAINING ACHIEVEMENTS
        {
          id: "achievement-301",
          title: "Advanced Commander",
          description: "Completed all advanced command lessons",
          icon: "fas fa-crown",
          type: "completion",
          requirement: 5,
          xpReward: 750,
        },
        {
          id: "achievement-302",
          title: "Walking Master",
          description: "Perfected heel command and loose-leash walking",
          icon: "fas fa-walking",
          type: "completion",
          requirement: 1,
          xpReward: 300,
        },
        {
          id: "achievement-303",
          title: "Emergency Response Expert",
          description: "Mastered life-saving emergency recall commands",
          icon: "fas fa-exclamation-triangle",
          type: "completion",
          requirement: 1,
          xpReward: 500,
        },
        {
          id: "achievement-304",
          title: "Distance Control Pro",
          description: "Expert at directional commands and send-away training",
          icon: "fas fa-directions",
          type: "completion",
          requirement: 1,
          xpReward: 400,
        },

        // BEHAVIOR MODIFICATION ACHIEVEMENTS  
        {
          id: "achievement-401",
          title: "Behavior Transformer",
          description: "Completed all behavior modification lessons",
          icon: "fas fa-magic",
          type: "completion",
          requirement: 5,
          xpReward: 800,
        },
        {
          id: "achievement-402",
          title: "Jump Prevention Specialist",
          description: "Successfully stopped jumping behavior",
          icon: "fas fa-user-shield",
          type: "completion",
          requirement: 1,
          xpReward: 300,
        },
        {
          id: "achievement-403",
          title: "Bark Control Expert",
          description: "Mastered excessive barking solutions",
          icon: "fas fa-volume-off",
          type: "completion",
          requirement: 1,
          xpReward: 350,
        },
        {
          id: "achievement-404",
          title: "Resource Guardian Angel",
          description: "Prevented resource guarding with proper training",
          icon: "fas fa-shield-alt",
          type: "completion",
          requirement: 1,
          xpReward: 500,
        },

        // TRICK TRAINING ACHIEVEMENTS
        {
          id: "achievement-501",
          title: "Trick Training Entertainer",
          description: "Completed all trick training lessons",
          icon: "fas fa-theater-masks",
          type: "completion",
          requirement: 5,
          xpReward: 600,
        },
        {
          id: "achievement-502",
          title: "Shake & High Five Champion",
          description: "Mastered greeting tricks and paw commands",
          icon: "fas fa-hand-shake",
          type: "completion",
          requirement: 1,
          xpReward: 200,
        },
        {
          id: "achievement-503",
          title: "Roll Over Rockstar",
          description: "Expert at roll over and play dead tricks",
          icon: "fas fa-redo",
          type: "completion",
          requirement: 1,
          xpReward: 250,
        },
        {
          id: "achievement-504",
          title: "Fetch & Bring Specialist",
          description: "Mastered object identification and retrieval",
          icon: "fas fa-paper-plane",
          type: "completion",
          requirement: 1,
          xpReward: 400,
        },

        // BODY LANGUAGE ACHIEVEMENTS
        {
          id: "achievement-601",
          title: "Body Language Reader",
          description: "Expert at reading dog body language and signals",
          icon: "fas fa-eye",
          type: "completion",
          requirement: 4,
          xpReward: 700,
        },
        {
          id: "achievement-602",
          title: "Stress Signal Sensor",
          description: "Can identify all stress signals and calming signs",
          icon: "fas fa-heartbeat",
          type: "completion",
          requirement: 1,
          xpReward: 400,
        },
        {
          id: "achievement-603",
          title: "Play Interpreter",
          description: "Understands all play signals and invitations",
          icon: "fas fa-play",
          type: "completion",
          requirement: 1,
          xpReward: 300,
        },
        {
          id: "achievement-604",
          title: "Safety Guardian",
          description: "Recognizes warning signs and aggression signals",
          icon: "fas fa-shield",
          type: "completion",
          requirement: 1,
          xpReward: 600,
        },

        // AGILITY & SPORTS ACHIEVEMENTS
        {
          id: "achievement-701",
          title: "Agility Athlete",
          description: "Completed all agility training lessons",
          icon: "fas fa-running",
          type: "completion",
          requirement: 3,
          xpReward: 900,
        },
        {
          id: "achievement-702",
          title: "Obstacle Course Conqueror",
          description: "Mastered basic agility commands and obstacles",
          icon: "fas fa-mountain",
          type: "completion",
          requirement: 1,
          xpReward: 400,
        },
        {
          id: "achievement-703",
          title: "Weave Pole Wizard",
          description: "Expert at precise weave pole navigation",
          icon: "fas fa-sort",
          type: "completion",
          requirement: 1,
          xpReward: 500,
        },

        // ADVANCED COMMUNICATION ACHIEVEMENTS
        {
          id: "achievement-801",
          title: "Emotion Reader",
          description: "Can recognize subtle emotional states in dogs",
          icon: "fas fa-brain",
          type: "completion",
          requirement: 3,
          xpReward: 800,
        },
        {
          id: "achievement-802",
          title: "Pack Dynamics Expert",
          description: "Understands multi-dog communication patterns",
          icon: "fas fa-users",
          type: "completion",
          requirement: 1,
          xpReward: 600,
        },
        {
          id: "achievement-803",
          title: "Bond Builder",
          description: "Mastered human-dog bonding communication",
          icon: "fas fa-heart",
          type: "completion",
          requirement: 1,
          xpReward: 500,
        },

        // SPECIALIZED TRAINING ACHIEVEMENTS
        {
          id: "achievement-901",
          title: "Service Dog Foundation Expert",
          description: "Completed service dog basics training",
          icon: "fas fa-medical-cross",
          type: "completion",
          requirement: 1,
          xpReward: 1000,
        },
        {
          id: "achievement-902",
          title: "Therapy Dog Trainer",
          description: "Mastered therapy dog skills and techniques",
          icon: "fas fa-heart-pulse",
          type: "completion",
          requirement: 1,
          xpReward: 800,
        },
        {
          id: "achievement-903",
          title: "Search & Rescue Specialist",
          description: "Expert in scent work and search commands",
          icon: "fas fa-search",
          type: "completion",
          requirement: 1,
          xpReward: 1200,
        },

        // MASTER LEVEL ACHIEVEMENTS
        {
          id: "achievement-master-001",
          title: "Alpha Dog",
          description: "Mastered ALL barking techniques - you are now fluent in Dog!",
          icon: "fas fa-crown",
          type: "completion",
          requirement: 45,
          xpReward: 2000,
        },
        {
          id: "achievement-master-002",
          title: "Command Integration Virtuoso",
          description: "Mastered complex command sequences",
          icon: "fas fa-crown",
          type: "completion",
          requirement: 1,
          xpReward: 1500,
        },
        {
          id: "achievement-master-003",
          title: "Environmental Adaptation Expert",
          description: "Commands work in any environment",
          icon: "fas fa-globe",
          type: "completion",
          requirement: 1,
          xpReward: 1200,
        },
        {
          id: "achievement-master-004",
          title: "Telepathic Communicator",
          description: "Achieved wordless communication mastery",
          icon: "fas fa-magic",
          type: "completion",
          requirement: 1,
          xpReward: 2500,
        },

        // STREAK & CONSISTENCY ACHIEVEMENTS
        {
          id: "achievement-streak-001",
          title: "Daily Trainer",
          description: "3-day training streak",
          icon: "fas fa-fire",
          type: "streak",
          requirement: 3,
          xpReward: 150,
        },
        {
          id: "achievement-streak-002",
          title: "Week Warrior",
          description: "7-day training streak",
          icon: "fas fa-calendar-week",
          type: "streak",
          requirement: 7,
          xpReward: 300,
        },
        {
          id: "achievement-streak-003",
          title: "Month Master",
          description: "30-day training streak",
          icon: "fas fa-calendar",
          type: "streak",
          requirement: 30,
          xpReward: 1000,
        },
        {
          id: "achievement-streak-004",
          title: "Consistency Champion",
          description: "100-day training streak",
          icon: "fas fa-medal",
          type: "streak",
          requirement: 100,
          xpReward: 2500,
        },

        // ACCURACY & PERFORMANCE ACHIEVEMENTS
        {
          id: "achievement-accuracy-001",
          title: "Perfect Practice",
          description: "100% accuracy on 10 lessons",
          icon: "fas fa-bullseye",
          type: "accuracy",
          requirement: 100,
          xpReward: 500,
        },
        {
          id: "achievement-accuracy-002",
          title: "Precision Trainer",
          description: "95% or higher accuracy on 25 lessons",
          icon: "fas fa-crosshairs",
          type: "accuracy",
          requirement: 95,
          xpReward: 750,
        },
        {
          id: "achievement-accuracy-003",
          title: "Excellence Expert",
          description: "90% or higher accuracy on 50 lessons",
          icon: "fas fa-star",
          type: "accuracy",
          requirement: 90,
          xpReward: 1200,
        },

        // SPECIAL MILESTONE ACHIEVEMENTS  
        {
          id: "achievement-milestone-001",
          title: "First Bark Decoded",
          description: "Successfully identified your first bark type",
          icon: "fas fa-volume-up",
          type: "milestone",
          requirement: 1,
          xpReward: 200,
        },
        {
          id: "achievement-milestone-002",
          title: "Voice Command Virtuoso",
          description: "Recorded and practiced 50 voice commands",
          icon: "fas fa-microphone-alt",
          type: "milestone",
          requirement: 50,
          xpReward: 800,
        },
        {
          id: "achievement-milestone-003",
          title: "DogLingo Scholar",
          description: "Completed lessons from every category",
          icon: "fas fa-book",
          type: "milestone",
          requirement: 10,
          xpReward: 1500,
        }
      ];

      await db.insert(achievements).values(comprehensiveAchievements);

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
