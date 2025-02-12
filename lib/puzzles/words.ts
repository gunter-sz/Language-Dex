import Unistring from "@akahuku/unistring";

export function splitByGrapheme(word: string) {
  const graphemes: string[] = [];

  Unistring(word).forEach((grapheme) => {
    graphemes.push(grapheme.rawString);
  });

  return graphemes;
}
