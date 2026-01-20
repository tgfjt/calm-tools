export type Locale = 'en' | 'ja';

export interface Translations {
  common: {
    home: string;
    backToHome: string;
  };
  nav: {
    breath: string;
    grounding: string;
  };
  index: {
    tagline: string;
    breathTitle: string;
    breathDesc: string;
    breathPatterns: string;
    groundingTitle: string;
    groundingDesc: string;
    groundingPatterns: string;
  };
  breath: {
    title: string;
    patterns: {
      '555': { name: string; desc: string };
      '478': { name: string; desc: string };
    };
    durations: {
      '60': string;
      '180': string;
      '300': string;
    };
    phases: {
      idle: string;
      inhale: string;
      hold: string;
      exhale: string;
      complete: string;
    };
    remaining: string;
    start: string;
    reset: string;
    history: string;
    noRecords: string;
    stats: string;
    completed: string;
    interrupted: string;
  };
  grounding: {
    title: string;
    subtitle: string;
    steps: {
      sight: {
        title: string;
        instruction: string;
        placeholderFirst: string;
        placeholderN: string;
      };
      touch: {
        title: string;
        instruction: string;
        placeholderFirst: string;
        placeholderN: string;
      };
      sound: {
        title: string;
        instruction: string;
        placeholderFirst: string;
        placeholderN: string;
      };
      smell: {
        title: string;
        instruction: string;
        placeholderFirst: string;
        placeholderN: string;
      };
      taste: {
        title: string;
        instruction: string;
        placeholderFirst: string;
        placeholderN: string;
      };
    };
    welcomeText: string;
    startBtn: string;
    historyBtn: string;
    cancelBtn: string;
    nextBtn: string;
    completeTitle: string;
    completeMessage: string;
    endBtn: string;
    backBtn: string;
    historyTitle: string;
    noHistory: string;
    noHistoryHint: string;
    confirmCancel: string;
    confirmDelete: string;
    deleteTitle: string;
    dateFormat: {
      year: string;
      month: string;
      day: string;
    };
  };
}
