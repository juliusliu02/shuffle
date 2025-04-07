import React from "react";

export type GlobalRange = {
  startOffset: number;
  endOffset: number;
};

const getGlobalOffset = (
  container: Node,
  targetNode: Node,
  localOffset: number,
) => {
  let total = 0;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let node;
  while ((node = walker.nextNode())) {
    if (node === targetNode) {
      return total + localOffset;
    } else if (node.nodeValue) {
      total += node.nodeValue.length;
    }
  }

  return -1;
};

export const useTextRange = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedTexts, setSelectedTexts] = React.useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = React.useState<Node[]>([]);
  const [selectedRanges, setSelectedRanges] = React.useState<GlobalRange[]>([]);

  const getOffsets = React.useCallback(() => {
    if (!containerRef.current) {
      throw new Error(
        "useRelativeTextSelectOffsets: root container ref not attached.",
      );
    }

    // reset upon change
    setSelectedTexts([]);
    setSelectedNodes([]);
    setSelectedRanges([]);

    const sel = window.getSelection();
    if (!sel) {
      return;
    }

    const { rangeCount } = sel;
    for (let i = 0; i < rangeCount; i++) {
      const range = sel.getRangeAt(i);
      // ignore empty selection
      if (range.collapsed) continue;

      // get offset relative to root container
      const startOffset = getGlobalOffset(
        containerRef.current,
        range.startContainer,
        range.startOffset,
      );
      const endOffset = getGlobalOffset(
        containerRef.current,
        range.endContainer,
        range.endOffset,
      );

      // error checking
      if (startOffset === -1 || endOffset === -1) continue;
      // update text and range
      setSelectedTexts((prev) => [...prev, range.toString()]);
      setSelectedRanges((prev) => [...prev, { startOffset, endOffset }]);
      setSelectedNodes((prev) => {
        const newArray = [...prev];
        if (!newArray.includes(range.startContainer))
          newArray.push(range.startContainer);
        if (!newArray.includes(range.endContainer))
          newArray.push(range.endContainer);
        return newArray;
      });
    }
  }, []);

  return {
    containerRef,
    selectedTexts,
    selectedNodes,
    selectedRanges,
    getOffsets,
  };
};
