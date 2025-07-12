import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Graphic Designer",
    avatar: "SC",
    content: "I taught Photoshop and learned Spanish cooking. Amazing experience connecting with people who share the passion for learning!",
    rating: 5,
    skills: "Photoshop ↔ Spanish Cooking"
  },
  {
    name: "Marcus Rodriguez", 
    role: "Software Developer",
    avatar: "MR",
    content: "Exchanged Python lessons for guitar tutorials. The platform made it so easy to find the perfect skill match.",
    rating: 5,
    skills: "Python ↔ Guitar"
  },
  {
    name: "Emily Johnson",
    role: "Marketing Manager", 
    avatar: "EJ",
    content: "Love how organized and safe the platform feels. Great community of learners who genuinely want to help each other grow.",
    rating: 5,
    skills: "Digital Marketing ↔ Yoga"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from skill swappers in our growing community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm bg-accent/10 text-accent px-3 py-2 rounded-full text-center font-medium">
                    {testimonial.skills}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}