import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const supportedLanguages = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
] as const;

const resources = {
  en: {
    translation: {
      app: {
        title: 'Scoreboard',
        description: 'Simple scoreboard to track the score of teams',
      },
      actions: {
        addTeam: 'Add team',
        cancel: 'Cancel',
        closeScoreEditor: 'Close score editor',
        confirm: 'Confirm',
        deleteTeam: 'Delete {{team}}',
        editScore: 'Edit score for {{team}}',
        incrementScore: 'Add 1 point to {{team}}',
        load: 'Load',
        save: 'Save',
      },
      fields: {
        scoreShort: 'Pts.',
        teamName: 'Team name',
      },
      language: {
        selectorLabel: 'Language',
      },
      links: {
        github: 'GitHub',
        githubAria: 'Open the GitHub repository',
        license: 'GPL-3.0',
        licenseAria: 'View the GNU GPL v3 license',
      },
      storage: {
        autoSave: 'AutoSave',
        fileName: 'scoreboard.txt',
        textFile: 'Text file',
      },
    },
  },
  it: {
    translation: {
      app: {
        title: 'Segnapunti',
        description: 'Segnapunti semplice per tenere traccia del punteggio delle squadre',
      },
      actions: {
        addTeam: 'Aggiungi squadra',
        cancel: 'Annulla',
        closeScoreEditor: 'Chiudi modifica punteggio',
        confirm: 'Conferma',
        deleteTeam: 'Elimina {{team}}',
        editScore: 'Modifica punteggio di {{team}}',
        incrementScore: 'Aggiungi 1 punto a {{team}}',
        load: 'Carica',
        save: 'Salva',
      },
      fields: {
        scoreShort: 'Punt.',
        teamName: 'Nome squadra',
      },
      language: {
        selectorLabel: 'Lingua',
      },
      links: {
        github: 'GitHub',
        githubAria: 'Apri il repository GitHub',
        license: 'GPL-3.0',
        licenseAria: 'Vedi la licenza GNU GPL v3',
      },
      storage: {
        autoSave: 'Salvataggio automatico',
        fileName: 'punteggi.txt',
        textFile: 'File di testo',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages.map(language => language.code),
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
