export function SkillsSection() {
    return (
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
                <p className="text-center text-sm text-muted-foreground">OpenAI, Language Processing, Speech Recognition, Cursor</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md border border-secondary/20 hover:border-secondary/50 transition-colors">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-secondary font-bold">CL</span>
                </div>
                <h3 className="font-bold mb-2 text-center">Cloud</h3>
                <p className="text-center text-sm text-muted-foreground">AWS, Amplify, S3, Lambda, API Gateway</p>
            </div>
        </div>
    );
} 