"use client";
import React from "react";

import Flashcard from "@/components/flashcard";
import type { NoteWithHighlights } from "@/lib/types";

const testData: NoteWithHighlights = {
  id: 0,
  entry: "tempt",
  articleId: 0,
  type: "verb",
  context:
    "Sometimes, it can be tempting to vibe code, thinking you can fix it later.",
  note: "entice or try to entice (someone) to do something that they find attractive but know to be wrong or unwise.",
  highlights: [],
};

const Page = () => {
  return (
    <div className="h-full flex justify-center bg-stone-50">
      <div className=" relative top-1/4">
        <Flashcard note={testData} />
      </div>
    </div>
  );
};

export default Page;
