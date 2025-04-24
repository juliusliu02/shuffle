import type { ArticleWithNotesAndHighlights } from "@/lib/types";

const escapeQuotes = (s: string) => s.replaceAll('"', `""`);
const getTagList = (s: string) =>
  s
    .split(",")
    .map((s) => escapeQuotes(s))
    .join(" ");

export const generateAnkiCSV = (article: ArticleWithNotesAndHighlights) => {
  // header, reference: https://docs.ankiweb.net/importing/text-files.html
  let content = `#separator:Comma
#html:false
#columns:entry,note,type,context
#deck:${article.source}::${article.title}

`;

  for (const note of article.notes) {
    // escape quotes for all fields
    // use space to separate lists
    content = content.concat(
      `"${escapeQuotes(note.entry)}","${escapeQuotes(note.note ?? "")}","${getTagList(note.type ?? "")}","${escapeQuotes(note.context)}"\n`,
    );
  }

  return content;
};
