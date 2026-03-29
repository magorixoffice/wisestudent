'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGE_STORAGE_KEY } from "../i18n";

const defaultLanguages = [
  { code: "en", label: "English", native: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "Urdu", native: "اردو" },
];

const LanguageSelector = ({ languages = defaultLanguages, value, onChange }) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  const { i18n } = useTranslation();
  const current = value || i18n.language || languages[0]?.code;
  const displayLanguage = pendingLanguage || current;

  useEffect(() => {
    if (value && value !== i18n.language) {
      let cancelled = false;
      setIsChangingLanguage(true);
      setPendingLanguage(value);

      i18n
        .changeLanguage(value)
        .catch((error) => {
          console.error("Error changing language:", error);
        })
        .finally(() => {
          if (!cancelled) {
            setIsChangingLanguage(false);
            setPendingLanguage(null);
          }
        });

      return () => {
        cancelled = true;
      };
    }
  }, [value, i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = useMemo(() => {
    return languages.find((lang) => lang.code === displayLanguage)?.label || "Language";
  }, [displayLanguage, languages]);

  const handleSelect = async (code) => {
    if (isChangingLanguage || code === current) {
      setIsOpen(false);
      return;
    }

    setIsChangingLanguage(true);
    setPendingLanguage(code);

    try {
      await i18n.changeLanguage(code);
    } catch (error) {
      console.error("Error changing language:", error);
      return;
    } finally {
      setIsChangingLanguage(false);
      setPendingLanguage(null);
    }

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch (e) {
      console.error("Error saving language preference:", e);
    }
    setIsOpen(false);
    if (onChange) onChange(code);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 h-[44px] px-3 sm:px-4 py-2.5 rounded-lg font-bold text-sm text-white shadow-md border-2 border-teal-400 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => {
          if (!isChangingLanguage) setIsOpen((prev) => !prev);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isChangingLanguage}
      >
        <span className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">
            {isChangingLanguage ? `Switching to ${currentLabel}...` : currentLabel}
          </span>
          <span className="sm:hidden">{isChangingLanguage ? "..." : "Lang"}</span>
        </span>
        {isChangingLanguage ? (
          <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
        ) : (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        )}
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 w-64 h-52 overflow-y-auto rounded-xl border-2 border-teal-200 bg-white shadow-xl p-2 z-20
            
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
            [&::-webkit-scrollbar-thumb]:from-teal-400
            [&::-webkit-scrollbar-thumb]:to-blue-500
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:from-teal-500
            hover:[&::-webkit-scrollbar-thumb]:to-blue-600
          "
          role="listbox"
        >
          {languages.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow"
                    : "text-gray-700 hover:bg-teal-50"
                  }`}
                onClick={() => handleSelect(lang.code)}
                role="option"
                aria-selected={isActive}
                disabled={isChangingLanguage}
              >
                {/* Left: English */}
                <span>{lang.label}</span>

                {/* Right: Native */}
                <span
                  className={`text-xs ${isActive ? "opacity-100" : "opacity-70"
                    }`}
                >
                  {lang.native}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
