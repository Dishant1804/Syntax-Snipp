import { editor } from 'monaco-editor';


export const truncateDescription = (description: string , length : number): string => {
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

export const customTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'variable.parameter.function', foreground: 'b3b3b3' },
    { token: 'comment', foreground: '2e2e2e' },
    { token: 'punctuation.definition.comment', foreground: '2e2e2e' },
    { token: 'punctuation.definition.string', foreground: 'b3b3b3' },
    { token: 'punctuation.definition.variable', foreground: 'b3b3b3' },
    { token: 'punctuation.definition.parameters', foreground: 'b3b3b3' },
    { token: 'punctuation.definition.array', foreground: 'b3b3b3' },
    { token: 'none', foreground: 'b3b3b3' },
    { token: 'keyword.operator', foreground: 'b3b3b3' },
    { token: 'keyword', foreground: '6b6b6b' },
    { token: 'variable', foreground: '707070' },
    { token: 'entity.name.function', foreground: '606060' },
    { token: 'meta.require', foreground: '606060' },
    { token: 'support.function.any-method', foreground: '606060' },
    { token: 'support.class', foreground: '999999' },
    { token: 'entity.name.class', foreground: '999999' },
    { token: 'entity.name.type.class', foreground: '999999' },
    { token: 'meta.class', foreground: 'f5f5f5' },
    { token: 'keyword.other.special-method', foreground: '606060' },
    { token: 'storage', foreground: '6b6b6b' },
    { token: 'support.function', foreground: '808080' },
    { token: 'string', foreground: '8a8a8a' },
    { token: 'constant.other.symbol', foreground: '8a8a8a' },
    { token: 'entity.other.inherited-class', foreground: '8a8a8a' },
    { token: 'constant.numeric', foreground: '919191' },
    { token: 'constant', foreground: '919191' },
    { token: 'entity.name.tag', foreground: '707070' },
    { token: 'entity.other.attribute-name', foreground: '919191' },
    { token: 'entity.other.attribute-name.id', foreground: '606060' },
    { token: 'punctuation.definition.entity', foreground: '606060' },
    { token: 'meta.selector', foreground: '6b6b6b' },
    { token: 'markup.heading', foreground: '606060' },
    { token: 'punctuation.definition.heading', foreground: '606060' },
    { token: 'keyword.other.unit', foreground: '919191' },
    { token: 'markup.bold', foreground: '999999', fontStyle: 'bold' },
    { token: 'punctuation.definition.bold', foreground: '999999', fontStyle: 'bold' },
    { token: 'markup.italic', foreground: '6b6b6b', fontStyle: 'italic' },
    { token: 'punctuation.definition.italic', foreground: '6b6b6b', fontStyle: 'italic' },
    { token: 'markup.raw.inline', foreground: '8a8a8a' },
    { token: 'string.other.link', foreground: '707070' },
    { token: 'punctuation.definition.string.end.markdown', foreground: '707070' },
    { token: 'meta.link', foreground: '919191' },
    { token: 'markup.list', foreground: '707070' },
    { token: 'markup.quote', foreground: '919191' },
    { token: 'meta.separator', foreground: 'b3b3b3' },
    { token: 'markup.inserted', foreground: '8a8a8a' },
    { token: 'markup.deleted', foreground: '707070' },
    { token: 'markup.changed', foreground: '6b6b6b' },
    { token: 'constant.other.color', foreground: '808080' },
    { token: 'string.regexp', foreground: '808080' },
    { token: 'constant.character.escape', foreground: '808080' },
    { token: 'punctuation.section.embedded', foreground: '6b6b6b' },
    { token: 'variable.interpolation', foreground: '6b6b6b' },
    { token: 'invalid.illegal', foreground: 'f5f5f5' },
    { token: 'invalid.broken', foreground: '000000' },
    { token: 'invalid.deprecated', foreground: 'f5f5f5' },
    { token: 'invalid.unimplemented', foreground: 'f5f5f5' },
  ],
  colors: {
    "badge.background": "#1a1a1a",
    "badge.foreground": "#bfbfbf",
    "button.background": "#181818",
    "button.hoverBackground": "#1f1f1f",
    "dart.closingLabels": "#141414",
    "dropdown.background": "#000000",
    "dropdown.foreground": "#919191",
    'editor.background': '#1A1A1A',
    "editor.findMatchBackground": "#000000",
    "editor.findMatchBorder": "#808080",
    "editor.findMatchHighlightBackground": "#000000",
    "editor.findMatchHighlightBorder": "#3d3d3d",
    "editor.foldBackground": "#000000",
    "editor.foreground": "#b3b3b3",
    "editor.hoverHighlightBackground": "#0f0f0f",
    "editor.lineHighlightBackground": "#2a2a2a",
    "editor.selectionBackground": "#3d3d3d",
    "editorBracketMatch.background": "#000000",
    "editorBracketMatch.border": "#3d3d3d",
    "editorCursor.foreground": "#b3b3b3",
    "editorError.foreground": "#5c5c5c",
    "editorGroup.border": "#0a0a0a",
    "editorGroupHeader.tabsBackground": "#000000",
    "editorGroupHeader.tabsBorder": "#0a0a0a",
    "editorIndentGuide.activeBackground": "#3d3d3d",
    "editorIndentGuide.background": "#141414",
    "editorInfo.foreground": "#5c5c5c",
    "editorLightBulb.foreground": "#919191",
    "editorLineNumber.activeForeground": "#424242",
    "editorLineNumber.foreground": "#5d5d5d",
    "editorLink.activeForeground": "#bfbfbf",
    "editorOverviewRuler.border": "#0a0a0a",
    "editorRuler.foreground": "#141414",
    "editorSuggestWidget.foreground": "#606060",
    "editorSuggestWidget.highlightForeground": "#bfbfbf",
    "editorWarning.foreground": "#5c5c5c",
    "editorWhitespace.foreground": "#1a1a1a",
    "editorWidget.background": "#000000",
    "editorHoverWidget.statusBarBackground": "#000000",
    "focusBorder": "#000000",
    "icon.foreground": "#383838",
    "input.background": "#000000",
    "input.border": "#000000",
    "input.foreground": "#919191",
    "list.activeSelectionBackground": "#0a0a0a",
    "list.activeSelectionForeground": "#bfbfbf",
    "list.filterMatchBackground": "#1a1a1a",
    "list.filterMatchBorder": "#000000",
    "list.focusBackground": "#0a0a0a",
    "list.highlightForeground": "#999999",
    "list.hoverBackground": "#000000",
    "list.inactiveSelectionBackground": "#000000",
    "list.inactiveSelectionForeground": "#bfbfbf",
    "listFilterWidget.background": "#000000",
    "listFilterWidget.outline": "#3d3d3d",
    "menu.background": "#000000",
    "menu.foreground": "#919191",
    "menubar.selectionBackground": "#0a0a0a",
    "pickerGroup.foreground": "#9d9d9d",
    "sash.hoverBorder": "#0f0f0f",
    "scrollbar.shadow": "#000000",
    "scrollbarSlider.activeBackground": "#3d3d3d",
    "scrollbarSlider.background": "#3d3d3d",
    "scrollbarSlider.hoverBackground": "#3d3d3d",
    "sideBar.background": "#3d3d3d",
    "sideBar.border": "#0a0a0a",
    "sideBar.foreground": "#606060",
    "sideBarSectionHeader.background": "#000000",
    "sideBarSectionHeader.border": "#0a0a0a",
    "symbolIcon.arrayForeground": "#919191",
    "symbolIcon.booleanForeground": "#919191",
    "symbolIcon.classForeground": "#919191",
    "symbolIcon.colorForeground": "#919191",
    "symbolIcon.constantForeground": "#919191",
    "symbolIcon.constructorForeground": "#919191",
    "symbolIcon.enumeratorForeground": "#919191",
    "symbolIcon.enumeratorMemberForeground": "#919191",
    "symbolIcon.eventForeground": "#919191",
    "symbolIcon.fieldForeground": "#919191",
    "symbolIcon.fileForeground": "#919191",
    "symbolIcon.folderForeground": "#919191",
    "symbolIcon.functionForeground": "#919191",
    "symbolIcon.interfaceForeground": "#919191",
    "symbolIcon.keyForeground": "#919191",
    "symbolIcon.keywordForeground": "#919191",
    "symbolIcon.methodForeground": "#919191",
    "symbolIcon.moduleForeground": "#919191",
    "symbolIcon.namespaceForeground": "#919191",
    "symbolIcon.nullForeground": "#919191",
    "symbolIcon.numberForeground": "#919191",
    "symbolIcon.objectForeground": "#919191",
    "symbolIcon.operatorForeground": "#919191",
    "symbolIcon.packageForeground": "#919191",
    "symbolIcon.propertyForeground": "#919191",
    "symbolIcon.referenceForeground": "#919191",
    "symbolIcon.snippetForeground": "#919191",
    "symbolIcon.stringForeground": "#919191",
    "symbolIcon.structForeground": "#919191",
    "symbolIcon.textForeground": "#919191",
    "symbolIcon.typeParameterForeground": "#919191",
    "symbolIcon.unitForeground": "#919191",
    "symbolIcon.variableForeground": "#919191",
    "tab.activeForeground": "#bfbfbf",
    "tab.border": "#0a0a0a",
    "tab.inactiveBackground": "#000000",
    "tab.inactiveForeground": "#606060",
    "terminal.ansiBlack": "#141414",
    "terminal.ansiBlue": "#606060",
    "terminal.ansiBrightBlack": "#bfbfbf",
    "terminal.ansiBrightBlue": "#bfbfbf",
    "terminal.ansiBrightCyan": "#bfbfbf",
    "terminal.ansiBrightGreen": "#bfbfbf",
    "terminal.ansiBrightMagenta": "#bfbfbf",
    "terminal.ansiBrightRed": "#bfbfbf",
    "terminal.ansiBrightWhite": "#bfbfbf",
    "terminal.ansiBrightYellow": "#bfbfbf",
    "terminal.ansiCyan": "#606060",
    "terminal.ansiGreen": "#606060",
    "terminal.ansiMagenta": "#606060",
    "terminal.ansiRed": "#606060",
    "terminal.ansiWhite": "#bfbfbf",
    "terminal.ansiYellow": "#606060",
    "textLink.activeForeground": "#ffffff",
    "textLink.foreground": "#bfbfbf",
    "widget.shadow": "#000000",
  },
};