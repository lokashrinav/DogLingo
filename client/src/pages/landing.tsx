import { Card, CardContent } from "@/components/ui/card";
import { Dog, Award, Target, Users, Star, CheckCircle, Play, Menu, X } from "lucide-react";
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
              <Dog className="text-primary" size={28} />
              <span className="text-xl font-bold text-primary">DogLingo</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Reviews</a>
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
            <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-foreground hover:text-primary">Features</a>
                <a href="#how-it-works" className="block px-3 py-2 text-foreground hover:text-primary">How It Works</a>
                <a href="#testimonials" className="block px-3 py-2 text-foreground hover:text-primary">Reviews</a>
                <button 
                  onClick={() => window.location.href = '/api/login'}
                  className="w-full text-left px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  Start Training
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary min-h-screen flex items-center pt-16 polka-dots-accent">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-white">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-300">
                    {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                  </div>
                  <span className="text-white/90">4.9/5 from 12,000+ users</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6" data-testid="hero-title">
                  Train Your Dog Like a Pro
                </h1>
                <p className="text-xl lg:text-2xl opacity-90 mb-8">
                  Interactive lessons, gamified learning, and expert techniques - all in one place
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  data-testid="login-button"
                >
                  <Play size={20} />
                  Start Free Training
                </button>
                <button 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="learn-more-button"
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Works with any dog breed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Expert-designed curriculum</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Features Preview */}
            <div className="text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 polka-dots-card">
                <h3 className="text-2xl font-bold mb-6 text-center">Join the Community</h3>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">50K+</div>
                    <div className="text-white/80 text-sm">Happy Dogs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">200+</div>
                    <div className="text-white/80 text-sm">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">95%</div>
                    <div className="text-white/80 text-sm">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">24/7</div>
                    <div className="text-white/80 text-sm">Support</div>
                  </div>
                </div>

                {/* Quick Feature Preview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Target className="text-secondary" size={20} />
                    <span>Interactive drag-and-drop exercises</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="text-secondary" size={20} />
                    <span>Achievement system with XP rewards</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="text-secondary" size={20} />
                    <span>Progress tracking and analytics</span>
                  </div>
                </div>
              </div>
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
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 polka-dots-subtle">
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30 polka-dots-accent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Dog Owners Everywhere</h2>
            <p className="text-xl text-muted-foreground">
              See what our community has to say about their training success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="polka-dots-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" className="text-yellow-500" />)}
                </div>
                <p className="text-muted-foreground mb-4">
                  "My golden retriever Max went from chaos to calm in just 3 weeks! The interactive lessons made it so easy to understand."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center polka-dots-subtle">
                    <span className="text-primary font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah M.</div>
                    <div className="text-sm text-muted-foreground">Golden Retriever Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="polka-dots-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" className="text-yellow-500" />)}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Finally, a training app that actually works! The gamification kept me motivated and my rescue pup is so much happier."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-subtle">
                    <span className="text-secondary font-bold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold">Mike R.</div>
                    <div className="text-sm text-muted-foreground">Rescue Dog Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="polka-dots-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" className="text-yellow-500" />)}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a first-time dog owner, this was a lifesaver. The step-by-step approach made training feel manageable and fun!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center polka-dots-subtle">
                    <span className="text-accent font-bold">L</span>
                  </div>
                  <div>
                    <div className="font-semibold">Lisa K.</div>
                    <div className="text-sm text-muted-foreground">First-time Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background polka-dots-subtle">
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
              <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-6 polka-dots-card">
                <span className="text-3xl font-bold text-primary-foreground">1</span>
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
      <section className="py-20 bg-primary polka-dots-accent">
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