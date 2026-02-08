export function applyInlineSuggestions(editor, suggestions) {
  const decorations = suggestions.map((s) => ({
    range: new window.monaco.Range(s.line, 1, s.line, 1),
    options: {
      isWholeLine: true,
      glyphMarginClassName: "suggestion-glyph",
      hoverMessage: {
        value: `💡 ${s.message}`,
      },
    },
  }));

  editor.deltaDecorations([], decorations);
}
