import { editor } from 'monaco-editor';


export const truncateDescription = (description: string, length: number): string => {
  const words = description.split(' ');
  if (words.length > length) {
    return words.slice(0, length).join(' ') + '...';
  }
  return description;
};


export const truncateTitle = (title: string): string => {
  const words = title.split(' ');
  if (words.length > 18) {
    return words.slice(0, 18).join(' ') + '...';
  }
  return title;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year} UTC+05:30`;
};

export const customTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    "badge.background": "#007acc",
    "badge.foreground": "#ffffff",
    "button.background": "#007acc",
    "button.hoverBackground": "#005a9e",
    "editor.background": '#1a1a1a',
    "editor.foreground": '#d4d4d4',
    "editorCursor.foreground": "#d4d4d4",
    "editor.lineHighlightBackground": "#2a2a2a",
    "editor.selectionBackground": "#264f78",
    "editorIndentGuide.background": "#404040",
    "editorIndentGuide.activeBackground": "#d7d7d7",
    "editorError.foreground": "#f44747",
    "editorWarning.foreground": "#cca700",
    "editorInfo.foreground": "#3eaf7c",
    "editorLineNumber.foreground": "#858585",
    "editorLineNumber.activeForeground": "#ffffff",
    "editorRuler.foreground": "#444444",
    "list.hoverBackground": "#333333",
    "list.activeSelectionBackground": "#005a9e",
    "list.activeSelectionForeground": "#ffffff",
    "sideBar.background": "#252526",
    "sideBar.foreground": "#cccccc",
    "tab.activeBackground": "#1e1e1e",
    "tab.activeForeground": "#ffffff",
    "tab.border": "#0f0f0f",
    "terminal.ansiBlack": "#000000",
    "terminal.ansiRed": "#cd3131",
    "terminal.ansiGreen": "#0dbc79",
    "terminal.ansiYellow": "#e5e510",
    "terminal.ansiBlue": "#2472c8",
    "terminal.ansiMagenta": "#bc3fbc",
    "terminal.ansiCyan": "#11a6d8",
    "terminal.ansiWhite": "#e7e7e7",
    "terminal.ansiBrightBlack": "#666666",
    "terminal.ansiBrightRed": "#f14c4c",
    "terminal.ansiBrightGreen": "#23d18b",
    "terminal.ansiBrightYellow": "#f9f9f9",
    "terminal.ansiBrightBlue": "#3b8eea",
    "terminal.ansiBrightMagenta": "#d55fde",
    "terminal.ansiBrightCyan": "#4f99d9",
    "terminal.ansiBrightWhite": "#ffffff",
  },
};
