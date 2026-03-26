import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { enFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/en";
import { hiFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/hi";
import { bnFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/bn";
import { guFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/gu";
import { knFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/kn";
import { mlFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/ml";
import { mrFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/mr";
import { paFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/pa";
import { taFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/ta";
import { teFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/te";
import { urFinancialLiteracyKidsGameContent } from "./financial-literacy/kids/ur";

import { enBrainKidsGameContent } from "./brain-health/kids/en";
import { hiBrainKidsGameContent } from "./brain-health/kids/hi";
import { bnBrainKidsGameContent } from "./brain-health/kids/bn";
import { guBrainKidsGameContent } from "./brain-health/kids/gu";
import { knBrainKidsGameContent } from "./brain-health/kids/kn";
import { mlBrainKidsGameContent } from "./brain-health/kids/ml";
import { mrBrainKidsGameContent } from "./brain-health/kids/mr";
import { paBrainKidsGameContent } from "./brain-health/kids/pa";
import { taBrainKidsGameContent } from "./brain-health/kids/ta";
import { teBrainKidsGameContent } from "./brain-health/kids/te";
import { urBrainKidsGameContent } from "./brain-health/kids/ur";

import { enFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/en";
import { hiFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/hi";
import { bnFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/bn";
import { guFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/gu";
import { knFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/kn";
import { mlFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/ml";
import { mrFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/mr";
import { paFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/pa";
import { taFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/ta";
import { teFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/te";
import { urFinancialLiteracyTeensGameContent } from "./financial-literacy/teens/ur";

import { enFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/en";
import { hiFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/hi";
import { bnFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/bn";
import { guFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/gu";
import { knFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/kn";
import { mlFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/ml";
import { mrFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/mr";
import { paFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/pa";
import { taFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/ta";
import { teFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/te";
import { urFinancialLiteracyYoungAdultGameContent } from "./financial-literacy/young-adult/ur";
import { enFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/en";
import { hiFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/hi";
import { bnFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/bn";
import { guFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/gu";
import { knFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/kn";
import { mlFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/ml";
import { mrFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/mr";
import { paFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/pa";
import { taFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/ta";
import { teFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/te";
import { urFinancialLiteracyAdultsGameContent } from "./financial-literacy/adults/ur";

import enFinancialLiteracyTeens from "../locales/en/pages/games/financial-literacy/teens.json";
import enFinancialLiteracyTeensCards from "../locales/en/pages/cardcontent/financial-literacy/teens.json";
import enFinancialLiteracyYoungAdult from "../locales/en/pages/games/financial-literacy/young-adult.json";
import enFinancialLiteracyYoungAdultCards from "../locales/en/pages/cardcontent/financial-literacy/young-adult.json";
import enFinancialLiteracyKids from "../locales/en/pages/games/financial-literacy/kids.json";
import enFinancialLiteracyKidsCards from "../locales/en/pages/cardcontent/financial-literacy/kids.json";
import enFinancialLiteracyBusinessLivelihoodFinance from "../locales/en/pages/games/financial-literacy/business-livelihood-finance.json";
import enFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/en/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import enFinancialLiteracyInsurancePension from "../locales/en/pages/games/financial-literacy/insurance-pension.json";
import enFinancialLiteracyInsurancePensionCards from "../locales/en/pages/cardcontent/financial-literacy/insurance-pension.json";
import enFinancialLiteracyAdults from "../locales/en/pages/games/financial-literacy/adults.json";
import enFinancialLiteracyAdultsCards from "../locales/en/pages/cardcontent/financial-literacy/adults.json";

import enBrainHealthKids from "../locales/en/pages/games/brain-health/kids.json";
import enBrainHealthKidsCards from "../locales/en/pages/cardcontent/brain-health/kids.json";
import enBrainHealthTeens from "../locales/en/pages/games/brain-health/teens.json";
import enBrainHealthTeensCards from "../locales/en/pages/cardcontent/brain-health/teens.json";
import enBrainHealthYoungAdult from "../locales/en/pages/games/brain-health/young-adult.json";
import enBrainHealthYoungAdultCards from "../locales/en/pages/cardcontent/brain-health/young-adult.json";
import enBrainHealthAdults from "../locales/en/pages/games/brain-health/adults.json";
import enBrainHealthAdultsCards from "../locales/en/pages/cardcontent/brain-health/adults.json";

import enUvlsKids from "../locales/en/pages/games/uvls/kids.json";
import enUvlsKidsCards from "../locales/en/pages/cardcontent/uvls/kids.json";
import enUvlsTeens from "../locales/en/pages/games/uvls/teens.json";
import enUvlsTeensCards from "../locales/en/pages/cardcontent/uvls/teens.json";
import enUvlsYoungAdult from "../locales/en/pages/games/uvls/young-adult.json";
import enUvlsAdults from "../locales/en/pages/games/uvls/adults.json";

import enDigitalCitizenshipKids from "../locales/en/pages/games/digital-citizenship/kids.json";
import enDigitalCitizenshipKidsCards from "../locales/en/pages/cardcontent/digital-citizenship/kids.json";
import enDigitalCitizenshipTeens from "../locales/en/pages/games/digital-citizenship/teens.json";
import enDigitalCitizenshipTeensCards from "../locales/en/pages/cardcontent/digital-citizenship/teens.json";
import enDigitalCitizenshipYoungAdult from "../locales/en/pages/games/digital-citizenship/young-adult.json";
import enDigitalCitizenshipAdults from "../locales/en/pages/games/digital-citizenship/adults.json";

import enMoralValuesKids from "../locales/en/pages/games/moral-values/kids.json";
import enMoralValuesKidsCards from "../locales/en/pages/cardcontent/moral-values/kids.json";
import enMoralValuesTeens from "../locales/en/pages/games/moral-values/teens.json";
import enMoralValuesTeensCards from "../locales/en/pages/cardcontent/moral-values/teens.json";
import enMoralValuesYoungAdult from "../locales/en/pages/games/moral-values/young-adult.json";
import enMoralValuesAdults from "../locales/en/pages/games/moral-values/adults.json";

import enAiForAllKids from "../locales/en/pages/games/ai-for-all/kids.json";
import enAiForAllKidsCards from "../locales/en/pages/cardcontent/ai-for-all/kids.json";
import enAiForAllTeens from "../locales/en/pages/games/ai-for-all/teens.json";
import enAiForAllTeensCards from "../locales/en/pages/cardcontent/ai-for-all/teens.json";
import enAiForAllYoungAdult from "../locales/en/pages/games/ai-for-all/young-adult.json";
import enAiForAllAdults from "../locales/en/pages/games/ai-for-all/adults.json";

import enHealthMaleKids from "../locales/en/pages/games/health-male/kids.json";
import enHealthMaleKidsCards from "../locales/en/pages/cardcontent/health-male/kids.json";
import enHealthMaleTeens from "../locales/en/pages/games/health-male/teens.json";
import enHealthMaleTeensCards from "../locales/en/pages/cardcontent/health-male/teens.json";
import enHealthMaleYoungAdult from "../locales/en/pages/games/health-male/young-adult.json";
import enHealthMaleAdults from "../locales/en/pages/games/health-male/adults.json";

import enHealthFemaleKids from "../locales/en/pages/games/health-female/kids.json";
import enHealthFemaleKidsCards from "../locales/en/pages/cardcontent/health-female/kids.json";
import enHealthFemaleTeens from "../locales/en/pages/games/health-female/teens.json";
import enHealthFemaleTeensCards from "../locales/en/pages/cardcontent/health-female/teens.json";
import enHealthFemaleYoungAdult from "../locales/en/pages/games/health-female/young-adult.json";
import enHealthFemaleAdults from "../locales/en/pages/games/health-female/adults.json";

import enEheKids from "../locales/en/pages/games/ehe/kids.json";
import enEheKidsCards from "../locales/en/pages/cardcontent/ehe/kids.json";
import enEheTeens from "../locales/en/pages/games/ehe/teens.json";
import enEheTeensCards from "../locales/en/pages/cardcontent/ehe/teens.json";
import enEheYoungAdult from "../locales/en/pages/games/ehe/young-adult.json";
import enEheAdults from "../locales/en/pages/games/ehe/adults.json";

import enCivicResponsibilityKids from "../locales/en/pages/games/civic-responsibility/kids.json";
import enCivicResponsibilityKidsCards from "../locales/en/pages/cardcontent/civic-responsibility/kids.json";
import enCivicResponsibilityTeens from "../locales/en/pages/games/civic-responsibility/teens.json";
import enCivicResponsibilityTeensCards from "../locales/en/pages/cardcontent/civic-responsibility/teens.json";
import enCivicResponsibilityYoungAdult from "../locales/en/pages/games/civic-responsibility/young-adult.json";
import enCivicResponsibilityAdults from "../locales/en/pages/games/civic-responsibility/adults.json";

import enSustainabilityKids from "../locales/en/pages/games/sustainability/kids.json";
import enSustainabilityKidsCards from "../locales/en/pages/cardcontent/sustainability/kids.json";
import enSustainabilityTeens from "../locales/en/pages/games/sustainability/teens.json";
import enSustainabilityTeensCards from "../locales/en/pages/cardcontent/sustainability/teens.json";
import enSustainabilityYoungAdult from "../locales/en/pages/games/sustainability/young-adult.json";
import enSustainabilityAdults from "../locales/en/pages/games/sustainability/adults.json";
import bnFinancialLiteracyTeens from "../locales/bn/pages/games/financial-literacy/teens.json";
import bnFinancialLiteracyTeensCards from "../locales/bn/pages/cardcontent/financial-literacy/teens.json";
import bnFinancialLiteracyYoungAdult from "../locales/bn/pages/games/financial-literacy/young-adult.json";
import bnFinancialLiteracyYoungAdultCards from "../locales/bn/pages/cardcontent/financial-literacy/young-adult.json";
import bnFinancialLiteracyKids from "../locales/bn/pages/games/financial-literacy/kids.json";
import bnFinancialLiteracyKidsCards from "../locales/bn/pages/cardcontent/financial-literacy/kids.json";
import bnFinancialLiteracyBusinessLivelihoodFinance from "../locales/bn/pages/games/financial-literacy/business-livelihood-finance.json";
import bnFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/bn/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import bnFinancialLiteracyInsurancePension from "../locales/bn/pages/games/financial-literacy/insurance-pension.json";
import bnFinancialLiteracyInsurancePensionCards from "../locales/bn/pages/cardcontent/financial-literacy/insurance-pension.json";
import bnFinancialLiteracyAdults from "../locales/bn/pages/games/financial-literacy/adults.json";
import bnFinancialLiteracyAdultsCards from "../locales/bn/pages/cardcontent/financial-literacy/adults.json";
import bnBrainHealthKids from "../locales/bn/pages/games/brain-health/kids.json";
import bnBrainHealthKidsCards from "../locales/bn/pages/cardcontent/brain-health/kids.json";
import bnBrainHealthTeens from "../locales/bn/pages/games/brain-health/teens.json";
import bnBrainHealthTeensCards from "../locales/bn/pages/cardcontent/brain-health/teens.json";
import bnBrainHealthYoungAdult from "../locales/bn/pages/games/brain-health/young-adult.json";
import bnBrainHealthYoungAdultCards from "../locales/bn/pages/cardcontent/brain-health/young-adult.json";
import bnBrainHealthAdults from "../locales/bn/pages/games/brain-health/adults.json";
import bnBrainHealthAdultsCards from "../locales/bn/pages/cardcontent/brain-health/adults.json";
import bnUvlsKids from "../locales/bn/pages/games/uvls/kids.json";
import bnUvlsKidsCards from "../locales/bn/pages/cardcontent/uvls/kids.json";
import bnUvlsTeens from "../locales/bn/pages/games/uvls/teens.json";
import bnUvlsTeensCards from "../locales/bn/pages/cardcontent/uvls/teens.json";
import bnUvlsYoungAdult from "../locales/bn/pages/games/uvls/young-adult.json";
import bnUvlsAdults from "../locales/bn/pages/games/uvls/adults.json";
import bnDigitalCitizenshipKids from "../locales/bn/pages/games/digital-citizenship/kids.json";
import bnDigitalCitizenshipKidsCards from "../locales/bn/pages/cardcontent/digital-citizenship/kids.json";
import bnDigitalCitizenshipTeens from "../locales/bn/pages/games/digital-citizenship/teens.json";
import bnDigitalCitizenshipTeensCards from "../locales/bn/pages/cardcontent/digital-citizenship/teens.json";
import bnDigitalCitizenshipYoungAdult from "../locales/bn/pages/games/digital-citizenship/young-adult.json";
import bnDigitalCitizenshipAdults from "../locales/bn/pages/games/digital-citizenship/adults.json";
import bnMoralValuesKids from "../locales/bn/pages/games/moral-values/kids.json";
import bnMoralValuesKidsCards from "../locales/bn/pages/cardcontent/moral-values/kids.json";
import bnMoralValuesTeens from "../locales/bn/pages/games/moral-values/teens.json";
import bnMoralValuesTeensCards from "../locales/bn/pages/cardcontent/moral-values/teens.json";
import bnMoralValuesYoungAdult from "../locales/bn/pages/games/moral-values/young-adult.json";
import bnMoralValuesAdults from "../locales/bn/pages/games/moral-values/adults.json";
import bnAiForAllKids from "../locales/bn/pages/games/ai-for-all/kids.json";
import bnAiForAllKidsCards from "../locales/bn/pages/cardcontent/ai-for-all/kids.json";
import bnAiForAllTeens from "../locales/bn/pages/games/ai-for-all/teens.json";
import bnAiForAllTeensCards from "../locales/bn/pages/cardcontent/ai-for-all/teens.json";
import bnAiForAllYoungAdult from "../locales/bn/pages/games/ai-for-all/young-adult.json";
import bnAiForAllAdults from "../locales/bn/pages/games/ai-for-all/adults.json";
import bnHealthMaleKids from "../locales/bn/pages/games/health-male/kids.json";
import bnHealthMaleKidsCards from "../locales/bn/pages/cardcontent/health-male/kids.json";
import bnHealthMaleTeens from "../locales/bn/pages/games/health-male/teens.json";
import bnHealthMaleTeensCards from "../locales/bn/pages/cardcontent/health-male/teens.json";
import bnHealthMaleYoungAdult from "../locales/bn/pages/games/health-male/young-adult.json";
import bnHealthMaleAdults from "../locales/bn/pages/games/health-male/adults.json";
import bnHealthFemaleKids from "../locales/bn/pages/games/health-female/kids.json";
import bnHealthFemaleKidsCards from "../locales/bn/pages/cardcontent/health-female/kids.json";
import bnHealthFemaleTeens from "../locales/bn/pages/games/health-female/teens.json";
import bnHealthFemaleTeensCards from "../locales/bn/pages/cardcontent/health-female/teens.json";
import bnHealthFemaleYoungAdult from "../locales/bn/pages/games/health-female/young-adult.json";
import bnHealthFemaleAdults from "../locales/bn/pages/games/health-female/adults.json";
import bnEheKids from "../locales/bn/pages/games/ehe/kids.json";
import bnEheKidsCards from "../locales/bn/pages/cardcontent/ehe/kids.json";
import bnEheTeens from "../locales/bn/pages/games/ehe/teens.json";
import bnEheTeensCards from "../locales/bn/pages/cardcontent/ehe/teens.json";
import bnEheYoungAdult from "../locales/bn/pages/games/ehe/young-adult.json";
import bnEheAdults from "../locales/bn/pages/games/ehe/adults.json";
import bnCivicResponsibilityKids from "../locales/bn/pages/games/civic-responsibility/kids.json";
import bnCivicResponsibilityKidsCards from "../locales/bn/pages/cardcontent/civic-responsibility/kids.json";
import bnCivicResponsibilityTeens from "../locales/bn/pages/games/civic-responsibility/teens.json";
import bnCivicResponsibilityTeensCards from "../locales/bn/pages/cardcontent/civic-responsibility/teens.json";
import bnCivicResponsibilityYoungAdult from "../locales/bn/pages/games/civic-responsibility/young-adult.json";
import bnCivicResponsibilityAdults from "../locales/bn/pages/games/civic-responsibility/adults.json";
import bnSustainabilityKids from "../locales/bn/pages/games/sustainability/kids.json";
import bnSustainabilityKidsCards from "../locales/bn/pages/cardcontent/sustainability/kids.json";
import bnSustainabilityTeens from "../locales/bn/pages/games/sustainability/teens.json";
import bnSustainabilityTeensCards from "../locales/bn/pages/cardcontent/sustainability/teens.json";
import bnSustainabilityYoungAdult from "../locales/bn/pages/games/sustainability/young-adult.json";
import bnSustainabilityAdults from "../locales/bn/pages/games/sustainability/adults.json";
import guFinancialLiteracyTeens from "../locales/gu/pages/games/financial-literacy/teens.json";
import guFinancialLiteracyTeensCards from "../locales/gu/pages/cardcontent/financial-literacy/teens.json";
import guFinancialLiteracyYoungAdult from "../locales/gu/pages/games/financial-literacy/young-adult.json";
import guFinancialLiteracyYoungAdultCards from "../locales/gu/pages/cardcontent/financial-literacy/young-adult.json";
import guFinancialLiteracyKids from "../locales/gu/pages/games/financial-literacy/kids.json";
import guFinancialLiteracyKidsCards from "../locales/gu/pages/cardcontent/financial-literacy/kids.json";
import guFinancialLiteracyBusinessLivelihoodFinance from "../locales/gu/pages/games/financial-literacy/business-livelihood-finance.json";
import guFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/gu/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import guFinancialLiteracyInsurancePension from "../locales/gu/pages/games/financial-literacy/insurance-pension.json";
import guFinancialLiteracyInsurancePensionCards from "../locales/gu/pages/cardcontent/financial-literacy/insurance-pension.json";
import guFinancialLiteracyAdults from "../locales/gu/pages/games/financial-literacy/adults.json";
import guFinancialLiteracyAdultsCards from "../locales/gu/pages/cardcontent/financial-literacy/adults.json";
import guBrainHealthKids from "../locales/gu/pages/games/brain-health/kids.json";
import guBrainHealthKidsCards from "../locales/gu/pages/cardcontent/brain-health/kids.json";
import guBrainHealthTeens from "../locales/gu/pages/games/brain-health/teens.json";
import guBrainHealthTeensCards from "../locales/gu/pages/cardcontent/brain-health/teens.json";
import guBrainHealthYoungAdult from "../locales/gu/pages/games/brain-health/young-adult.json";
import guBrainHealthYoungAdultCards from "../locales/gu/pages/cardcontent/brain-health/young-adult.json";
import guBrainHealthAdults from "../locales/gu/pages/games/brain-health/adults.json";
import guBrainHealthAdultsCards from "../locales/gu/pages/cardcontent/brain-health/adults.json";
import guUvlsKids from "../locales/gu/pages/games/uvls/kids.json";
import guUvlsKidsCards from "../locales/gu/pages/cardcontent/uvls/kids.json";
import guUvlsTeens from "../locales/gu/pages/games/uvls/teens.json";
import guUvlsTeensCards from "../locales/gu/pages/cardcontent/uvls/teens.json";
import guUvlsYoungAdult from "../locales/gu/pages/games/uvls/young-adult.json";
import guUvlsAdults from "../locales/gu/pages/games/uvls/adults.json";
import guDigitalCitizenshipKids from "../locales/gu/pages/games/digital-citizenship/kids.json";
import guDigitalCitizenshipKidsCards from "../locales/gu/pages/cardcontent/digital-citizenship/kids.json";
import guDigitalCitizenshipTeens from "../locales/gu/pages/games/digital-citizenship/teens.json";
import guDigitalCitizenshipTeensCards from "../locales/gu/pages/cardcontent/digital-citizenship/teens.json";
import guDigitalCitizenshipYoungAdult from "../locales/gu/pages/games/digital-citizenship/young-adult.json";
import guDigitalCitizenshipAdults from "../locales/gu/pages/games/digital-citizenship/adults.json";
import guMoralValuesKids from "../locales/gu/pages/games/moral-values/kids.json";
import guMoralValuesKidsCards from "../locales/gu/pages/cardcontent/moral-values/kids.json";
import guMoralValuesTeens from "../locales/gu/pages/games/moral-values/teens.json";
import guMoralValuesTeensCards from "../locales/gu/pages/cardcontent/moral-values/teens.json";
import guMoralValuesYoungAdult from "../locales/gu/pages/games/moral-values/young-adult.json";
import guMoralValuesAdults from "../locales/gu/pages/games/moral-values/adults.json";
import guAiForAllKids from "../locales/gu/pages/games/ai-for-all/kids.json";
import guAiForAllKidsCards from "../locales/gu/pages/cardcontent/ai-for-all/kids.json";
import guAiForAllTeens from "../locales/gu/pages/games/ai-for-all/teens.json";
import guAiForAllTeensCards from "../locales/gu/pages/cardcontent/ai-for-all/teens.json";
import guAiForAllYoungAdult from "../locales/gu/pages/games/ai-for-all/young-adult.json";
import guAiForAllAdults from "../locales/gu/pages/games/ai-for-all/adults.json";
import guHealthMaleKids from "../locales/gu/pages/games/health-male/kids.json";
import guHealthMaleKidsCards from "../locales/gu/pages/cardcontent/health-male/kids.json";
import guHealthMaleTeens from "../locales/gu/pages/games/health-male/teens.json";
import guHealthMaleTeensCards from "../locales/gu/pages/cardcontent/health-male/teens.json";
import guHealthMaleYoungAdult from "../locales/gu/pages/games/health-male/young-adult.json";
import guHealthMaleAdults from "../locales/gu/pages/games/health-male/adults.json";
import guHealthFemaleKids from "../locales/gu/pages/games/health-female/kids.json";
import guHealthFemaleKidsCards from "../locales/gu/pages/cardcontent/health-female/kids.json";
import guHealthFemaleTeens from "../locales/gu/pages/games/health-female/teens.json";
import guHealthFemaleTeensCards from "../locales/gu/pages/cardcontent/health-female/teens.json";
import guHealthFemaleYoungAdult from "../locales/gu/pages/games/health-female/young-adult.json";
import guHealthFemaleAdults from "../locales/gu/pages/games/health-female/adults.json";
import guEheKids from "../locales/gu/pages/games/ehe/kids.json";
import guEheKidsCards from "../locales/gu/pages/cardcontent/ehe/kids.json";
import guEheTeens from "../locales/gu/pages/games/ehe/teens.json";
import guEheTeensCards from "../locales/gu/pages/cardcontent/ehe/teens.json";
import guEheYoungAdult from "../locales/gu/pages/games/ehe/young-adult.json";
import guEheAdults from "../locales/gu/pages/games/ehe/adults.json";
import guCivicResponsibilityKids from "../locales/gu/pages/games/civic-responsibility/kids.json";
import guCivicResponsibilityKidsCards from "../locales/gu/pages/cardcontent/civic-responsibility/kids.json";
import guCivicResponsibilityTeens from "../locales/gu/pages/games/civic-responsibility/teens.json";
import guCivicResponsibilityTeensCards from "../locales/gu/pages/cardcontent/civic-responsibility/teens.json";
import guCivicResponsibilityYoungAdult from "../locales/gu/pages/games/civic-responsibility/young-adult.json";
import guCivicResponsibilityAdults from "../locales/gu/pages/games/civic-responsibility/adults.json";
import guSustainabilityKids from "../locales/gu/pages/games/sustainability/kids.json";
import guSustainabilityKidsCards from "../locales/gu/pages/cardcontent/sustainability/kids.json";
import guSustainabilityTeens from "../locales/gu/pages/games/sustainability/teens.json";
import guSustainabilityTeensCards from "../locales/gu/pages/cardcontent/sustainability/teens.json";
import guSustainabilityYoungAdult from "../locales/gu/pages/games/sustainability/young-adult.json";
import guSustainabilityAdults from "../locales/gu/pages/games/sustainability/adults.json";
import knFinancialLiteracyTeens from "../locales/kn/pages/games/financial-literacy/teens.json";
import knFinancialLiteracyTeensCards from "../locales/kn/pages/cardcontent/financial-literacy/teens.json";
import knFinancialLiteracyYoungAdult from "../locales/kn/pages/games/financial-literacy/young-adult.json";
import knFinancialLiteracyYoungAdultCards from "../locales/kn/pages/cardcontent/financial-literacy/young-adult.json";
import knFinancialLiteracyKids from "../locales/kn/pages/games/financial-literacy/kids.json";
import knFinancialLiteracyKidsCards from "../locales/kn/pages/cardcontent/financial-literacy/kids.json";
import knFinancialLiteracyBusinessLivelihoodFinance from "../locales/kn/pages/games/financial-literacy/business-livelihood-finance.json";
import knFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/kn/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import knFinancialLiteracyInsurancePension from "../locales/kn/pages/games/financial-literacy/insurance-pension.json";
import knFinancialLiteracyInsurancePensionCards from "../locales/kn/pages/cardcontent/financial-literacy/insurance-pension.json";
import knFinancialLiteracyAdults from "../locales/kn/pages/games/financial-literacy/adults.json";
import knFinancialLiteracyAdultsCards from "../locales/kn/pages/cardcontent/financial-literacy/adults.json";
import knBrainHealthKids from "../locales/kn/pages/games/brain-health/kids.json";
import knBrainHealthKidsCards from "../locales/kn/pages/cardcontent/brain-health/kids.json";
import knBrainHealthTeens from "../locales/kn/pages/games/brain-health/teens.json";
import knBrainHealthTeensCards from "../locales/kn/pages/cardcontent/brain-health/teens.json";
import knBrainHealthYoungAdult from "../locales/kn/pages/games/brain-health/young-adult.json";
import knBrainHealthYoungAdultCards from "../locales/kn/pages/cardcontent/brain-health/young-adult.json";
import knBrainHealthAdults from "../locales/kn/pages/games/brain-health/adults.json";
import knBrainHealthAdultsCards from "../locales/kn/pages/cardcontent/brain-health/adults.json";
import knUvlsKids from "../locales/kn/pages/games/uvls/kids.json";
import knUvlsKidsCards from "../locales/kn/pages/cardcontent/uvls/kids.json";
import knUvlsTeens from "../locales/kn/pages/games/uvls/teens.json";
import knUvlsTeensCards from "../locales/kn/pages/cardcontent/uvls/teens.json";
import knUvlsYoungAdult from "../locales/kn/pages/games/uvls/young-adult.json";
import knUvlsAdults from "../locales/kn/pages/games/uvls/adults.json";
import knDigitalCitizenshipKids from "../locales/kn/pages/games/digital-citizenship/kids.json";
import knDigitalCitizenshipKidsCards from "../locales/kn/pages/cardcontent/digital-citizenship/kids.json";
import knDigitalCitizenshipTeens from "../locales/kn/pages/games/digital-citizenship/teens.json";
import knDigitalCitizenshipTeensCards from "../locales/kn/pages/cardcontent/digital-citizenship/teens.json";
import knDigitalCitizenshipYoungAdult from "../locales/kn/pages/games/digital-citizenship/young-adult.json";
import knDigitalCitizenshipAdults from "../locales/kn/pages/games/digital-citizenship/adults.json";
import knMoralValuesKids from "../locales/kn/pages/games/moral-values/kids.json";
import knMoralValuesKidsCards from "../locales/kn/pages/cardcontent/moral-values/kids.json";
import knMoralValuesTeens from "../locales/kn/pages/games/moral-values/teens.json";
import knMoralValuesTeensCards from "../locales/kn/pages/cardcontent/moral-values/teens.json";
import knMoralValuesYoungAdult from "../locales/kn/pages/games/moral-values/young-adult.json";
import knMoralValuesAdults from "../locales/kn/pages/games/moral-values/adults.json";
import knAiForAllKids from "../locales/kn/pages/games/ai-for-all/kids.json";
import knAiForAllKidsCards from "../locales/kn/pages/cardcontent/ai-for-all/kids.json";
import knAiForAllTeens from "../locales/kn/pages/games/ai-for-all/teens.json";
import knAiForAllTeensCards from "../locales/kn/pages/cardcontent/ai-for-all/teens.json";
import knAiForAllYoungAdult from "../locales/kn/pages/games/ai-for-all/young-adult.json";
import knAiForAllAdults from "../locales/kn/pages/games/ai-for-all/adults.json";
import knHealthMaleKids from "../locales/kn/pages/games/health-male/kids.json";
import knHealthMaleKidsCards from "../locales/kn/pages/cardcontent/health-male/kids.json";
import knHealthMaleTeens from "../locales/kn/pages/games/health-male/teens.json";
import knHealthMaleTeensCards from "../locales/kn/pages/cardcontent/health-male/teens.json";
import knHealthMaleYoungAdult from "../locales/kn/pages/games/health-male/young-adult.json";
import knHealthMaleAdults from "../locales/kn/pages/games/health-male/adults.json";
import knHealthFemaleKids from "../locales/kn/pages/games/health-female/kids.json";
import knHealthFemaleKidsCards from "../locales/kn/pages/cardcontent/health-female/kids.json";
import knHealthFemaleTeens from "../locales/kn/pages/games/health-female/teens.json";
import knHealthFemaleTeensCards from "../locales/kn/pages/cardcontent/health-female/teens.json";
import knHealthFemaleYoungAdult from "../locales/kn/pages/games/health-female/young-adult.json";
import knHealthFemaleAdults from "../locales/kn/pages/games/health-female/adults.json";
import knEheKids from "../locales/kn/pages/games/ehe/kids.json";
import knEheKidsCards from "../locales/kn/pages/cardcontent/ehe/kids.json";
import knEheTeens from "../locales/kn/pages/games/ehe/teens.json";
import knEheTeensCards from "../locales/kn/pages/cardcontent/ehe/teens.json";
import knEheYoungAdult from "../locales/kn/pages/games/ehe/young-adult.json";
import knEheAdults from "../locales/kn/pages/games/ehe/adults.json";
import knCivicResponsibilityKids from "../locales/kn/pages/games/civic-responsibility/kids.json";
import knCivicResponsibilityKidsCards from "../locales/kn/pages/cardcontent/civic-responsibility/kids.json";
import knCivicResponsibilityTeens from "../locales/kn/pages/games/civic-responsibility/teens.json";
import knCivicResponsibilityTeensCards from "../locales/kn/pages/cardcontent/civic-responsibility/teens.json";
import knCivicResponsibilityYoungAdult from "../locales/kn/pages/games/civic-responsibility/young-adult.json";
import knCivicResponsibilityAdults from "../locales/kn/pages/games/civic-responsibility/adults.json";
import knSustainabilityKids from "../locales/kn/pages/games/sustainability/kids.json";
import knSustainabilityKidsCards from "../locales/kn/pages/cardcontent/sustainability/kids.json";
import knSustainabilityTeens from "../locales/kn/pages/games/sustainability/teens.json";
import knSustainabilityTeensCards from "../locales/kn/pages/cardcontent/sustainability/teens.json";
import knSustainabilityYoungAdult from "../locales/kn/pages/games/sustainability/young-adult.json";
import knSustainabilityAdults from "../locales/kn/pages/games/sustainability/adults.json";
import mlFinancialLiteracyTeens from "../locales/ml/pages/games/financial-literacy/teens.json";
import mlFinancialLiteracyTeensCards from "../locales/ml/pages/cardcontent/financial-literacy/teens.json";
import mlFinancialLiteracyYoungAdult from "../locales/ml/pages/games/financial-literacy/young-adult.json";
import mlFinancialLiteracyYoungAdultCards from "../locales/ml/pages/cardcontent/financial-literacy/young-adult.json";
import mlFinancialLiteracyKids from "../locales/ml/pages/games/financial-literacy/kids.json";
import mlFinancialLiteracyKidsCards from "../locales/ml/pages/cardcontent/financial-literacy/kids.json";
import mlFinancialLiteracyBusinessLivelihoodFinance from "../locales/ml/pages/games/financial-literacy/business-livelihood-finance.json";
import mlFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/ml/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import mlFinancialLiteracyInsurancePension from "../locales/ml/pages/games/financial-literacy/insurance-pension.json";
import mlFinancialLiteracyInsurancePensionCards from "../locales/ml/pages/cardcontent/financial-literacy/insurance-pension.json";
import mlFinancialLiteracyAdults from "../locales/ml/pages/games/financial-literacy/adults.json";
import mlFinancialLiteracyAdultsCards from "../locales/ml/pages/cardcontent/financial-literacy/adults.json";
import mlBrainHealthKids from "../locales/ml/pages/games/brain-health/kids.json";
import mlBrainHealthKidsCards from "../locales/ml/pages/cardcontent/brain-health/kids.json";
import mlBrainHealthTeens from "../locales/ml/pages/games/brain-health/teens.json";
import mlBrainHealthTeensCards from "../locales/ml/pages/cardcontent/brain-health/teens.json";
import mlBrainHealthYoungAdult from "../locales/ml/pages/games/brain-health/young-adult.json";
import mlBrainHealthYoungAdultCards from "../locales/ml/pages/cardcontent/brain-health/young-adult.json";
import mlBrainHealthAdults from "../locales/ml/pages/games/brain-health/adults.json";
import mlBrainHealthAdultsCards from "../locales/ml/pages/cardcontent/brain-health/adults.json";
import mlUvlsKids from "../locales/ml/pages/games/uvls/kids.json";
import mlUvlsKidsCards from "../locales/ml/pages/cardcontent/uvls/kids.json";
import mlUvlsTeens from "../locales/ml/pages/games/uvls/teens.json";
import mlUvlsTeensCards from "../locales/ml/pages/cardcontent/uvls/teens.json";
import mlUvlsYoungAdult from "../locales/ml/pages/games/uvls/young-adult.json";
import mlUvlsAdults from "../locales/ml/pages/games/uvls/adults.json";
import mlDigitalCitizenshipKids from "../locales/ml/pages/games/digital-citizenship/kids.json";
import mlDigitalCitizenshipKidsCards from "../locales/ml/pages/cardcontent/digital-citizenship/kids.json";
import mlDigitalCitizenshipTeens from "../locales/ml/pages/games/digital-citizenship/teens.json";
import mlDigitalCitizenshipTeensCards from "../locales/ml/pages/cardcontent/digital-citizenship/teens.json";
import mlDigitalCitizenshipYoungAdult from "../locales/ml/pages/games/digital-citizenship/young-adult.json";
import mlDigitalCitizenshipAdults from "../locales/ml/pages/games/digital-citizenship/adults.json";
import mlMoralValuesKids from "../locales/ml/pages/games/moral-values/kids.json";
import mlMoralValuesKidsCards from "../locales/ml/pages/cardcontent/moral-values/kids.json";
import mlMoralValuesTeens from "../locales/ml/pages/games/moral-values/teens.json";
import mlMoralValuesTeensCards from "../locales/ml/pages/cardcontent/moral-values/teens.json";
import mlMoralValuesYoungAdult from "../locales/ml/pages/games/moral-values/young-adult.json";
import mlMoralValuesAdults from "../locales/ml/pages/games/moral-values/adults.json";
import mlAiForAllKids from "../locales/ml/pages/games/ai-for-all/kids.json";
import mlAiForAllKidsCards from "../locales/ml/pages/cardcontent/ai-for-all/kids.json";
import mlAiForAllTeens from "../locales/ml/pages/games/ai-for-all/teens.json";
import mlAiForAllTeensCards from "../locales/ml/pages/cardcontent/ai-for-all/teens.json";
import mlAiForAllYoungAdult from "../locales/ml/pages/games/ai-for-all/young-adult.json";
import mlAiForAllAdults from "../locales/ml/pages/games/ai-for-all/adults.json";
import mlHealthMaleKids from "../locales/ml/pages/games/health-male/kids.json";
import mlHealthMaleKidsCards from "../locales/ml/pages/cardcontent/health-male/kids.json";
import mlHealthMaleTeens from "../locales/ml/pages/games/health-male/teens.json";
import mlHealthMaleTeensCards from "../locales/ml/pages/cardcontent/health-male/teens.json";
import mlHealthMaleYoungAdult from "../locales/ml/pages/games/health-male/young-adult.json";
import mlHealthMaleAdults from "../locales/ml/pages/games/health-male/adults.json";
import mlHealthFemaleKids from "../locales/ml/pages/games/health-female/kids.json";
import mlHealthFemaleKidsCards from "../locales/ml/pages/cardcontent/health-female/kids.json";
import mlHealthFemaleTeens from "../locales/ml/pages/games/health-female/teens.json";
import mlHealthFemaleTeensCards from "../locales/ml/pages/cardcontent/health-female/teens.json";
import mlHealthFemaleYoungAdult from "../locales/ml/pages/games/health-female/young-adult.json";
import mlHealthFemaleAdults from "../locales/ml/pages/games/health-female/adults.json";
import mlEheKids from "../locales/ml/pages/games/ehe/kids.json";
import mlEheKidsCards from "../locales/ml/pages/cardcontent/ehe/kids.json";
import mlEheTeens from "../locales/ml/pages/games/ehe/teens.json";
import mlEheTeensCards from "../locales/ml/pages/cardcontent/ehe/teens.json";
import mlEheYoungAdult from "../locales/ml/pages/games/ehe/young-adult.json";
import mlEheAdults from "../locales/ml/pages/games/ehe/adults.json";
import mlCivicResponsibilityKids from "../locales/ml/pages/games/civic-responsibility/kids.json";
import mlCivicResponsibilityKidsCards from "../locales/ml/pages/cardcontent/civic-responsibility/kids.json";
import mlCivicResponsibilityTeens from "../locales/ml/pages/games/civic-responsibility/teens.json";
import mlCivicResponsibilityTeensCards from "../locales/ml/pages/cardcontent/civic-responsibility/teens.json";
import mlCivicResponsibilityYoungAdult from "../locales/ml/pages/games/civic-responsibility/young-adult.json";
import mlCivicResponsibilityAdults from "../locales/ml/pages/games/civic-responsibility/adults.json";
import mlSustainabilityKids from "../locales/ml/pages/games/sustainability/kids.json";
import mlSustainabilityKidsCards from "../locales/ml/pages/cardcontent/sustainability/kids.json";
import mlSustainabilityTeens from "../locales/ml/pages/games/sustainability/teens.json";
import mlSustainabilityTeensCards from "../locales/ml/pages/cardcontent/sustainability/teens.json";
import mlSustainabilityYoungAdult from "../locales/ml/pages/games/sustainability/young-adult.json";
import mlSustainabilityAdults from "../locales/ml/pages/games/sustainability/adults.json";
import mrFinancialLiteracyTeens from "../locales/mr/pages/games/financial-literacy/teens.json";
import mrFinancialLiteracyTeensCards from "../locales/mr/pages/cardcontent/financial-literacy/teens.json";
import mrFinancialLiteracyYoungAdult from "../locales/mr/pages/games/financial-literacy/young-adult.json";
import mrFinancialLiteracyYoungAdultCards from "../locales/mr/pages/cardcontent/financial-literacy/young-adult.json";
import mrFinancialLiteracyKids from "../locales/mr/pages/games/financial-literacy/kids.json";
import mrFinancialLiteracyKidsCards from "../locales/mr/pages/cardcontent/financial-literacy/kids.json";
import mrFinancialLiteracyBusinessLivelihoodFinance from "../locales/mr/pages/games/financial-literacy/business-livelihood-finance.json";
import mrFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/mr/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import mrFinancialLiteracyInsurancePension from "../locales/mr/pages/games/financial-literacy/insurance-pension.json";
import mrFinancialLiteracyInsurancePensionCards from "../locales/mr/pages/cardcontent/financial-literacy/insurance-pension.json";
import mrFinancialLiteracyAdults from "../locales/mr/pages/games/financial-literacy/adults.json";
import mrFinancialLiteracyAdultsCards from "../locales/mr/pages/cardcontent/financial-literacy/adults.json";
import mrBrainHealthKids from "../locales/mr/pages/games/brain-health/kids.json";
import mrBrainHealthKidsCards from "../locales/mr/pages/cardcontent/brain-health/kids.json";
import mrBrainHealthTeens from "../locales/mr/pages/games/brain-health/teens.json";
import mrBrainHealthTeensCards from "../locales/mr/pages/cardcontent/brain-health/teens.json";
import mrBrainHealthYoungAdult from "../locales/mr/pages/games/brain-health/young-adult.json";
import mrBrainHealthYoungAdultCards from "../locales/mr/pages/cardcontent/brain-health/young-adult.json";
import mrBrainHealthAdults from "../locales/mr/pages/games/brain-health/adults.json";
import mrBrainHealthAdultsCards from "../locales/mr/pages/cardcontent/brain-health/adults.json";
import mrUvlsKids from "../locales/mr/pages/games/uvls/kids.json";
import mrUvlsKidsCards from "../locales/mr/pages/cardcontent/uvls/kids.json";
import mrUvlsTeens from "../locales/mr/pages/games/uvls/teens.json";
import mrUvlsTeensCards from "../locales/mr/pages/cardcontent/uvls/teens.json";
import mrUvlsYoungAdult from "../locales/mr/pages/games/uvls/young-adult.json";
import mrUvlsAdults from "../locales/mr/pages/games/uvls/adults.json";
import mrDigitalCitizenshipKids from "../locales/mr/pages/games/digital-citizenship/kids.json";
import mrDigitalCitizenshipKidsCards from "../locales/mr/pages/cardcontent/digital-citizenship/kids.json";
import mrDigitalCitizenshipTeens from "../locales/mr/pages/games/digital-citizenship/teens.json";
import mrDigitalCitizenshipTeensCards from "../locales/mr/pages/cardcontent/digital-citizenship/teens.json";
import mrDigitalCitizenshipYoungAdult from "../locales/mr/pages/games/digital-citizenship/young-adult.json";
import mrDigitalCitizenshipAdults from "../locales/mr/pages/games/digital-citizenship/adults.json";
import mrMoralValuesKids from "../locales/mr/pages/games/moral-values/kids.json";
import mrMoralValuesKidsCards from "../locales/mr/pages/cardcontent/moral-values/kids.json";
import mrMoralValuesTeens from "../locales/mr/pages/games/moral-values/teens.json";
import mrMoralValuesTeensCards from "../locales/mr/pages/cardcontent/moral-values/teens.json";
import mrMoralValuesYoungAdult from "../locales/mr/pages/games/moral-values/young-adult.json";
import mrMoralValuesAdults from "../locales/mr/pages/games/moral-values/adults.json";
import mrAiForAllKids from "../locales/mr/pages/games/ai-for-all/kids.json";
import mrAiForAllKidsCards from "../locales/mr/pages/cardcontent/ai-for-all/kids.json";
import mrAiForAllTeens from "../locales/mr/pages/games/ai-for-all/teens.json";
import mrAiForAllTeensCards from "../locales/mr/pages/cardcontent/ai-for-all/teens.json";
import mrAiForAllYoungAdult from "../locales/mr/pages/games/ai-for-all/young-adult.json";
import mrAiForAllAdults from "../locales/mr/pages/games/ai-for-all/adults.json";
import mrHealthMaleKids from "../locales/mr/pages/games/health-male/kids.json";
import mrHealthMaleKidsCards from "../locales/mr/pages/cardcontent/health-male/kids.json";
import mrHealthMaleTeens from "../locales/mr/pages/games/health-male/teens.json";
import mrHealthMaleTeensCards from "../locales/mr/pages/cardcontent/health-male/teens.json";
import mrHealthMaleYoungAdult from "../locales/mr/pages/games/health-male/young-adult.json";
import mrHealthMaleAdults from "../locales/mr/pages/games/health-male/adults.json";
import mrHealthFemaleKids from "../locales/mr/pages/games/health-female/kids.json";
import mrHealthFemaleKidsCards from "../locales/mr/pages/cardcontent/health-female/kids.json";
import mrHealthFemaleTeens from "../locales/mr/pages/games/health-female/teens.json";
import mrHealthFemaleTeensCards from "../locales/mr/pages/cardcontent/health-female/teens.json";
import mrHealthFemaleYoungAdult from "../locales/mr/pages/games/health-female/young-adult.json";
import mrHealthFemaleAdults from "../locales/mr/pages/games/health-female/adults.json";
import mrEheKids from "../locales/mr/pages/games/ehe/kids.json";
import mrEheKidsCards from "../locales/mr/pages/cardcontent/ehe/kids.json";
import mrEheTeens from "../locales/mr/pages/games/ehe/teens.json";
import mrEheTeensCards from "../locales/mr/pages/cardcontent/ehe/teens.json";
import mrEheYoungAdult from "../locales/mr/pages/games/ehe/young-adult.json";
import mrEheAdults from "../locales/mr/pages/games/ehe/adults.json";
import mrCivicResponsibilityKids from "../locales/mr/pages/games/civic-responsibility/kids.json";
import mrCivicResponsibilityKidsCards from "../locales/mr/pages/cardcontent/civic-responsibility/kids.json";
import mrCivicResponsibilityTeens from "../locales/mr/pages/games/civic-responsibility/teens.json";
import mrCivicResponsibilityTeensCards from "../locales/mr/pages/cardcontent/civic-responsibility/teens.json";
import mrCivicResponsibilityYoungAdult from "../locales/mr/pages/games/civic-responsibility/young-adult.json";
import mrCivicResponsibilityAdults from "../locales/mr/pages/games/civic-responsibility/adults.json";
import mrSustainabilityKids from "../locales/mr/pages/games/sustainability/kids.json";
import mrSustainabilityKidsCards from "../locales/mr/pages/cardcontent/sustainability/kids.json";
import mrSustainabilityTeens from "../locales/mr/pages/games/sustainability/teens.json";
import mrSustainabilityTeensCards from "../locales/mr/pages/cardcontent/sustainability/teens.json";
import mrSustainabilityYoungAdult from "../locales/mr/pages/games/sustainability/young-adult.json";
import mrSustainabilityAdults from "../locales/mr/pages/games/sustainability/adults.json";
import paFinancialLiteracyTeens from "../locales/pa/pages/games/financial-literacy/teens.json";
import paFinancialLiteracyTeensCards from "../locales/pa/pages/cardcontent/financial-literacy/teens.json";
import paFinancialLiteracyYoungAdult from "../locales/pa/pages/games/financial-literacy/young-adult.json";
import paFinancialLiteracyYoungAdultCards from "../locales/pa/pages/cardcontent/financial-literacy/young-adult.json";
import paFinancialLiteracyKids from "../locales/pa/pages/games/financial-literacy/kids.json";
import paFinancialLiteracyKidsCards from "../locales/pa/pages/cardcontent/financial-literacy/kids.json";
import paFinancialLiteracyBusinessLivelihoodFinance from "../locales/pa/pages/games/financial-literacy/business-livelihood-finance.json";
import paFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/pa/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import paFinancialLiteracyInsurancePension from "../locales/pa/pages/games/financial-literacy/insurance-pension.json";
import paFinancialLiteracyInsurancePensionCards from "../locales/pa/pages/cardcontent/financial-literacy/insurance-pension.json";
import paFinancialLiteracyAdults from "../locales/pa/pages/games/financial-literacy/adults.json";
import paFinancialLiteracyAdultsCards from "../locales/pa/pages/cardcontent/financial-literacy/adults.json";
import paBrainHealthKids from "../locales/pa/pages/games/brain-health/kids.json";
import paBrainHealthKidsCards from "../locales/pa/pages/cardcontent/brain-health/kids.json";
import paBrainHealthTeens from "../locales/pa/pages/games/brain-health/teens.json";
import paBrainHealthTeensCards from "../locales/pa/pages/cardcontent/brain-health/teens.json";
import paBrainHealthYoungAdult from "../locales/pa/pages/games/brain-health/young-adult.json";
import paBrainHealthYoungAdultCards from "../locales/pa/pages/cardcontent/brain-health/young-adult.json";
import paBrainHealthAdults from "../locales/pa/pages/games/brain-health/adults.json";
import paBrainHealthAdultsCards from "../locales/pa/pages/cardcontent/brain-health/adults.json";
import paUvlsKids from "../locales/pa/pages/games/uvls/kids.json";
import paUvlsKidsCards from "../locales/pa/pages/cardcontent/uvls/kids.json";
import paUvlsTeens from "../locales/pa/pages/games/uvls/teens.json";
import paUvlsTeensCards from "../locales/pa/pages/cardcontent/uvls/teens.json";
import paUvlsYoungAdult from "../locales/pa/pages/games/uvls/young-adult.json";
import paUvlsAdults from "../locales/pa/pages/games/uvls/adults.json";
import paDigitalCitizenshipKids from "../locales/pa/pages/games/digital-citizenship/kids.json";
import paDigitalCitizenshipKidsCards from "../locales/pa/pages/cardcontent/digital-citizenship/kids.json";
import paDigitalCitizenshipTeens from "../locales/pa/pages/games/digital-citizenship/teens.json";
import paDigitalCitizenshipTeensCards from "../locales/pa/pages/cardcontent/digital-citizenship/teens.json";
import paDigitalCitizenshipYoungAdult from "../locales/pa/pages/games/digital-citizenship/young-adult.json";
import paDigitalCitizenshipAdults from "../locales/pa/pages/games/digital-citizenship/adults.json";
import paMoralValuesKids from "../locales/pa/pages/games/moral-values/kids.json";
import paMoralValuesKidsCards from "../locales/pa/pages/cardcontent/moral-values/kids.json";
import paMoralValuesTeens from "../locales/pa/pages/games/moral-values/teens.json";
import paMoralValuesTeensCards from "../locales/pa/pages/cardcontent/moral-values/teens.json";
import paMoralValuesYoungAdult from "../locales/pa/pages/games/moral-values/young-adult.json";
import paMoralValuesAdults from "../locales/pa/pages/games/moral-values/adults.json";
import paAiForAllKids from "../locales/pa/pages/games/ai-for-all/kids.json";
import paAiForAllKidsCards from "../locales/pa/pages/cardcontent/ai-for-all/kids.json";
import paAiForAllTeens from "../locales/pa/pages/games/ai-for-all/teens.json";
import paAiForAllTeensCards from "../locales/pa/pages/cardcontent/ai-for-all/teens.json";
import paAiForAllYoungAdult from "../locales/pa/pages/games/ai-for-all/young-adult.json";
import paAiForAllAdults from "../locales/pa/pages/games/ai-for-all/adults.json";
import paHealthMaleKids from "../locales/pa/pages/games/health-male/kids.json";
import paHealthMaleKidsCards from "../locales/pa/pages/cardcontent/health-male/kids.json";
import paHealthMaleTeens from "../locales/pa/pages/games/health-male/teens.json";
import paHealthMaleTeensCards from "../locales/pa/pages/cardcontent/health-male/teens.json";
import paHealthMaleYoungAdult from "../locales/pa/pages/games/health-male/young-adult.json";
import paHealthMaleAdults from "../locales/pa/pages/games/health-male/adults.json";
import paHealthFemaleKids from "../locales/pa/pages/games/health-female/kids.json";
import paHealthFemaleKidsCards from "../locales/pa/pages/cardcontent/health-female/kids.json";
import paHealthFemaleTeens from "../locales/pa/pages/games/health-female/teens.json";
import paHealthFemaleTeensCards from "../locales/pa/pages/cardcontent/health-female/teens.json";
import paHealthFemaleYoungAdult from "../locales/pa/pages/games/health-female/young-adult.json";
import paHealthFemaleAdults from "../locales/pa/pages/games/health-female/adults.json";
import paEheKids from "../locales/pa/pages/games/ehe/kids.json";
import paEheKidsCards from "../locales/pa/pages/cardcontent/ehe/kids.json";
import paEheTeens from "../locales/pa/pages/games/ehe/teens.json";
import paEheTeensCards from "../locales/pa/pages/cardcontent/ehe/teens.json";
import paEheYoungAdult from "../locales/pa/pages/games/ehe/young-adult.json";
import paEheAdults from "../locales/pa/pages/games/ehe/adults.json";
import paCivicResponsibilityKids from "../locales/pa/pages/games/civic-responsibility/kids.json";
import paCivicResponsibilityKidsCards from "../locales/pa/pages/cardcontent/civic-responsibility/kids.json";
import paCivicResponsibilityTeens from "../locales/pa/pages/games/civic-responsibility/teens.json";
import paCivicResponsibilityTeensCards from "../locales/pa/pages/cardcontent/civic-responsibility/teens.json";
import paCivicResponsibilityYoungAdult from "../locales/pa/pages/games/civic-responsibility/young-adult.json";
import paCivicResponsibilityAdults from "../locales/pa/pages/games/civic-responsibility/adults.json";
import paSustainabilityKids from "../locales/pa/pages/games/sustainability/kids.json";
import paSustainabilityKidsCards from "../locales/pa/pages/cardcontent/sustainability/kids.json";
import paSustainabilityTeens from "../locales/pa/pages/games/sustainability/teens.json";
import paSustainabilityTeensCards from "../locales/pa/pages/cardcontent/sustainability/teens.json";
import paSustainabilityYoungAdult from "../locales/pa/pages/games/sustainability/young-adult.json";
import paSustainabilityAdults from "../locales/pa/pages/games/sustainability/adults.json";
import taFinancialLiteracyTeens from "../locales/ta/pages/games/financial-literacy/teens.json";
import taFinancialLiteracyTeensCards from "../locales/ta/pages/cardcontent/financial-literacy/teens.json";
import taFinancialLiteracyYoungAdult from "../locales/ta/pages/games/financial-literacy/young-adult.json";
import taFinancialLiteracyYoungAdultCards from "../locales/ta/pages/cardcontent/financial-literacy/young-adult.json";
import taFinancialLiteracyKids from "../locales/ta/pages/games/financial-literacy/kids.json";
import taFinancialLiteracyKidsCards from "../locales/ta/pages/cardcontent/financial-literacy/kids.json";
import taFinancialLiteracyBusinessLivelihoodFinance from "../locales/ta/pages/games/financial-literacy/business-livelihood-finance.json";
import taFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/ta/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import taFinancialLiteracyInsurancePension from "../locales/ta/pages/games/financial-literacy/insurance-pension.json";
import taFinancialLiteracyInsurancePensionCards from "../locales/ta/pages/cardcontent/financial-literacy/insurance-pension.json";
import taFinancialLiteracyAdults from "../locales/ta/pages/games/financial-literacy/adults.json";
import taFinancialLiteracyAdultsCards from "../locales/ta/pages/cardcontent/financial-literacy/adults.json";
import taBrainHealthKids from "../locales/ta/pages/games/brain-health/kids.json";
import taBrainHealthKidsCards from "../locales/ta/pages/cardcontent/brain-health/kids.json";
import taBrainHealthTeens from "../locales/ta/pages/games/brain-health/teens.json";
import taBrainHealthTeensCards from "../locales/ta/pages/cardcontent/brain-health/teens.json";
import taBrainHealthYoungAdult from "../locales/ta/pages/games/brain-health/young-adult.json";
import taBrainHealthYoungAdultCards from "../locales/ta/pages/cardcontent/brain-health/young-adult.json";
import taBrainHealthAdults from "../locales/ta/pages/games/brain-health/adults.json";
import taBrainHealthAdultsCards from "../locales/ta/pages/cardcontent/brain-health/adults.json";
import taUvlsKids from "../locales/ta/pages/games/uvls/kids.json";
import taUvlsKidsCards from "../locales/ta/pages/cardcontent/uvls/kids.json";
import taUvlsTeens from "../locales/ta/pages/games/uvls/teens.json";
import taUvlsTeensCards from "../locales/ta/pages/cardcontent/uvls/teens.json";
import taUvlsYoungAdult from "../locales/ta/pages/games/uvls/young-adult.json";
import taUvlsAdults from "../locales/ta/pages/games/uvls/adults.json";
import taDigitalCitizenshipKids from "../locales/ta/pages/games/digital-citizenship/kids.json";
import taDigitalCitizenshipKidsCards from "../locales/ta/pages/cardcontent/digital-citizenship/kids.json";
import taDigitalCitizenshipTeens from "../locales/ta/pages/games/digital-citizenship/teens.json";
import taDigitalCitizenshipTeensCards from "../locales/ta/pages/cardcontent/digital-citizenship/teens.json";
import taDigitalCitizenshipYoungAdult from "../locales/ta/pages/games/digital-citizenship/young-adult.json";
import taDigitalCitizenshipAdults from "../locales/ta/pages/games/digital-citizenship/adults.json";
import taMoralValuesKids from "../locales/ta/pages/games/moral-values/kids.json";
import taMoralValuesKidsCards from "../locales/ta/pages/cardcontent/moral-values/kids.json";
import taMoralValuesTeens from "../locales/ta/pages/games/moral-values/teens.json";
import taMoralValuesTeensCards from "../locales/ta/pages/cardcontent/moral-values/teens.json";
import taMoralValuesYoungAdult from "../locales/ta/pages/games/moral-values/young-adult.json";
import taMoralValuesAdults from "../locales/ta/pages/games/moral-values/adults.json";
import taAiForAllKids from "../locales/ta/pages/games/ai-for-all/kids.json";
import taAiForAllKidsCards from "../locales/ta/pages/cardcontent/ai-for-all/kids.json";
import taAiForAllTeens from "../locales/ta/pages/games/ai-for-all/teens.json";
import taAiForAllTeensCards from "../locales/ta/pages/cardcontent/ai-for-all/teens.json";
import taAiForAllYoungAdult from "../locales/ta/pages/games/ai-for-all/young-adult.json";
import taAiForAllAdults from "../locales/ta/pages/games/ai-for-all/adults.json";
import taHealthMaleKids from "../locales/ta/pages/games/health-male/kids.json";
import taHealthMaleKidsCards from "../locales/ta/pages/cardcontent/health-male/kids.json";
import taHealthMaleTeens from "../locales/ta/pages/games/health-male/teens.json";
import taHealthMaleTeensCards from "../locales/ta/pages/cardcontent/health-male/teens.json";
import taHealthMaleYoungAdult from "../locales/ta/pages/games/health-male/young-adult.json";
import taHealthMaleAdults from "../locales/ta/pages/games/health-male/adults.json";
import taHealthFemaleKids from "../locales/ta/pages/games/health-female/kids.json";
import taHealthFemaleKidsCards from "../locales/ta/pages/cardcontent/health-female/kids.json";
import taHealthFemaleTeens from "../locales/ta/pages/games/health-female/teens.json";
import taHealthFemaleTeensCards from "../locales/ta/pages/cardcontent/health-female/teens.json";
import taHealthFemaleYoungAdult from "../locales/ta/pages/games/health-female/young-adult.json";
import taHealthFemaleAdults from "../locales/ta/pages/games/health-female/adults.json";
import taEheKids from "../locales/ta/pages/games/ehe/kids.json";
import taEheKidsCards from "../locales/ta/pages/cardcontent/ehe/kids.json";
import taEheTeens from "../locales/ta/pages/games/ehe/teens.json";
import taEheTeensCards from "../locales/ta/pages/cardcontent/ehe/teens.json";
import taEheYoungAdult from "../locales/ta/pages/games/ehe/young-adult.json";
import taEheAdults from "../locales/ta/pages/games/ehe/adults.json";
import taCivicResponsibilityKids from "../locales/ta/pages/games/civic-responsibility/kids.json";
import taCivicResponsibilityKidsCards from "../locales/ta/pages/cardcontent/civic-responsibility/kids.json";
import taCivicResponsibilityTeens from "../locales/ta/pages/games/civic-responsibility/teens.json";
import taCivicResponsibilityTeensCards from "../locales/ta/pages/cardcontent/civic-responsibility/teens.json";
import taCivicResponsibilityYoungAdult from "../locales/ta/pages/games/civic-responsibility/young-adult.json";
import taCivicResponsibilityAdults from "../locales/ta/pages/games/civic-responsibility/adults.json";
import taSustainabilityKids from "../locales/ta/pages/games/sustainability/kids.json";
import taSustainabilityKidsCards from "../locales/ta/pages/cardcontent/sustainability/kids.json";
import taSustainabilityTeens from "../locales/ta/pages/games/sustainability/teens.json";
import taSustainabilityTeensCards from "../locales/ta/pages/cardcontent/sustainability/teens.json";
import taSustainabilityYoungAdult from "../locales/ta/pages/games/sustainability/young-adult.json";
import taSustainabilityAdults from "../locales/ta/pages/games/sustainability/adults.json";
import teFinancialLiteracyTeens from "../locales/te/pages/games/financial-literacy/teens.json";
import teFinancialLiteracyTeensCards from "../locales/te/pages/cardcontent/financial-literacy/teens.json";
import teFinancialLiteracyYoungAdult from "../locales/te/pages/games/financial-literacy/young-adult.json";
import teFinancialLiteracyYoungAdultCards from "../locales/te/pages/cardcontent/financial-literacy/young-adult.json";
import teFinancialLiteracyKids from "../locales/te/pages/games/financial-literacy/kids.json";
import teFinancialLiteracyKidsCards from "../locales/te/pages/cardcontent/financial-literacy/kids.json";
import teFinancialLiteracyBusinessLivelihoodFinance from "../locales/te/pages/games/financial-literacy/business-livelihood-finance.json";
import teFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/te/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import teFinancialLiteracyInsurancePension from "../locales/te/pages/games/financial-literacy/insurance-pension.json";
import teFinancialLiteracyInsurancePensionCards from "../locales/te/pages/cardcontent/financial-literacy/insurance-pension.json";
import teFinancialLiteracyAdults from "../locales/te/pages/games/financial-literacy/adults.json";
import teFinancialLiteracyAdultsCards from "../locales/te/pages/cardcontent/financial-literacy/adults.json";
import teBrainHealthKids from "../locales/te/pages/games/brain-health/kids.json";
import teBrainHealthKidsCards from "../locales/te/pages/cardcontent/brain-health/kids.json";
import teBrainHealthTeens from "../locales/te/pages/games/brain-health/teens.json";
import teBrainHealthTeensCards from "../locales/te/pages/cardcontent/brain-health/teens.json";
import teBrainHealthYoungAdult from "../locales/te/pages/games/brain-health/young-adult.json";
import teBrainHealthYoungAdultCards from "../locales/te/pages/cardcontent/brain-health/young-adult.json";
import teBrainHealthAdults from "../locales/te/pages/games/brain-health/adults.json";
import teBrainHealthAdultsCards from "../locales/te/pages/cardcontent/brain-health/adults.json";
import teUvlsKids from "../locales/te/pages/games/uvls/kids.json";
import teUvlsKidsCards from "../locales/te/pages/cardcontent/uvls/kids.json";
import teUvlsTeens from "../locales/te/pages/games/uvls/teens.json";
import teUvlsTeensCards from "../locales/te/pages/cardcontent/uvls/teens.json";
import teUvlsYoungAdult from "../locales/te/pages/games/uvls/young-adult.json";
import teUvlsAdults from "../locales/te/pages/games/uvls/adults.json";
import teDigitalCitizenshipKids from "../locales/te/pages/games/digital-citizenship/kids.json";
import teDigitalCitizenshipKidsCards from "../locales/te/pages/cardcontent/digital-citizenship/kids.json";
import teDigitalCitizenshipTeens from "../locales/te/pages/games/digital-citizenship/teens.json";
import teDigitalCitizenshipTeensCards from "../locales/te/pages/cardcontent/digital-citizenship/teens.json";
import teDigitalCitizenshipYoungAdult from "../locales/te/pages/games/digital-citizenship/young-adult.json";
import teDigitalCitizenshipAdults from "../locales/te/pages/games/digital-citizenship/adults.json";
import teMoralValuesKids from "../locales/te/pages/games/moral-values/kids.json";
import teMoralValuesKidsCards from "../locales/te/pages/cardcontent/moral-values/kids.json";
import teMoralValuesTeens from "../locales/te/pages/games/moral-values/teens.json";
import teMoralValuesTeensCards from "../locales/te/pages/cardcontent/moral-values/teens.json";
import teMoralValuesYoungAdult from "../locales/te/pages/games/moral-values/young-adult.json";
import teMoralValuesAdults from "../locales/te/pages/games/moral-values/adults.json";
import teAiForAllKids from "../locales/te/pages/games/ai-for-all/kids.json";
import teAiForAllKidsCards from "../locales/te/pages/cardcontent/ai-for-all/kids.json";
import teAiForAllTeens from "../locales/te/pages/games/ai-for-all/teens.json";
import teAiForAllTeensCards from "../locales/te/pages/cardcontent/ai-for-all/teens.json";
import teAiForAllYoungAdult from "../locales/te/pages/games/ai-for-all/young-adult.json";
import teAiForAllAdults from "../locales/te/pages/games/ai-for-all/adults.json";
import teHealthMaleKids from "../locales/te/pages/games/health-male/kids.json";
import teHealthMaleKidsCards from "../locales/te/pages/cardcontent/health-male/kids.json";
import teHealthMaleTeens from "../locales/te/pages/games/health-male/teens.json";
import teHealthMaleTeensCards from "../locales/te/pages/cardcontent/health-male/teens.json";
import teHealthMaleYoungAdult from "../locales/te/pages/games/health-male/young-adult.json";
import teHealthMaleAdults from "../locales/te/pages/games/health-male/adults.json";
import teHealthFemaleKids from "../locales/te/pages/games/health-female/kids.json";
import teHealthFemaleKidsCards from "../locales/te/pages/cardcontent/health-female/kids.json";
import teHealthFemaleTeens from "../locales/te/pages/games/health-female/teens.json";
import teHealthFemaleTeensCards from "../locales/te/pages/cardcontent/health-female/teens.json";
import teHealthFemaleYoungAdult from "../locales/te/pages/games/health-female/young-adult.json";
import teHealthFemaleAdults from "../locales/te/pages/games/health-female/adults.json";
import teEheKids from "../locales/te/pages/games/ehe/kids.json";
import teEheKidsCards from "../locales/te/pages/cardcontent/ehe/kids.json";
import teEheTeens from "../locales/te/pages/games/ehe/teens.json";
import teEheTeensCards from "../locales/te/pages/cardcontent/ehe/teens.json";
import teEheYoungAdult from "../locales/te/pages/games/ehe/young-adult.json";
import teEheAdults from "../locales/te/pages/games/ehe/adults.json";
import teCivicResponsibilityKids from "../locales/te/pages/games/civic-responsibility/kids.json";
import teCivicResponsibilityKidsCards from "../locales/te/pages/cardcontent/civic-responsibility/kids.json";
import teCivicResponsibilityTeens from "../locales/te/pages/games/civic-responsibility/teens.json";
import teCivicResponsibilityTeensCards from "../locales/te/pages/cardcontent/civic-responsibility/teens.json";
import teCivicResponsibilityYoungAdult from "../locales/te/pages/games/civic-responsibility/young-adult.json";
import teCivicResponsibilityAdults from "../locales/te/pages/games/civic-responsibility/adults.json";
import teSustainabilityKids from "../locales/te/pages/games/sustainability/kids.json";
import teSustainabilityKidsCards from "../locales/te/pages/cardcontent/sustainability/kids.json";
import teSustainabilityTeens from "../locales/te/pages/games/sustainability/teens.json";
import teSustainabilityTeensCards from "../locales/te/pages/cardcontent/sustainability/teens.json";
import teSustainabilityYoungAdult from "../locales/te/pages/games/sustainability/young-adult.json";
import teSustainabilityAdults from "../locales/te/pages/games/sustainability/adults.json";
import urFinancialLiteracyTeens from "../locales/ur/pages/games/financial-literacy/teens.json";
import urFinancialLiteracyTeensCards from "../locales/ur/pages/cardcontent/financial-literacy/teens.json";
import urFinancialLiteracyYoungAdult from "../locales/ur/pages/games/financial-literacy/young-adult.json";
import urFinancialLiteracyYoungAdultCards from "../locales/ur/pages/cardcontent/financial-literacy/young-adult.json";
import urFinancialLiteracyKids from "../locales/ur/pages/games/financial-literacy/kids.json";
import urFinancialLiteracyKidsCards from "../locales/ur/pages/cardcontent/financial-literacy/kids.json";
import urFinancialLiteracyBusinessLivelihoodFinance from "../locales/ur/pages/games/financial-literacy/business-livelihood-finance.json";
import urFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/ur/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import urFinancialLiteracyInsurancePension from "../locales/ur/pages/games/financial-literacy/insurance-pension.json";
import urFinancialLiteracyInsurancePensionCards from "../locales/ur/pages/cardcontent/financial-literacy/insurance-pension.json";
import urFinancialLiteracyAdults from "../locales/ur/pages/games/financial-literacy/adults.json";
import urFinancialLiteracyAdultsCards from "../locales/ur/pages/cardcontent/financial-literacy/adults.json";
import urBrainHealthKids from "../locales/ur/pages/games/brain-health/kids.json";
import urBrainHealthKidsCards from "../locales/ur/pages/cardcontent/brain-health/kids.json";
import urBrainHealthTeens from "../locales/ur/pages/games/brain-health/teens.json";
import urBrainHealthTeensCards from "../locales/ur/pages/cardcontent/brain-health/teens.json";
import urBrainHealthYoungAdult from "../locales/ur/pages/games/brain-health/young-adult.json";
import urBrainHealthYoungAdultCards from "../locales/ur/pages/cardcontent/brain-health/young-adult.json";
import urBrainHealthAdults from "../locales/ur/pages/games/brain-health/adults.json";
import urBrainHealthAdultsCards from "../locales/ur/pages/cardcontent/brain-health/adults.json";
import urUvlsKids from "../locales/ur/pages/games/uvls/kids.json";
import urUvlsKidsCards from "../locales/ur/pages/cardcontent/uvls/kids.json";
import urUvlsTeens from "../locales/ur/pages/games/uvls/teens.json";
import urUvlsTeensCards from "../locales/ur/pages/cardcontent/uvls/teens.json";
import urUvlsYoungAdult from "../locales/ur/pages/games/uvls/young-adult.json";
import urUvlsAdults from "../locales/ur/pages/games/uvls/adults.json";
import urDigitalCitizenshipKids from "../locales/ur/pages/games/digital-citizenship/kids.json";
import urDigitalCitizenshipKidsCards from "../locales/ur/pages/cardcontent/digital-citizenship/kids.json";
import urDigitalCitizenshipTeens from "../locales/ur/pages/games/digital-citizenship/teens.json";
import urDigitalCitizenshipTeensCards from "../locales/ur/pages/cardcontent/digital-citizenship/teens.json";
import urDigitalCitizenshipYoungAdult from "../locales/ur/pages/games/digital-citizenship/young-adult.json";
import urDigitalCitizenshipAdults from "../locales/ur/pages/games/digital-citizenship/adults.json";
import urMoralValuesKids from "../locales/ur/pages/games/moral-values/kids.json";
import urMoralValuesKidsCards from "../locales/ur/pages/cardcontent/moral-values/kids.json";
import urMoralValuesTeens from "../locales/ur/pages/games/moral-values/teens.json";
import urMoralValuesTeensCards from "../locales/ur/pages/cardcontent/moral-values/teens.json";
import urMoralValuesYoungAdult from "../locales/ur/pages/games/moral-values/young-adult.json";
import urMoralValuesAdults from "../locales/ur/pages/games/moral-values/adults.json";
import urAiForAllKids from "../locales/ur/pages/games/ai-for-all/kids.json";
import urAiForAllKidsCards from "../locales/ur/pages/cardcontent/ai-for-all/kids.json";
import urAiForAllTeens from "../locales/ur/pages/games/ai-for-all/teens.json";
import urAiForAllTeensCards from "../locales/ur/pages/cardcontent/ai-for-all/teens.json";
import urAiForAllYoungAdult from "../locales/ur/pages/games/ai-for-all/young-adult.json";
import urAiForAllAdults from "../locales/ur/pages/games/ai-for-all/adults.json";
import urHealthMaleKids from "../locales/ur/pages/games/health-male/kids.json";
import urHealthMaleKidsCards from "../locales/ur/pages/cardcontent/health-male/kids.json";
import urHealthMaleTeens from "../locales/ur/pages/games/health-male/teens.json";
import urHealthMaleTeensCards from "../locales/ur/pages/cardcontent/health-male/teens.json";
import urHealthMaleYoungAdult from "../locales/ur/pages/games/health-male/young-adult.json";
import urHealthMaleAdults from "../locales/ur/pages/games/health-male/adults.json";
import urHealthFemaleKids from "../locales/ur/pages/games/health-female/kids.json";
import urHealthFemaleKidsCards from "../locales/ur/pages/cardcontent/health-female/kids.json";
import urHealthFemaleTeens from "../locales/ur/pages/games/health-female/teens.json";
import urHealthFemaleTeensCards from "../locales/ur/pages/cardcontent/health-female/teens.json";
import urHealthFemaleYoungAdult from "../locales/ur/pages/games/health-female/young-adult.json";
import urHealthFemaleAdults from "../locales/ur/pages/games/health-female/adults.json";
import urEheKids from "../locales/ur/pages/games/ehe/kids.json";
import urEheKidsCards from "../locales/ur/pages/cardcontent/ehe/kids.json";
import urEheTeens from "../locales/ur/pages/games/ehe/teens.json";
import urEheTeensCards from "../locales/ur/pages/cardcontent/ehe/teens.json";
import urEheYoungAdult from "../locales/ur/pages/games/ehe/young-adult.json";
import urEheAdults from "../locales/ur/pages/games/ehe/adults.json";
import urCivicResponsibilityKids from "../locales/ur/pages/games/civic-responsibility/kids.json";
import urCivicResponsibilityKidsCards from "../locales/ur/pages/cardcontent/civic-responsibility/kids.json";
import urCivicResponsibilityTeens from "../locales/ur/pages/games/civic-responsibility/teens.json";
import urCivicResponsibilityTeensCards from "../locales/ur/pages/cardcontent/civic-responsibility/teens.json";
import urCivicResponsibilityYoungAdult from "../locales/ur/pages/games/civic-responsibility/young-adult.json";
import urCivicResponsibilityAdults from "../locales/ur/pages/games/civic-responsibility/adults.json";
import urSustainabilityKids from "../locales/ur/pages/games/sustainability/kids.json";
import urSustainabilityKidsCards from "../locales/ur/pages/cardcontent/sustainability/kids.json";
import urSustainabilityTeens from "../locales/ur/pages/games/sustainability/teens.json";
import urSustainabilityTeensCards from "../locales/ur/pages/cardcontent/sustainability/teens.json";
import urSustainabilityYoungAdult from "../locales/ur/pages/games/sustainability/young-adult.json";
import urSustainabilityAdults from "../locales/ur/pages/games/sustainability/adults.json";

import hiFinancialLiteracyTeens from "../locales/hi/pages/games/financial-literacy/teens.json";
import hiFinancialLiteracyTeensCards from "../locales/hi/pages/cardcontent/financial-literacy/teens.json";
import hiFinancialLiteracyYoungAdult from "../locales/hi/pages/games/financial-literacy/young-adult.json";
import hiFinancialLiteracyYoungAdultCards from "../locales/hi/pages/cardcontent/financial-literacy/young-adult.json";
import hiFinancialLiteracyKids from "../locales/hi/pages/games/financial-literacy/kids.json";
import hiFinancialLiteracyKidsCards from "../locales/hi/pages/cardcontent/financial-literacy/kids.json";
import hiFinancialLiteracyBusinessLivelihoodFinance from "../locales/hi/pages/games/financial-literacy/business-livelihood-finance.json";
import hiFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/hi/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import hiFinancialLiteracyInsurancePension from "../locales/hi/pages/games/financial-literacy/insurance-pension.json";
import hiFinancialLiteracyInsurancePensionCards from "../locales/hi/pages/cardcontent/financial-literacy/insurance-pension.json";
import hiFinancialLiteracyAdults from "../locales/hi/pages/games/financial-literacy/adults.json";
import hiFinancialLiteracyAdultsCards from "../locales/hi/pages/cardcontent/financial-literacy/adults.json";

import hiBrainHealthKids from "../locales/hi/pages/games/brain-health/kids.json";
import hiBrainHealthKidsCards from "../locales/hi/pages/cardcontent/brain-health/kids.json";
import hiBrainHealthTeens from "../locales/hi/pages/games/brain-health/teens.json";
import hiBrainHealthTeensCards from "../locales/hi/pages/cardcontent/brain-health/teens.json";
import hiBrainHealthYoungAdult from "../locales/hi/pages/games/brain-health/young-adult.json";
import hiBrainHealthYoungAdultCards from "../locales/hi/pages/cardcontent/brain-health/young-adult.json";
import hiBrainHealthAdults from "../locales/hi/pages/games/brain-health/adults.json";
import hiBrainHealthAdultsCards from "../locales/hi/pages/cardcontent/brain-health/adults.json";

import hiUvlsKids from "../locales/hi/pages/games/uvls/kids.json";
import hiUvlsKidsCards from "../locales/hi/pages/cardcontent/uvls/kids.json";
import hiUvlsTeens from "../locales/hi/pages/games/uvls/teens.json";
import hiUvlsTeensCards from "../locales/hi/pages/cardcontent/uvls/teens.json";
import hiUvlsYoungAdult from "../locales/hi/pages/games/uvls/young-adult.json";
import hiUvlsAdults from "../locales/hi/pages/games/uvls/adults.json";

import hiDigitalCitizenshipKids from "../locales/hi/pages/games/digital-citizenship/kids.json";
import hiDigitalCitizenshipKidsCards from "../locales/hi/pages/cardcontent/digital-citizenship/kids.json";
import hiDigitalCitizenshipTeens from "../locales/hi/pages/games/digital-citizenship/teens.json";
import hiDigitalCitizenshipTeensCards from "../locales/hi/pages/cardcontent/digital-citizenship/teens.json";
import hiDigitalCitizenshipYoungAdult from "../locales/hi/pages/games/digital-citizenship/young-adult.json";
import hiDigitalCitizenshipAdults from "../locales/hi/pages/games/digital-citizenship/adults.json";

import hiMoralValuesKids from "../locales/hi/pages/games/moral-values/kids.json";
import hiMoralValuesKidsCards from "../locales/hi/pages/cardcontent/moral-values/kids.json";
import hiMoralValuesTeens from "../locales/hi/pages/games/moral-values/teens.json";
import hiMoralValuesTeensCards from "../locales/hi/pages/cardcontent/moral-values/teens.json";
import hiMoralValuesYoungAdult from "../locales/hi/pages/games/moral-values/young-adult.json";
import hiMoralValuesAdults from "../locales/hi/pages/games/moral-values/adults.json";

import hiAiForAllKids from "../locales/hi/pages/games/ai-for-all/kids.json";
import hiAiForAllKidsCards from "../locales/hi/pages/cardcontent/ai-for-all/kids.json";
import hiAiForAllTeens from "../locales/hi/pages/games/ai-for-all/teens.json";
import hiAiForAllTeensCards from "../locales/hi/pages/cardcontent/ai-for-all/teens.json";
import hiAiForAllYoungAdult from "../locales/hi/pages/games/ai-for-all/young-adult.json";
import hiAiForAllAdults from "../locales/hi/pages/games/ai-for-all/adults.json";

import hiHealthMaleKids from "../locales/hi/pages/games/health-male/kids.json";
import hiHealthMaleKidsCards from "../locales/hi/pages/cardcontent/health-male/kids.json";
import hiHealthMaleTeens from "../locales/hi/pages/games/health-male/teens.json";
import hiHealthMaleTeensCards from "../locales/hi/pages/cardcontent/health-male/teens.json";
import hiHealthMaleYoungAdult from "../locales/hi/pages/games/health-male/young-adult.json";
import hiHealthMaleAdults from "../locales/hi/pages/games/health-male/adults.json";

import hiHealthFemaleKids from "../locales/hi/pages/games/health-female/kids.json";
import hiHealthFemaleKidsCards from "../locales/hi/pages/cardcontent/health-female/kids.json";
import hiHealthFemaleTeens from "../locales/hi/pages/games/health-female/teens.json";
import hiHealthFemaleTeensCards from "../locales/hi/pages/cardcontent/health-female/teens.json";
import hiHealthFemaleYoungAdult from "../locales/hi/pages/games/health-female/young-adult.json";
import hiHealthFemaleAdults from "../locales/hi/pages/games/health-female/adults.json";

import hiEheKids from "../locales/hi/pages/games/ehe/kids.json";
import hiEheKidsCards from "../locales/hi/pages/cardcontent/ehe/kids.json";
import hiEheTeens from "../locales/hi/pages/games/ehe/teens.json";
import hiEheTeensCards from "../locales/hi/pages/cardcontent/ehe/teens.json";
import hiEheYoungAdult from "../locales/hi/pages/games/ehe/young-adult.json";
import hiEheAdults from "../locales/hi/pages/games/ehe/adults.json";

import hiCivicResponsibilityKids from "../locales/hi/pages/games/civic-responsibility/kids.json";
import hiCivicResponsibilityKidsCards from "../locales/hi/pages/cardcontent/civic-responsibility/kids.json";
import hiCivicResponsibilityTeens from "../locales/hi/pages/games/civic-responsibility/teens.json";
import hiCivicResponsibilityTeensCards from "../locales/hi/pages/cardcontent/civic-responsibility/teens.json";
import hiCivicResponsibilityYoungAdult from "../locales/hi/pages/games/civic-responsibility/young-adult.json";
import hiCivicResponsibilityAdults from "../locales/hi/pages/games/civic-responsibility/adults.json";

import hiSustainabilityKids from "../locales/hi/pages/games/sustainability/kids.json";
import hiSustainabilityKidsCards from "../locales/hi/pages/cardcontent/sustainability/kids.json";
import hiSustainabilityTeens from "../locales/hi/pages/games/sustainability/teens.json";
import hiSustainabilityTeensCards from "../locales/hi/pages/cardcontent/sustainability/teens.json";
import hiSustainabilityYoungAdult from "../locales/hi/pages/games/sustainability/young-adult.json";
import hiSustainabilityAdults from "../locales/hi/pages/games/sustainability/adults.json";

const LANGUAGE_STORAGE_KEY = "app_language";
const savedLanguage = typeof window !== "undefined"
  ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  : null;

const mergePageCards = (pageData, cardData) => ({
  ...pageData,
  cards: {
    ...(pageData?.cards || {}),
    ...(cardData?.cards || {}),
  },
});

const resources = {
  en: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(enFinancialLiteracyKids, enFinancialLiteracyKidsCards),
          teens: mergePageCards(enFinancialLiteracyTeens, enFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(enFinancialLiteracyYoungAdult, enFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            enFinancialLiteracyBusinessLivelihoodFinance,
            enFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            enFinancialLiteracyInsurancePension,
            enFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(enFinancialLiteracyAdults, enFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(enBrainHealthKids, enBrainHealthKidsCards),
          teens: mergePageCards(enBrainHealthTeens, enBrainHealthTeensCards),
          "young-adult": mergePageCards(enBrainHealthYoungAdult, enBrainHealthYoungAdultCards),
          adults: mergePageCards(enBrainHealthAdults, enBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(enUvlsKids, enUvlsKidsCards),
          teens: mergePageCards(enUvlsTeens, enUvlsTeensCards),
          "young-adult": enUvlsYoungAdult,
          adults: enUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(enDigitalCitizenshipKids, enDigitalCitizenshipKidsCards),
          teens: mergePageCards(enDigitalCitizenshipTeens, enDigitalCitizenshipTeensCards),
          "young-adult": enDigitalCitizenshipYoungAdult,
          adults: enDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(enMoralValuesKids, enMoralValuesKidsCards),
          teens: mergePageCards(enMoralValuesTeens, enMoralValuesTeensCards),
          "young-adult": enMoralValuesYoungAdult,
          adults: enMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(enAiForAllKids, enAiForAllKidsCards),
          teens: mergePageCards(enAiForAllTeens, enAiForAllTeensCards),
          "young-adult": enAiForAllYoungAdult,
          adults: enAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(enHealthMaleKids, enHealthMaleKidsCards),
          teens: mergePageCards(enHealthMaleTeens, enHealthMaleTeensCards),
          "young-adult": enHealthMaleYoungAdult,
          adults: enHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(enHealthFemaleKids, enHealthFemaleKidsCards),
          teens: mergePageCards(enHealthFemaleTeens, enHealthFemaleTeensCards),
          "young-adult": enHealthFemaleYoungAdult,
          adults: enHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(enEheKids, enEheKidsCards),
          teens: mergePageCards(enEheTeens, enEheTeensCards),
          "young-adult": enEheYoungAdult,
          adults: enEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(enCivicResponsibilityKids, enCivicResponsibilityKidsCards),
          teens: mergePageCards(enCivicResponsibilityTeens, enCivicResponsibilityTeensCards),
          "young-adult": enCivicResponsibilityYoungAdult,
          adults: enCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(enSustainabilityKids, enSustainabilityKidsCards),
          teens: mergePageCards(enSustainabilityTeens, enSustainabilityTeensCards),
          "young-adult": enSustainabilityYoungAdult,
          adults: enSustainabilityAdults,
        },
      },
    },
    gamecontent: {
      "financial-literacy": {
        kids: enFinancialLiteracyKidsGameContent,
        teens: enFinancialLiteracyTeensGameContent,
        "young-adult": enFinancialLiteracyYoungAdultGameContent,
        adults: enFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: enBrainKidsGameContent,
      },
    },
  },
  hi: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(hiFinancialLiteracyKids, hiFinancialLiteracyKidsCards),
          teens: mergePageCards(hiFinancialLiteracyTeens, hiFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(hiFinancialLiteracyYoungAdult, hiFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            hiFinancialLiteracyBusinessLivelihoodFinance,
            hiFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            hiFinancialLiteracyInsurancePension,
            hiFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(hiFinancialLiteracyAdults, hiFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(hiBrainHealthKids, hiBrainHealthKidsCards),
          teens: mergePageCards(hiBrainHealthTeens, hiBrainHealthTeensCards),
          "young-adult": mergePageCards(hiBrainHealthYoungAdult, hiBrainHealthYoungAdultCards),
          adults: mergePageCards(hiBrainHealthAdults, hiBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(hiUvlsKids, hiUvlsKidsCards),
          teens: mergePageCards(hiUvlsTeens, hiUvlsTeensCards),
          "young-adult": hiUvlsYoungAdult,
          adults: hiUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(hiDigitalCitizenshipKids, hiDigitalCitizenshipKidsCards),
          teens: mergePageCards(hiDigitalCitizenshipTeens, hiDigitalCitizenshipTeensCards),
          "young-adult": hiDigitalCitizenshipYoungAdult,
          adults: hiDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(hiMoralValuesKids, hiMoralValuesKidsCards),
          teens: mergePageCards(hiMoralValuesTeens, hiMoralValuesTeensCards),
          "young-adult": hiMoralValuesYoungAdult,
          adults: hiMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(hiAiForAllKids, hiAiForAllKidsCards),
          teens: mergePageCards(hiAiForAllTeens, hiAiForAllTeensCards),
          "young-adult": hiAiForAllYoungAdult,
          adults: hiAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(hiHealthMaleKids, hiHealthMaleKidsCards),
          teens: mergePageCards(hiHealthMaleTeens, hiHealthMaleTeensCards),
          "young-adult": hiHealthMaleYoungAdult,
          adults: hiHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(hiHealthFemaleKids, hiHealthFemaleKidsCards),
          teens: mergePageCards(hiHealthFemaleTeens, hiHealthFemaleTeensCards),
          "young-adult": hiHealthFemaleYoungAdult,
          adults: hiHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(hiEheKids, hiEheKidsCards),
          teens: mergePageCards(hiEheTeens, hiEheTeensCards),
          "young-adult": hiEheYoungAdult,
          adults: hiEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(hiCivicResponsibilityKids, hiCivicResponsibilityKidsCards),
          teens: mergePageCards(hiCivicResponsibilityTeens, hiCivicResponsibilityTeensCards),
          "young-adult": hiCivicResponsibilityYoungAdult,
          adults: hiCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(hiSustainabilityKids, hiSustainabilityKidsCards),
          teens: mergePageCards(hiSustainabilityTeens, hiSustainabilityTeensCards),
          "young-adult": hiSustainabilityYoungAdult,
          adults: hiSustainabilityAdults,
        },
      },
    },
    gamecontent: {
      "financial-literacy": {
        kids: hiFinancialLiteracyKidsGameContent,
        teens: hiFinancialLiteracyTeensGameContent,
        "young-adult": hiFinancialLiteracyYoungAdultGameContent,
        adults: hiFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: hiBrainKidsGameContent,
      },
    },
  },
  bn: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(bnFinancialLiteracyKids, bnFinancialLiteracyKidsCards),
          teens: mergePageCards(bnFinancialLiteracyTeens, bnFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(bnFinancialLiteracyYoungAdult, bnFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            bnFinancialLiteracyBusinessLivelihoodFinance,
            bnFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            bnFinancialLiteracyInsurancePension,
            bnFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(bnFinancialLiteracyAdults, bnFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(bnBrainHealthKids, bnBrainHealthKidsCards),
          teens: mergePageCards(bnBrainHealthTeens, bnBrainHealthTeensCards),
          "young-adult": mergePageCards(bnBrainHealthYoungAdult, bnBrainHealthYoungAdultCards),
          adults: mergePageCards(bnBrainHealthAdults, bnBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(bnUvlsKids, bnUvlsKidsCards),
          teens: mergePageCards(bnUvlsTeens, bnUvlsTeensCards),
          "young-adult": bnUvlsYoungAdult,
          adults: bnUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(bnDigitalCitizenshipKids, bnDigitalCitizenshipKidsCards),
          teens: mergePageCards(bnDigitalCitizenshipTeens, bnDigitalCitizenshipTeensCards),
          "young-adult": bnDigitalCitizenshipYoungAdult,
          adults: bnDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(bnMoralValuesKids, bnMoralValuesKidsCards),
          teens: mergePageCards(bnMoralValuesTeens, bnMoralValuesTeensCards),
          "young-adult": bnMoralValuesYoungAdult,
          adults: bnMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(bnAiForAllKids, bnAiForAllKidsCards),
          teens: mergePageCards(bnAiForAllTeens, bnAiForAllTeensCards),
          "young-adult": bnAiForAllYoungAdult,
          adults: bnAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(bnHealthMaleKids, bnHealthMaleKidsCards),
          teens: mergePageCards(bnHealthMaleTeens, bnHealthMaleTeensCards),
          "young-adult": bnHealthMaleYoungAdult,
          adults: bnHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(bnHealthFemaleKids, bnHealthFemaleKidsCards),
          teens: mergePageCards(bnHealthFemaleTeens, bnHealthFemaleTeensCards),
          "young-adult": bnHealthFemaleYoungAdult,
          adults: bnHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(bnEheKids, bnEheKidsCards),
          teens: mergePageCards(bnEheTeens, bnEheTeensCards),
          "young-adult": bnEheYoungAdult,
          adults: bnEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(bnCivicResponsibilityKids, bnCivicResponsibilityKidsCards),
          teens: mergePageCards(bnCivicResponsibilityTeens, bnCivicResponsibilityTeensCards),
          "young-adult": bnCivicResponsibilityYoungAdult,
          adults: bnCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(bnSustainabilityKids, bnSustainabilityKidsCards),
          teens: mergePageCards(bnSustainabilityTeens, bnSustainabilityTeensCards),
          "young-adult": bnSustainabilityYoungAdult,
          adults: bnSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: bnFinancialLiteracyKidsGameContent,
        teens: bnFinancialLiteracyTeensGameContent,
        "young-adult": bnFinancialLiteracyYoungAdultGameContent,
        adults: bnFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: bnBrainKidsGameContent,
      },
    },
  },
  gu: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(guFinancialLiteracyKids, guFinancialLiteracyKidsCards),
          teens: mergePageCards(guFinancialLiteracyTeens, guFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(guFinancialLiteracyYoungAdult, guFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            guFinancialLiteracyBusinessLivelihoodFinance,
            guFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            guFinancialLiteracyInsurancePension,
            guFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(guFinancialLiteracyAdults, guFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(guBrainHealthKids, guBrainHealthKidsCards),
          teens: mergePageCards(guBrainHealthTeens, guBrainHealthTeensCards),
          "young-adult": mergePageCards(guBrainHealthYoungAdult, guBrainHealthYoungAdultCards),
          adults: mergePageCards(guBrainHealthAdults, guBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(guUvlsKids, guUvlsKidsCards),
          teens: mergePageCards(guUvlsTeens, guUvlsTeensCards),
          "young-adult": guUvlsYoungAdult,
          adults: guUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(guDigitalCitizenshipKids, guDigitalCitizenshipKidsCards),
          teens: mergePageCards(guDigitalCitizenshipTeens, guDigitalCitizenshipTeensCards),
          "young-adult": guDigitalCitizenshipYoungAdult,
          adults: guDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(guMoralValuesKids, guMoralValuesKidsCards),
          teens: mergePageCards(guMoralValuesTeens, guMoralValuesTeensCards),
          "young-adult": guMoralValuesYoungAdult,
          adults: guMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(guAiForAllKids, guAiForAllKidsCards),
          teens: mergePageCards(guAiForAllTeens, guAiForAllTeensCards),
          "young-adult": guAiForAllYoungAdult,
          adults: guAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(guHealthMaleKids, guHealthMaleKidsCards),
          teens: mergePageCards(guHealthMaleTeens, guHealthMaleTeensCards),
          "young-adult": guHealthMaleYoungAdult,
          adults: guHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(guHealthFemaleKids, guHealthFemaleKidsCards),
          teens: mergePageCards(guHealthFemaleTeens, guHealthFemaleTeensCards),
          "young-adult": guHealthFemaleYoungAdult,
          adults: guHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(guEheKids, guEheKidsCards),
          teens: mergePageCards(guEheTeens, guEheTeensCards),
          "young-adult": guEheYoungAdult,
          adults: guEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(guCivicResponsibilityKids, guCivicResponsibilityKidsCards),
          teens: mergePageCards(guCivicResponsibilityTeens, guCivicResponsibilityTeensCards),
          "young-adult": guCivicResponsibilityYoungAdult,
          adults: guCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(guSustainabilityKids, guSustainabilityKidsCards),
          teens: mergePageCards(guSustainabilityTeens, guSustainabilityTeensCards),
          "young-adult": guSustainabilityYoungAdult,
          adults: guSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: guFinancialLiteracyKidsGameContent,
        teens: guFinancialLiteracyTeensGameContent,
        "young-adult": guFinancialLiteracyYoungAdultGameContent,
        adults: guFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: guBrainKidsGameContent,
      },
    },
  },
  kn: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(knFinancialLiteracyKids, knFinancialLiteracyKidsCards),
          teens: mergePageCards(knFinancialLiteracyTeens, knFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(knFinancialLiteracyYoungAdult, knFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            knFinancialLiteracyBusinessLivelihoodFinance,
            knFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            knFinancialLiteracyInsurancePension,
            knFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(knFinancialLiteracyAdults, knFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(knBrainHealthKids, knBrainHealthKidsCards),
          teens: mergePageCards(knBrainHealthTeens, knBrainHealthTeensCards),
          "young-adult": mergePageCards(knBrainHealthYoungAdult, knBrainHealthYoungAdultCards),
          adults: mergePageCards(knBrainHealthAdults, knBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(knUvlsKids, knUvlsKidsCards),
          teens: mergePageCards(knUvlsTeens, knUvlsTeensCards),
          "young-adult": knUvlsYoungAdult,
          adults: knUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(knDigitalCitizenshipKids, knDigitalCitizenshipKidsCards),
          teens: mergePageCards(knDigitalCitizenshipTeens, knDigitalCitizenshipTeensCards),
          "young-adult": knDigitalCitizenshipYoungAdult,
          adults: knDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(knMoralValuesKids, knMoralValuesKidsCards),
          teens: mergePageCards(knMoralValuesTeens, knMoralValuesTeensCards),
          "young-adult": knMoralValuesYoungAdult,
          adults: knMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(knAiForAllKids, knAiForAllKidsCards),
          teens: mergePageCards(knAiForAllTeens, knAiForAllTeensCards),
          "young-adult": knAiForAllYoungAdult,
          adults: knAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(knHealthMaleKids, knHealthMaleKidsCards),
          teens: mergePageCards(knHealthMaleTeens, knHealthMaleTeensCards),
          "young-adult": knHealthMaleYoungAdult,
          adults: knHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(knHealthFemaleKids, knHealthFemaleKidsCards),
          teens: mergePageCards(knHealthFemaleTeens, knHealthFemaleTeensCards),
          "young-adult": knHealthFemaleYoungAdult,
          adults: knHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(knEheKids, knEheKidsCards),
          teens: mergePageCards(knEheTeens, knEheTeensCards),
          "young-adult": knEheYoungAdult,
          adults: knEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(knCivicResponsibilityKids, knCivicResponsibilityKidsCards),
          teens: mergePageCards(knCivicResponsibilityTeens, knCivicResponsibilityTeensCards),
          "young-adult": knCivicResponsibilityYoungAdult,
          adults: knCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(knSustainabilityKids, knSustainabilityKidsCards),
          teens: mergePageCards(knSustainabilityTeens, knSustainabilityTeensCards),
          "young-adult": knSustainabilityYoungAdult,
          adults: knSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: knFinancialLiteracyKidsGameContent,
        teens: knFinancialLiteracyTeensGameContent,
        "young-adult": knFinancialLiteracyYoungAdultGameContent,
        adults: knFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: knBrainKidsGameContent,
      },
    },
  },
  ml: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(mlFinancialLiteracyKids, mlFinancialLiteracyKidsCards),
          teens: mergePageCards(mlFinancialLiteracyTeens, mlFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(mlFinancialLiteracyYoungAdult, mlFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            mlFinancialLiteracyBusinessLivelihoodFinance,
            mlFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            mlFinancialLiteracyInsurancePension,
            mlFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(mlFinancialLiteracyAdults, mlFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(mlBrainHealthKids, mlBrainHealthKidsCards),
          teens: mergePageCards(mlBrainHealthTeens, mlBrainHealthTeensCards),
          "young-adult": mergePageCards(mlBrainHealthYoungAdult, mlBrainHealthYoungAdultCards),
          adults: mergePageCards(mlBrainHealthAdults, mlBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(mlUvlsKids, mlUvlsKidsCards),
          teens: mergePageCards(mlUvlsTeens, mlUvlsTeensCards),
          "young-adult": mlUvlsYoungAdult,
          adults: mlUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(mlDigitalCitizenshipKids, mlDigitalCitizenshipKidsCards),
          teens: mergePageCards(mlDigitalCitizenshipTeens, mlDigitalCitizenshipTeensCards),
          "young-adult": mlDigitalCitizenshipYoungAdult,
          adults: mlDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(mlMoralValuesKids, mlMoralValuesKidsCards),
          teens: mergePageCards(mlMoralValuesTeens, mlMoralValuesTeensCards),
          "young-adult": mlMoralValuesYoungAdult,
          adults: mlMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(mlAiForAllKids, mlAiForAllKidsCards),
          teens: mergePageCards(mlAiForAllTeens, mlAiForAllTeensCards),
          "young-adult": mlAiForAllYoungAdult,
          adults: mlAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(mlHealthMaleKids, mlHealthMaleKidsCards),
          teens: mergePageCards(mlHealthMaleTeens, mlHealthMaleTeensCards),
          "young-adult": mlHealthMaleYoungAdult,
          adults: mlHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(mlHealthFemaleKids, mlHealthFemaleKidsCards),
          teens: mergePageCards(mlHealthFemaleTeens, mlHealthFemaleTeensCards),
          "young-adult": mlHealthFemaleYoungAdult,
          adults: mlHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(mlEheKids, mlEheKidsCards),
          teens: mergePageCards(mlEheTeens, mlEheTeensCards),
          "young-adult": mlEheYoungAdult,
          adults: mlEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(mlCivicResponsibilityKids, mlCivicResponsibilityKidsCards),
          teens: mergePageCards(mlCivicResponsibilityTeens, mlCivicResponsibilityTeensCards),
          "young-adult": mlCivicResponsibilityYoungAdult,
          adults: mlCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(mlSustainabilityKids, mlSustainabilityKidsCards),
          teens: mergePageCards(mlSustainabilityTeens, mlSustainabilityTeensCards),
          "young-adult": mlSustainabilityYoungAdult,
          adults: mlSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: mlFinancialLiteracyKidsGameContent,
        teens: mlFinancialLiteracyTeensGameContent,
        "young-adult": mlFinancialLiteracyYoungAdultGameContent,
        adults: mlFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: mlBrainKidsGameContent,
      },
    },
  },
  mr: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(mrFinancialLiteracyKids, mrFinancialLiteracyKidsCards),
          teens: mergePageCards(mrFinancialLiteracyTeens, mrFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(mrFinancialLiteracyYoungAdult, mrFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            mrFinancialLiteracyBusinessLivelihoodFinance,
            mrFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            mrFinancialLiteracyInsurancePension,
            mrFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(mrFinancialLiteracyAdults, mrFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(mrBrainHealthKids, mrBrainHealthKidsCards),
          teens: mergePageCards(mrBrainHealthTeens, mrBrainHealthTeensCards),
          "young-adult": mergePageCards(mrBrainHealthYoungAdult, mrBrainHealthYoungAdultCards),
          adults: mergePageCards(mrBrainHealthAdults, mrBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(mrUvlsKids, mrUvlsKidsCards),
          teens: mergePageCards(mrUvlsTeens, mrUvlsTeensCards),
          "young-adult": mrUvlsYoungAdult,
          adults: mrUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(mrDigitalCitizenshipKids, mrDigitalCitizenshipKidsCards),
          teens: mergePageCards(mrDigitalCitizenshipTeens, mrDigitalCitizenshipTeensCards),
          "young-adult": mrDigitalCitizenshipYoungAdult,
          adults: mrDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(mrMoralValuesKids, mrMoralValuesKidsCards),
          teens: mergePageCards(mrMoralValuesTeens, mrMoralValuesTeensCards),
          "young-adult": mrMoralValuesYoungAdult,
          adults: mrMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(mrAiForAllKids, mrAiForAllKidsCards),
          teens: mergePageCards(mrAiForAllTeens, mrAiForAllTeensCards),
          "young-adult": mrAiForAllYoungAdult,
          adults: mrAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(mrHealthMaleKids, mrHealthMaleKidsCards),
          teens: mergePageCards(mrHealthMaleTeens, mrHealthMaleTeensCards),
          "young-adult": mrHealthMaleYoungAdult,
          adults: mrHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(mrHealthFemaleKids, mrHealthFemaleKidsCards),
          teens: mergePageCards(mrHealthFemaleTeens, mrHealthFemaleTeensCards),
          "young-adult": mrHealthFemaleYoungAdult,
          adults: mrHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(mrEheKids, mrEheKidsCards),
          teens: mergePageCards(mrEheTeens, mrEheTeensCards),
          "young-adult": mrEheYoungAdult,
          adults: mrEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(mrCivicResponsibilityKids, mrCivicResponsibilityKidsCards),
          teens: mergePageCards(mrCivicResponsibilityTeens, mrCivicResponsibilityTeensCards),
          "young-adult": mrCivicResponsibilityYoungAdult,
          adults: mrCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(mrSustainabilityKids, mrSustainabilityKidsCards),
          teens: mergePageCards(mrSustainabilityTeens, mrSustainabilityTeensCards),
          "young-adult": mrSustainabilityYoungAdult,
          adults: mrSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: mrFinancialLiteracyKidsGameContent,
        teens: mrFinancialLiteracyTeensGameContent,
        "young-adult": mrFinancialLiteracyYoungAdultGameContent,
        adults: mrFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: mrBrainKidsGameContent,
      },
    },
  },
  pa: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(paFinancialLiteracyKids, paFinancialLiteracyKidsCards),
          teens: mergePageCards(paFinancialLiteracyTeens, paFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(paFinancialLiteracyYoungAdult, paFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            paFinancialLiteracyBusinessLivelihoodFinance,
            paFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            paFinancialLiteracyInsurancePension,
            paFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(paFinancialLiteracyAdults, paFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(paBrainHealthKids, paBrainHealthKidsCards),
          teens: mergePageCards(paBrainHealthTeens, paBrainHealthTeensCards),
          "young-adult": mergePageCards(paBrainHealthYoungAdult, paBrainHealthYoungAdultCards),
          adults: mergePageCards(paBrainHealthAdults, paBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(paUvlsKids, paUvlsKidsCards),
          teens: mergePageCards(paUvlsTeens, paUvlsTeensCards),
          "young-adult": paUvlsYoungAdult,
          adults: paUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(paDigitalCitizenshipKids, paDigitalCitizenshipKidsCards),
          teens: mergePageCards(paDigitalCitizenshipTeens, paDigitalCitizenshipTeensCards),
          "young-adult": paDigitalCitizenshipYoungAdult,
          adults: paDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(paMoralValuesKids, paMoralValuesKidsCards),
          teens: mergePageCards(paMoralValuesTeens, paMoralValuesTeensCards),
          "young-adult": paMoralValuesYoungAdult,
          adults: paMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(paAiForAllKids, paAiForAllKidsCards),
          teens: mergePageCards(paAiForAllTeens, paAiForAllTeensCards),
          "young-adult": paAiForAllYoungAdult,
          adults: paAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(paHealthMaleKids, paHealthMaleKidsCards),
          teens: mergePageCards(paHealthMaleTeens, paHealthMaleTeensCards),
          "young-adult": paHealthMaleYoungAdult,
          adults: paHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(paHealthFemaleKids, paHealthFemaleKidsCards),
          teens: mergePageCards(paHealthFemaleTeens, paHealthFemaleTeensCards),
          "young-adult": paHealthFemaleYoungAdult,
          adults: paHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(paEheKids, paEheKidsCards),
          teens: mergePageCards(paEheTeens, paEheTeensCards),
          "young-adult": paEheYoungAdult,
          adults: paEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(paCivicResponsibilityKids, paCivicResponsibilityKidsCards),
          teens: mergePageCards(paCivicResponsibilityTeens, paCivicResponsibilityTeensCards),
          "young-adult": paCivicResponsibilityYoungAdult,
          adults: paCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(paSustainabilityKids, paSustainabilityKidsCards),
          teens: mergePageCards(paSustainabilityTeens, paSustainabilityTeensCards),
          "young-adult": paSustainabilityYoungAdult,
          adults: paSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: paFinancialLiteracyKidsGameContent,
        teens: paFinancialLiteracyTeensGameContent,
        "young-adult": paFinancialLiteracyYoungAdultGameContent,
        adults: paFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: paBrainKidsGameContent,
      },
    },
  },
  ta: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(taFinancialLiteracyKids, taFinancialLiteracyKidsCards),
          teens: mergePageCards(taFinancialLiteracyTeens, taFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(taFinancialLiteracyYoungAdult, taFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            taFinancialLiteracyBusinessLivelihoodFinance,
            taFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            taFinancialLiteracyInsurancePension,
            taFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(taFinancialLiteracyAdults, taFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(taBrainHealthKids, taBrainHealthKidsCards),
          teens: mergePageCards(taBrainHealthTeens, taBrainHealthTeensCards),
          "young-adult": mergePageCards(taBrainHealthYoungAdult, taBrainHealthYoungAdultCards),
          adults: mergePageCards(taBrainHealthAdults, taBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(taUvlsKids, taUvlsKidsCards),
          teens: mergePageCards(taUvlsTeens, taUvlsTeensCards),
          "young-adult": taUvlsYoungAdult,
          adults: taUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(taDigitalCitizenshipKids, taDigitalCitizenshipKidsCards),
          teens: mergePageCards(taDigitalCitizenshipTeens, taDigitalCitizenshipTeensCards),
          "young-adult": taDigitalCitizenshipYoungAdult,
          adults: taDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(taMoralValuesKids, taMoralValuesKidsCards),
          teens: mergePageCards(taMoralValuesTeens, taMoralValuesTeensCards),
          "young-adult": taMoralValuesYoungAdult,
          adults: taMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(taAiForAllKids, taAiForAllKidsCards),
          teens: mergePageCards(taAiForAllTeens, taAiForAllTeensCards),
          "young-adult": taAiForAllYoungAdult,
          adults: taAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(taHealthMaleKids, taHealthMaleKidsCards),
          teens: mergePageCards(taHealthMaleTeens, taHealthMaleTeensCards),
          "young-adult": taHealthMaleYoungAdult,
          adults: taHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(taHealthFemaleKids, taHealthFemaleKidsCards),
          teens: mergePageCards(taHealthFemaleTeens, taHealthFemaleTeensCards),
          "young-adult": taHealthFemaleYoungAdult,
          adults: taHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(taEheKids, taEheKidsCards),
          teens: mergePageCards(taEheTeens, taEheTeensCards),
          "young-adult": taEheYoungAdult,
          adults: taEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(taCivicResponsibilityKids, taCivicResponsibilityKidsCards),
          teens: mergePageCards(taCivicResponsibilityTeens, taCivicResponsibilityTeensCards),
          "young-adult": taCivicResponsibilityYoungAdult,
          adults: taCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(taSustainabilityKids, taSustainabilityKidsCards),
          teens: mergePageCards(taSustainabilityTeens, taSustainabilityTeensCards),
          "young-adult": taSustainabilityYoungAdult,
          adults: taSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: taFinancialLiteracyKidsGameContent,
        teens: taFinancialLiteracyTeensGameContent,
        "young-adult": taFinancialLiteracyYoungAdultGameContent,
        adults: taFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: taBrainKidsGameContent,
      },
    },
  },
  te: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(teFinancialLiteracyKids, teFinancialLiteracyKidsCards),
          teens: mergePageCards(teFinancialLiteracyTeens, teFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(teFinancialLiteracyYoungAdult, teFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            teFinancialLiteracyBusinessLivelihoodFinance,
            teFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            teFinancialLiteracyInsurancePension,
            teFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(teFinancialLiteracyAdults, teFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(teBrainHealthKids, teBrainHealthKidsCards),
          teens: mergePageCards(teBrainHealthTeens, teBrainHealthTeensCards),
          "young-adult": mergePageCards(teBrainHealthYoungAdult, teBrainHealthYoungAdultCards),
          adults: mergePageCards(teBrainHealthAdults, teBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(teUvlsKids, teUvlsKidsCards),
          teens: mergePageCards(teUvlsTeens, teUvlsTeensCards),
          "young-adult": teUvlsYoungAdult,
          adults: teUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(teDigitalCitizenshipKids, teDigitalCitizenshipKidsCards),
          teens: mergePageCards(teDigitalCitizenshipTeens, teDigitalCitizenshipTeensCards),
          "young-adult": teDigitalCitizenshipYoungAdult,
          adults: teDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(teMoralValuesKids, teMoralValuesKidsCards),
          teens: mergePageCards(teMoralValuesTeens, teMoralValuesTeensCards),
          "young-adult": teMoralValuesYoungAdult,
          adults: teMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(teAiForAllKids, teAiForAllKidsCards),
          teens: mergePageCards(teAiForAllTeens, teAiForAllTeensCards),
          "young-adult": teAiForAllYoungAdult,
          adults: teAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(teHealthMaleKids, teHealthMaleKidsCards),
          teens: mergePageCards(teHealthMaleTeens, teHealthMaleTeensCards),
          "young-adult": teHealthMaleYoungAdult,
          adults: teHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(teHealthFemaleKids, teHealthFemaleKidsCards),
          teens: mergePageCards(teHealthFemaleTeens, teHealthFemaleTeensCards),
          "young-adult": teHealthFemaleYoungAdult,
          adults: teHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(teEheKids, teEheKidsCards),
          teens: mergePageCards(teEheTeens, teEheTeensCards),
          "young-adult": teEheYoungAdult,
          adults: teEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(teCivicResponsibilityKids, teCivicResponsibilityKidsCards),
          teens: mergePageCards(teCivicResponsibilityTeens, teCivicResponsibilityTeensCards),
          "young-adult": teCivicResponsibilityYoungAdult,
          adults: teCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(teSustainabilityKids, teSustainabilityKidsCards),
          teens: mergePageCards(teSustainabilityTeens, teSustainabilityTeensCards),
          "young-adult": teSustainabilityYoungAdult,
          adults: teSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: teFinancialLiteracyKidsGameContent,
        teens: teFinancialLiteracyTeensGameContent,
        "young-adult": teFinancialLiteracyYoungAdultGameContent,
        adults: teFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: teBrainKidsGameContent,
      },
    },
  },
  ur: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(urFinancialLiteracyKids, urFinancialLiteracyKidsCards),
          teens: mergePageCards(urFinancialLiteracyTeens, urFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(urFinancialLiteracyYoungAdult, urFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            urFinancialLiteracyBusinessLivelihoodFinance,
            urFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            urFinancialLiteracyInsurancePension,
            urFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(urFinancialLiteracyAdults, urFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(urBrainHealthKids, urBrainHealthKidsCards),
          teens: mergePageCards(urBrainHealthTeens, urBrainHealthTeensCards),
          "young-adult": mergePageCards(urBrainHealthYoungAdult, urBrainHealthYoungAdultCards),
          adults: mergePageCards(urBrainHealthAdults, urBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(urUvlsKids, urUvlsKidsCards),
          teens: mergePageCards(urUvlsTeens, urUvlsTeensCards),
          "young-adult": urUvlsYoungAdult,
          adults: urUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(urDigitalCitizenshipKids, urDigitalCitizenshipKidsCards),
          teens: mergePageCards(urDigitalCitizenshipTeens, urDigitalCitizenshipTeensCards),
          "young-adult": urDigitalCitizenshipYoungAdult,
          adults: urDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(urMoralValuesKids, urMoralValuesKidsCards),
          teens: mergePageCards(urMoralValuesTeens, urMoralValuesTeensCards),
          "young-adult": urMoralValuesYoungAdult,
          adults: urMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(urAiForAllKids, urAiForAllKidsCards),
          teens: mergePageCards(urAiForAllTeens, urAiForAllTeensCards),
          "young-adult": urAiForAllYoungAdult,
          adults: urAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(urHealthMaleKids, urHealthMaleKidsCards),
          teens: mergePageCards(urHealthMaleTeens, urHealthMaleTeensCards),
          "young-adult": urHealthMaleYoungAdult,
          adults: urHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(urHealthFemaleKids, urHealthFemaleKidsCards),
          teens: mergePageCards(urHealthFemaleTeens, urHealthFemaleTeensCards),
          "young-adult": urHealthFemaleYoungAdult,
          adults: urHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(urEheKids, urEheKidsCards),
          teens: mergePageCards(urEheTeens, urEheTeensCards),
          "young-adult": urEheYoungAdult,
          adults: urEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(urCivicResponsibilityKids, urCivicResponsibilityKidsCards),
          teens: mergePageCards(urCivicResponsibilityTeens, urCivicResponsibilityTeensCards),
          "young-adult": urCivicResponsibilityYoungAdult,
          adults: urCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(urSustainabilityKids, urSustainabilityKidsCards),
          teens: mergePageCards(urSustainabilityTeens, urSustainabilityTeensCards),
          "young-adult": urSustainabilityYoungAdult,
          adults: urSustainabilityAdults,
        },
      },
        },
    gamecontent: {
      "financial-literacy": {
        kids: urFinancialLiteracyKidsGameContent,
        teens: urFinancialLiteracyTeensGameContent,
        "young-adult": urFinancialLiteracyYoungAdultGameContent,
        adults: urFinancialLiteracyAdultsGameContent,
      },
      "brain-health": {
        kids: urBrainKidsGameContent,
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "en",
  fallbackLng: "en",
  ns: ["pages", "gamecontent"],
  defaultNS: "pages",
  interpolation: {
    escapeValue: false,
  },
});

export { LANGUAGE_STORAGE_KEY };
export default i18n;


