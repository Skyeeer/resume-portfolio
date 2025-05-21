import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaEnvelope, FaGithub, FaSteam } from "react-icons/fa";
import { FeaturedProjects } from "@/components/featured-projects";
import { AboutMe } from "@/components/about-me";
import { SkillsSection } from "@/components/skills-section";
import { ContactInfo } from "@/components/contact-info";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Profile */}
      <section id="hero" className="py-16 px-6 md:px-12 flex flex-col items-center bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/30 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>

        <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="flex flex-col order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Charlie Ålander</h1>
            <p className="text-xl mb-6 text-foreground">
              Fullstack Javascript Developer
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              <Link href="https://www.linkedin.com/in/charlie-%C3%A5lander/" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                <FaLinkedin size={24} />
              </Link>
              <Link href="mailto:charlie.alander@gmail.com"
                className="p-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
                <FaEnvelope size={24} />
              </Link>
              <Link href="https://github.com/Skyeeer" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <FaGithub size={24} />
              </Link>
              <Link href="https://steamcommunity.com/profiles/76561198143038556" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#171a21] text-white hover:opacity-90 transition-opacity">
                <FaSteam size={24} />
              </Link>
            </div>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-secondary shadow-lg">
              <Image
                src="/profile.jpg"
                alt="Charlie Ålander"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section (New) */}
      <section id="about" className="py-28 px-6 md:px-12 bg-gradient-to-b from-background to-secondary/10">
        <AboutMe />
      </section>

      {/* Featured Projects Carousel */}
      <section id="projects" className="py-28 px-6 md:px-12 bg-gradient-to-br from-background via-background to-secondary/10">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <FeaturedProjects />
        </div>
      </section>

      {/* Skills Section (Componentized) */}
      <section id="skills" className="py-28 px-6 md:px-12 bg-gradient-to-br from-secondary/20 via-background to-accent/10">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <SkillsSection />
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contact" className="py-28 px-6 md:px-12 bg-gradient-to-br from-accent/10 via-background to-primary/10">
        <ContactInfo />
      </section>
    </main>
  );
}
