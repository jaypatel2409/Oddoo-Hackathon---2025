import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-accent font-medium mb-4">
            <Sparkles className="w-5 h-5" />
            <span>Ready to Start Learning?</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Join Thousands of Skill
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Swappers Today
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey of continuous learning and teaching. 
            Connect with amazing people and grow your skillset.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="group">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            Free to join • No credit card required • 2 minutes setup
          </div>
        </div>
      </div>
    </section>
  );
}