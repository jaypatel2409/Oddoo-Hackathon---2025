import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Palette, Camera, Music, ChefHat, Languages, Dumbbell, BookOpen } from "lucide-react";

const skillCategories = [
  {
    icon: Code,
    title: "Technology",
    count: "2.1k",
    skills: ["React", "Python", "UI/UX Design", "Data Analysis"],
    color: "text-blue-600"
  },
  {
    icon: Palette,
    title: "Creative Arts",
    count: "1.8k",
    skills: ["Graphic Design", "Illustration", "Photography", "Video Editing"],
    color: "text-purple-600"
  },
  {
    icon: Languages,
    title: "Languages",
    count: "1.5k", 
    skills: ["Spanish", "French", "Mandarin", "German"],
    color: "text-green-600"
  },
  {
    icon: Music,
    title: "Music & Arts",
    count: "1.2k",
    skills: ["Guitar", "Piano", "Singing", "Music Production"],
    color: "text-red-600"
  },
  {
    icon: ChefHat,
    title: "Culinary",
    count: "980",
    skills: ["Baking", "International Cuisine", "Meal Prep", "Wine Tasting"],
    color: "text-orange-600"
  },
  {
    icon: Dumbbell,
    title: "Fitness & Wellness",
    count: "750",
    skills: ["Yoga", "Personal Training", "Meditation", "Nutrition"],
    color: "text-teal-600"
  }
];

export function PopularSkills() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Popular Skill Categories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after skills in our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <Card 
              key={index}
              className="group cursor-pointer border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.count} available</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button variant="outline" size="lg">
            <BookOpen className="w-5 h-5 mr-2" />
            Browse All Skills
          </Button>
        </div>
      </div>
    </section>
  );
}