import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Users, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "List your skills and what you'd like to learn. Add your availability and preferences.",
    color: "text-primary"
  },
  {
    icon: Search,
    title: "Find & Connect",
    description: "Browse skills or search for specific expertise. Send swap requests to fellow learners.",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Exchange Skills",
    description: "Meet up (virtually or in-person) to share knowledge and learn from each other.",
    color: "text-primary"
  },
  {
    icon: Star,
    title: "Rate & Grow",
    description: "Leave feedback after your exchange. Build your reputation in the community.",
    color: "text-accent"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and begin exchanging skills with our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-background to-muted flex items-center justify-center shadow-lg`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}