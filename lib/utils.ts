import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Highlight = {
  sentenceIndex: number;
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
};

export const getSelection = () => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode || selection.type !== "Range")
    return null;

  const words: string[] = [];
  const context = selection.anchorNode.textContent;

  const ranges: Highlight[] = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    const highlight = getHighlightRange(range);
    if (highlight) {
      words.push(range.toString());
      ranges.push(highlight);
    }
  }

  return {
    word: words.join(" ... "),
    context,
    ranges,
  };
};

const getHighlightRange = (range: Range): Highlight | null => {
  const sentenceElement = range.commonAncestorContainer.parentElement;
  if (!sentenceElement) return null;
  const paragraphElement = sentenceElement.parentElement;
  if (!paragraphElement || !paragraphElement.parentElement) return null;

  const sentenceIndex = Array.from(paragraphElement.children).indexOf(
    sentenceElement,
  );

  const paragraphIndex = Array.from(
    paragraphElement.parentElement.children,
  ).indexOf(paragraphElement);

  let { startOffset, endOffset } = range;
  if (startOffset > endOffset) {
    [startOffset, endOffset] = [endOffset, startOffset];
  }

  return {
    sentenceIndex,
    paragraphIndex,
    startOffset,
    endOffset,
  };
};
