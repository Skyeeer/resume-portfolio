"use client";

import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FaGlobe } from "react-icons/fa";

interface LanguageOption {
    code: string;
    name: string;
}

interface LanguageSelectorProps {
    onLanguageChange: (languageCode: string) => void;
    defaultLanguage?: string;
    value?: string;
}

// Common languages for translation
const LANGUAGES: LanguageOption[] = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese (Simplified)" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
];

export function LanguageSelector({ onLanguageChange, defaultLanguage = "es", value }: LanguageSelectorProps) {
    const [selectedLanguage, setSelectedLanguage] = useState(value || defaultLanguage);

    useEffect(() => {
        if (value && value !== selectedLanguage) {
            console.log(`LanguageSelector: Updating from props to ${value}`);
            setSelectedLanguage(value);
        }
    }, [value]);

    useEffect(() => {
        console.log("LanguageSelector initialized with default:", defaultLanguage, "value:", value);
    }, []);

    const handleLanguageChange = (newValue: string) => {
        console.log(`SELECTOR: Language changed from ${selectedLanguage} to ${newValue}`);
        setSelectedLanguage(newValue);
        onLanguageChange(newValue);
    };

    const getLanguageName = (code: string) => {
        return LANGUAGES.find(lang => lang.code === code)?.name || code;
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FaGlobe className="text-secondary" size={14} />
                </div>
                <span className="text-sm text-muted-foreground">
                    Currently translating to <span className="font-medium text-secondary">{getLanguageName(selectedLanguage)}</span>
                </span>
            </div>

            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full border-secondary/20 focus:ring-secondary/30 bg-card">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                    <SelectGroup>
                        <SelectLabel className="text-secondary">Select target language</SelectLabel>
                        {LANGUAGES.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                                {language.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
} 