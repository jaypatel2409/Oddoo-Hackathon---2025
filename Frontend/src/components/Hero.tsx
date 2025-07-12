import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/50 to-accent/10">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-accent font-medium">
                <Zap className="w-5 h-5" />
                <span>Swap Skills, Build Community</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Exchange Skills,
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Expand Horizons
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Connect with others to trade your expertise. Teach what you know, learn what you need. 
                Build meaningful relationships through skill sharing.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">10K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <span className="font-semibold">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold">500+ Skills</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="group">
                  Start Swapping Skills
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="lg">
                  Explore Skills
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="People sharing and exchanging various skills" 
                className="w-full h-auto rounded-2xl shadow-elegant"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-elegant border animate-float" style={{animationDelay: '2s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="font-medium">Live skill exchanges happening now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}