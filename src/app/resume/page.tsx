"use client";

import { useRef } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaGlobe, FaPrint, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function ResumePage() {
    const resumeRef = useRef<HTMLDivElement>(null);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    const frontendSkills = [
        "JavaScript",
        "React",
        "Next.js",
        "HTML5/CSS3",
        "Tailwind CSS"
    ];

    const backendSkills = [
        "Node.js",
        "Express",
        "RESTful APIs",
        "MongoDB",
        "AWS"
    ];

    const interests = [
        "Web Development",
        "Dungeons & Dragons",
        "Gaming"
    ];

    /* Template for adding new education:
    {
        degree: "Degree/Program Name",
        institution: "Institution Name",
        location: "City, Country",
        period: "Start Year - End Year",
        description: "Description of your studies and achievements"
    }
    */
    const education = [
        {
            degree: "Fullstack Javascript Development",
            institution: "Chas Academy",
            location: "Stockholm",
            period: "2023 - 2025",
            description: "Comprehensive program focused on modern web development technologies and methodologies. Graduating in June 2025 with specialization in Javascript, React, Node.js, and related technologies."
        }
    ];

    /* Template for adding new experience:
    {
        title: "Job Title",
        company: "Company Name",
        location: "City, Country",
        period: "Start Date - End Date",
        responsibilities: [
            "Responsibility 1",
            "Responsibility 2",
            "Responsibility 3",
            "Responsibility 4"
        ]
    }
    */
    const experience = [
        {
            title: "Fullstack Developer Intern",
            company: "Wonlik Creations",
            location: "Stockholm",
            period: "Jan 2024 - May 2024",
            responsibilities: [
                "Develop and maintain web applications using React, Next.js, and JavaScript",
                "Collaborate with design team to implement responsive UI/UX designs",
                "Work with backend APIs and database integrations",
                "Contribute to project planning and implementation discussions"
            ]
        }
    ];

    // Print function using browser's native print capability
    const printResume = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 print:bg-white print:bg-none">
            <div className="container max-w-4xl mx-auto px-4 py-12 print:p-6 print:max-w-full">
                <div className="mb-8 flex flex-row justify-between items-center gap-4 print:hidden">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            aria-label="Back to home"
                        >
                            <FaArrowLeft className="text-gray-700" size={16} />
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <button
                            onClick={printResume}
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            <FaPrint size={16} />
                            <span>Print</span>
                        </button>
                    </div>
                </div>

                {/* Resume Content */}
                <div className="bg-white p-8 rounded-lg shadow-lg print:shadow-none print:p-5 print:mt-0" ref={resumeRef}>
                    {/* Header */}
                    <div className="mb-6 print:mb-4">
                        <div className="flex flex-row gap-4 items-start">
                            <div className="w-32 h-32 print:w-24 print:h-24 rounded-md overflow-hidden relative flex-shrink-0">
                                <Image
                                    src="/profile.jpg"
                                    alt="Charlie Ålander"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-md"
                                    priority
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-800 mb-1 print:text-xl">Charlie Ålander</h2>
                                <h3 className="text-lg font-medium text-blue-600 mb-2 print:text-base">Fullstack Javascript Developer</h3>

                                <div className="flex flex-wrap gap-2 text-sm text-gray-600 print:text-xs print:gap-1">
                                    <a href="mailto:charlie.alander@gmail.com" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <FaEnvelope size={12} className="print:scale-75" />
                                        charlie.alander@gmail.com
                                    </a>
                                    <a href="tel:+46768560210" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <FaPhone size={12} className="print:scale-75" />
                                        +46 76 856 02 10
                                    </a>
                                    <a href="https://www.linkedin.com/in/charlie-%C3%A5lander/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <FaLinkedin size={12} className="print:scale-75" />
                                        LinkedIn Profile
                                    </a>
                                    <a href="https://github.com/Skyeeer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <FaGithub size={12} className="print:scale-75" />
                                        GitHub
                                    </a>
                                    <a href="https://www.skyeeer.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <FaGlobe size={12} className="print:scale-75" />
                                        skyeeer.com
                                    </a>
                                    <span className="flex items-center">Stockholm, Sweden</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5 print:mb-3">
                        <h3 className="text-lg font-semibold mb-2 border-b border-blue-200 pb-1 text-gray-800 print:text-base print:mb-1">Professional Summary</h3>
                        <p className="text-gray-700 text-sm print:text-xs">
                            Detail-oriented Fullstack JavaScript Developer who enjoys bringing ideas to life and adding a touch of frontend magic.
                            Experienced in building responsive applications using React, Next.js, Node.js, RESTful APIs, and cloud services like AWS and Firebase.
                            Completed formal training in Fullstack JavaScript Development, along with valuable internship experience in real-world web application projects.
                            I thrive in small, collaborative teams where ideas are freely exchanged and support is mutual. Committed to writing clean, efficient code and applying industry best practices —
                            all while maintaining a creative, solutions-driven mindset.
                        </p>
                    </div>

                    <div className="mb-5 print:mb-3">
                        <h3 className="text-lg font-semibold mb-2 border-b border-blue-200 pb-1 text-gray-800 print:text-base print:mb-1">Work Experience</h3>

                        {experience.map((job, index) => (
                            <div key={index} className="mb-3 print:mb-2">
                                <div className="flex flex-col sm:flex-row justify-between mb-1">
                                    <h4 className="font-medium text-gray-800 print:text-sm">{job.title}</h4>
                                    <span className="text-sm text-blue-600 print:text-xs">{job.period}</span>
                                </div>
                                <h5 className="text-blue-600 mb-2 print:text-xs print:mb-1">{job.company}, {job.location}</h5>
                                <div className="space-y-1">
                                    {job.responsibilities.map((responsibility, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <div className="min-w-2 h-2 bg-blue-600 rounded-full mt-1.5 print:scale-75 print:mt-1"></div>
                                            <p className="text-gray-700 text-sm print:text-xs">{responsibility}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-5 print:mb-3">
                        <h3 className="text-lg font-semibold mb-2 border-b border-blue-200 pb-1 text-gray-800 print:text-base print:mb-1">Education</h3>

                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex flex-col sm:flex-row justify-between mb-1">
                                    <h4 className="font-medium text-gray-800 print:text-sm">{edu.degree}</h4>
                                    <span className="text-sm text-blue-600 print:text-xs">{edu.period}</span>
                                </div>
                                <h5 className="text-blue-600 print:text-xs">{edu.institution}, {edu.location}</h5>
                                <p className="text-sm text-gray-700 mt-1 print:text-xs print:mt-0.5">{edu.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4 print:mb-3">
                        <h3 className="text-lg font-semibold mb-2 border-b border-blue-200 pb-1 text-gray-800 print:text-base print:mb-1">Technical Skills & Interests</h3>

                        <div className="grid grid-cols-2 gap-4 print:gap-2">
                            <div>
                                <h4 className="font-medium mb-2 text-gray-800 print:text-sm print:mb-1">Front-End Technologies</h4>
                                <div className="flex flex-wrap gap-2 print:gap-1">
                                    {frontendSkills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-800 rounded-md text-sm text-white shadow-sm font-medium print:text-xs print:px-2 print:py-0.5">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2 text-gray-800 print:text-sm print:mb-1">Back-End & Tools</h4>
                                <div className="flex flex-wrap gap-2 print:gap-1">
                                    {backendSkills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-800 rounded-md text-sm text-white shadow-sm font-medium print:text-xs print:px-2 print:py-0.5">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 print:mt-2">
                            <h4 className="font-medium mb-2 text-gray-800 print:text-sm print:mb-1">Interests</h4>
                            <div className="flex flex-wrap gap-2 print:gap-1">
                                {interests.map((interest, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-800 rounded-md text-sm text-white shadow-sm font-medium print:text-xs print:px-2 print:py-0.5">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 0.5cm;
                            margin-top: 0;
                        }
                        
                        @page :first {
                            margin-top: 0;
                        }
                        
                        html, body {
                            height: 100%;
                            width: 100%;
                            margin: 0;
                            padding: 0;
                            background: white !important;
                        }
                        
                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        
                        .print\\:hidden {
                            display: none !important;
                        }
                        
                        /* Ensure no background gradients in print */
                        .min-h-screen {
                            background: white !important;
                            background-image: none !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
} 