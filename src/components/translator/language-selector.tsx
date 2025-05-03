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

    return (
        <div className="w-full max-w-xs">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Translate to</SelectLabel>
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