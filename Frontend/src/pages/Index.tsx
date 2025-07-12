import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PopularSkills } from "@/components/PopularSkills";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="skills">
          <PopularSkills />
        </section>
        <section id="community">
          <Testimonials />
        </section>
        <section id="about">
          <CTA />
        </section>
      </main>
    </div>
  );
};

export default Index;
