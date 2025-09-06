import { Card, CardContent } from "@/components/ui/card";
import { Dog, Award, Target, Users, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50 polka-dots-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Dog className="text-secondary" size={28} />
              <span className="text-xl font-bold text-secondary">DogLingo</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground hover:text-secondary transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground hover:text-secondary transition-colors">How It Works</a>
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                data-testid="nav-login-button"
              >
                Start Training
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-sm polka-dots-subtle">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-foreground hover:text-secondary">Features</a>
                <a href="#how-it-works" className="block px-3 py-2 text-foreground hover:text-secondary">How It Works</a>
                <button 
                  onClick={() => window.location.href = '/api/login'}
                  className="w-full text-left px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium"
                >
                  Start Training
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-secondary min-h-screen flex items-center pt-16 polka-dots-accent">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 polka-dots-card">
                <Dog size={48} className="text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="hero-title">
                DogLingo
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 mb-4 max-w-3xl mx-auto">
                Master dog training commands through interactive lessons, just like learning a new language
              </p>
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                Join thousands of dog owners using gamified learning to build stronger bonds with their pets
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-white text-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
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
      <section id="features" className="py-20 bg-background polka-dots-subtle">
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
            <Card className="border border-border hover:shadow-lg transition-shadow polka-dots-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-6 polka-dots-subtle">
                  <Target className="text-secondary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4" data-testid="feature-interactive">
                  Interactive Lessons
                </h3>
                <p className="text-muted-foreground">
                  Learn through drag-and-drop exercises, audio pronunciation guides, and hands-on practice
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:shadow-lg transition-shadow polka-dots-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-6 polka-dots-subtle">
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

            <Card className="border border-border hover:shadow-lg transition-shadow polka-dots-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-6 polka-dots-subtle">
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
      <section id="how-it-works" className="py-20 bg-muted/30 polka-dots-accent">
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
              <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6 polka-dots-card">
                <span className="text-3xl font-bold text-secondary-foreground">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Choose Your Level</h3>
              <p className="text-muted-foreground">
                Start with basic commands like "sit" and "stay", or jump into advanced tricks and behaviors
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6 polka-dots-card">
                <span className="text-3xl font-bold text-secondary-foreground">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Interactive Practice</h3>
              <p className="text-muted-foreground">
                Use our drag-and-drop exercises to match commands with hand signals and practice pronunciation
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-6 polka-dots-card">
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
      <section className="py-20 bg-secondary polka-dots-accent">
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
              className="bg-white text-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
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