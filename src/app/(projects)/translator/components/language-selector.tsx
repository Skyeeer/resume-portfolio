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
    { code: "en", name: "English" },
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
    { code: "vi", name: "Vietnamese" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "pl", name: "Polish" },
    { code: "cs", name: "Czech" },
    { code: "el", name: "Greek" },
    { code: "he", name: "Hebrew" },
    { code: "id", name: "Indonesian" },
    { code: "ms", name: "Malay" },
    { code: "tl", name: "Filipino" },
    { code: "uk", name: "Ukrainian" },
    { code: "fi", name: "Finnish" },
    { code: "no", name: "Norwegian" },
    { code: "da", name: "Danish" },
    { code: "bn", name: "Bengali" },
    { code: "ta", name: "Tamil" },
    { code: "fa", name: "Persian" },
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "hy", name: "Armenian" },
    { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "hr", name: "Croatian" },
    { code: "et", name: "Estonian" },
    { code: "fil", name: "Filipino" },
    { code: "ka", name: "Georgian" },
    { code: "gu", name: "Gujarati" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "ig", name: "Igbo" },
    { code: "kn", name: "Kannada" },
    { code: "kk", name: "Kazakh" },
    { code: "km", name: "Khmer" },
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