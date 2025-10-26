export const countWords = (text: string): number => {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};

const segmenter = new Intl.Segmenter(
  // NOTE: これで undefined でいいのか...？
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
  undefined,
  { granularity: "grapheme" }
);
export function countCharacters(text: string): number {
  return [...segmenter.segment(text)].length;
}

export function getUnicode(text: string): string {
  return [...segmenter.segment(text)]
    .map((segment) => {
      const codePoint = segment.segment.codePointAt(0);
      if (codePoint === undefined) return "<UnknownCodePoint>";
      return `U+${codePoint.toString(16).toUpperCase()}`;
    })
    .join(" ");
}
