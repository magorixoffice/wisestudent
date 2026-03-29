import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "app_language";

const pageGameFiles = import.meta.glob("../locales/*/pages/games/**/*.json", {
  query: "?url",
  import: "default",
  eager: true,
});
const pageCardFiles = import.meta.glob("../locales/*/pages/cardcontent/**/*.json", {
  query: "?url",
  import: "default",
  eager: true,
});
const gamecontentFiles = import.meta.glob("../locales/*/gamecontent/**/*.json", {
  query: "?url",
  import: "default",
  eager: true,
});

const pageGamesByLang = new Map();
const pageCardsByLang = new Map();
const gamecontentByLang = new Map();

const PAGE_GAMES_RE = /^\.\.\/locales\/([^/]+)\/pages\/games\/([^/]+)\/([^/]+)\.json$/;
const PAGE_CARDS_RE = /^\.\.\/locales\/([^/]+)\/pages\/cardcontent\/([^/]+)\/([^/]+)\.json$/;
const GAMECONTENT_RE = /^\.\.\/locales\/([^/]+)\/gamecontent\/([^/]+)\/([^/]+)\/([^/]+)\.json$/;

const ensureLangBucket = (map, lang) => {
  if (!map.has(lang)) {
    map.set(lang, []);
  }
  return map.get(lang);
};

for (const [filePath, url] of Object.entries(pageGameFiles)) {
  const match = filePath.match(PAGE_GAMES_RE);
  if (!match) continue;
  const [, lang, pillar, module] = match;
  ensureLangBucket(pageGamesByLang, lang).push({ pillar, module, url });
}

for (const [filePath, url] of Object.entries(pageCardFiles)) {
  const match = filePath.match(PAGE_CARDS_RE);
  if (!match) continue;
  const [, lang, pillar, module] = match;
  ensureLangBucket(pageCardsByLang, lang).push({ pillar, module, url });
}

for (const [filePath, url] of Object.entries(gamecontentFiles)) {
  const match = filePath.match(GAMECONTENT_RE);
  if (!match) continue;
  const [, lang, pillar, module, slug] = match;
  ensureLangBucket(gamecontentByLang, lang).push({ pillar, module, slug, url });
}

const availableLanguages = new Set([
  ...pageGamesByLang.keys(),
  ...pageCardsByLang.keys(),
  ...gamecontentByLang.keys(),
]);

const mergePageCards = (pageData = {}, cardData = {}) => ({
  ...pageData,
  cards: {
    ...(pageData?.cards || {}),
    ...(cardData?.cards || {}),
  },
});

const loadJsonAsset = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load locale JSON: ${url}`);
  }

  return response.json();
};

const loadPagesGamesForLanguage = async (lang) => {
  const games = {};

  for (const entry of pageGamesByLang.get(lang) || []) {
    const data = await loadJsonAsset(entry.url);
    games[entry.pillar] = games[entry.pillar] || {};
    games[entry.pillar][entry.module] = data;
  }

  for (const entry of pageCardsByLang.get(lang) || []) {
    const cardData = await loadJsonAsset(entry.url);
    games[entry.pillar] = games[entry.pillar] || {};
    games[entry.pillar][entry.module] = mergePageCards(
      games[entry.pillar][entry.module] || {},
      cardData
    );
  }

  return games;
};

const loadGamecontentForLanguage = async (lang) => {
  const gamecontent = {};

  for (const entry of gamecontentByLang.get(lang) || []) {
    const data = await loadJsonAsset(entry.url);
    gamecontent[entry.pillar] = gamecontent[entry.pillar] || {};
    gamecontent[entry.pillar][entry.module] = gamecontent[entry.pillar][entry.module] || {};
    gamecontent[entry.pillar][entry.module][entry.slug] = data;
  }

  return gamecontent;
};

const languageResourceCache = new Map();

const loadLanguageResourceData = async (lang) => {
  if (languageResourceCache.has(lang)) {
    return languageResourceCache.get(lang);
  }

  const [gamesPages, gamecontent] = await Promise.all([
    loadPagesGamesForLanguage(lang),
    loadGamecontentForLanguage(lang),
  ]);

  const resourceData = {
    pages: { games: gamesPages },
    gamecontent,
  };

  languageResourceCache.set(lang, resourceData);
  return resourceData;
};

const savedLanguage = typeof window !== "undefined"
  ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  : null;

const initialLanguage = availableLanguages.has(savedLanguage) ? savedLanguage : "en";

const initI18n = (async () => {
  const initialResources = {
    en: await loadLanguageResourceData("en"),
  };

  if (initialLanguage !== "en") {
    initialResources[initialLanguage] = await loadLanguageResourceData(initialLanguage);
  }

  await i18n.use(initReactI18next).init({
    resources: initialResources,
    lng: initialLanguage,
    fallbackLng: "en",
    ns: ["pages", "gamecontent"],
    defaultNS: "pages",
    interpolation: {
      escapeValue: false,
    },
  });

  const loadedLanguages = new Set(Object.keys(initialResources));
  const originalChangeLanguage = i18n.changeLanguage.bind(i18n);

  i18n.changeLanguage = async (lng, ...args) => {
    const targetLanguage = availableLanguages.has(lng) ? lng : "en";

    if (!loadedLanguages.has(targetLanguage)) {
      const resourceData = await loadLanguageResourceData(targetLanguage);
      i18n.addResourceBundle(targetLanguage, "pages", resourceData.pages, true, true);
      i18n.addResourceBundle(targetLanguage, "gamecontent", resourceData.gamecontent, true, true);
      loadedLanguages.add(targetLanguage);
    }

    return originalChangeLanguage(targetLanguage, ...args);
  };
})();

export { LANGUAGE_STORAGE_KEY };
export { initI18n };
export default i18n;
