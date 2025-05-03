import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaEnvelope, FaGithub, FaMicrophone, FaLanguage, FaHeadphones } from "react-icons/fa";
import { BsTranslate } from "react-icons/bs";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Profile */}
      <section className="py-16 px-6 md:px-12 flex flex-col items-center bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/30 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>

        <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="flex flex-col order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Charlie Ålander</h1>
            <p className="text-xl mb-6 text-muted-foreground">
              Software Developer specialized in AI solutions
            </p>
            <div className="flex gap-4 mb-8">
              <Link href="https://www.linkedin.com/in/charlie-%C3%A5lander-42871a291/" target="_blank" rel="noopener noreferrer"
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

      {/* Project Showcase */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-background via-background to-secondary/10">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Featured Project</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Language barriers shouldn't limit communication. My AI-powered translator breaks down these barriers in real-time.</p>

          <div className="bg-card rounded-xl overflow-hidden shadow-xl border border-accent/20">
            <div className="p-4 md:p-8 bg-secondary/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">AI-Powered Translator</h3>
                <Link
                  href="/translator"
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-colors shadow-md"
                >
                  Try It Now
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Features */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">OpenAI</span>
                    <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">AWS</span>
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">Next.js</span>
                    <span className="px-3 py-1 bg-secondary/80 text-secondary-foreground rounded-full text-sm">React</span>
                  </div>

                  <p className="text-card-foreground/90">
                    Bridging language gaps in real-time. This application enables natural conversations
                    between people who don't share a common language. Speak in your native tongue and
                    let AI translate and speak your words in the listener's language, perfect for international
                    communication, travel, and cross-cultural connections.
                  </p>

                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                        Real-time speech processing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                        Support for multiple languages
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                        Conversation history
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                        High-quality voice playback
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Visual representation */}
                <div className="lg:col-span-2 bg-gradient-to-br from-secondary/10 via-accent/5 to-background rounded-xl p-6 shadow-inner relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
                  <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>

                  <div className="relative z-10">
                    <h4 className="font-semibold mb-6 text-center">How It Works</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                      <div className="bg-card p-4 rounded-lg shadow-md border border-secondary/20 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                          <FaMicrophone size={24} className="text-secondary" />
                        </div>
                        <h5 className="font-medium mb-2">Record</h5>
                        <p className="text-sm text-muted-foreground">Speak in your native language</p>
                      </div>

                      <div className="bg-card p-4 rounded-lg shadow-md border border-accent/20 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                          <BsTranslate size={24} className="text-accent" />
                        </div>
                        <h5 className="font-medium mb-2">Translate</h5>
                        <p className="text-sm text-muted-foreground">AI processes your speech</p>
                      </div>

                      <div className="bg-card p-4 rounded-lg shadow-md border border-primary/20 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                          <FaHeadphones size={24} className="text-primary" />
                        </div>
                        <h5 className="font-medium mb-2">Listen</h5>
                        <p className="text-sm text-muted-foreground">Hear the translation</p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <div className="p-4 bg-card rounded-lg shadow-md border border-secondary/20 max-w-md w-full">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center mr-3">
                            <FaLanguage size={16} className="text-secondary" />
                          </div>
                          <div className="text-sm font-medium">Demo Conversation</div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="bg-secondary/10 p-2 rounded-lg">
                            "Where is the nearest coffee shop?" <span className="text-xs text-muted-foreground">English</span>
                          </div>
                          <div className="bg-accent/10 p-2 rounded-lg">
                            "Var är närmaste kafé?" <span className="text-xs text-muted-foreground">Swedish</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-secondary/20 via-background to-accent/10">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Technical Skills</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-md border border-secondary/20 hover:border-secondary/50 transition-colors">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-secondary font-bold">FE</span>
              </div>
              <h3 className="font-bold mb-2 text-center">Frontend</h3>
              <p className="text-center text-sm text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md border border-accent/20 hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent font-bold">BE</span>
              </div>
              <h3 className="font-bold mb-2 text-center">Backend</h3>
              <p className="text-center text-sm text-muted-foreground">Node.js, Express, AWS Lambda, Serverless</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md border border-primary/20 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary font-bold">AI</span>
              </div>
              <h3 className="font-bold mb-2 text-center">AI/ML</h3>
              <p className="text-center text-sm text-muted-foreground">OpenAI, Language Processing, Speech Recognition</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md border border-secondary/20 hover:border-secondary/50 transition-colors">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-secondary font-bold">CL</span>
              </div>
              <h3 className="font-bold mb-2 text-center">Cloud</h3>
              <p className="text-center text-sm text-muted-foreground">AWS, Amplify, S3, Lambda, API Gateway</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
