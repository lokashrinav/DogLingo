import { Card, CardContent } from "@/components/ui/card";
import { Dog, Award, Target, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Dog size={48} className="text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="hero-title">
                DogLingo
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
                Master dog training commands through interactive lessons, just like learning a new language
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                data-testid="login-button"
              >
                Start Training
              </button>
              <button 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="learn-more-button"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="features-title">
              Why Choose DogLingo?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our gamified approach makes dog training engaging and effective for both you and your furry friend
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <Target className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4" data-testid="feature-interactive">
                  Interactive Lessons
                </h3>
                <p className="text-muted-foreground">
                  Learn through drag-and-drop exercises, audio pronunciation guides, and hands-on practice
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                  <Award className="text-secondary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4" data-testid="feature-achievements">
                  Achievement System
                </h3>
                <p className="text-muted-foreground">
                  Unlock badges and earn XP as you progress. Maintain streaks to build consistent training habits
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4" data-testid="feature-progress">
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground">
                  Monitor your dog's learning journey with detailed analytics and personalized recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="how-it-works-title">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to better communication with your dog
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Choose Your Level</h3>
              <p className="text-muted-foreground">
                Start with basic commands like "sit" and "stay", or jump into advanced tricks and behaviors
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-secondary-foreground">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Interactive Practice</h3>
              <p className="text-muted-foreground">
                Use our drag-and-drop exercises to match commands with hand signals and practice pronunciation
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Train Together</h3>
              <p className="text-muted-foreground">
                Apply what you've learned with your dog and track your progress as you both improve together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4" data-testid="cta-title">
              Ready to Start Your Dog Training Journey?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of dog owners who have strengthened their bond through better communication
            </p>
            <button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              data-testid="cta-login-button"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}