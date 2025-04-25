import React from "react";

export type ViewType = "annotation" | "flashcard";

export type ViewContextType =
  | {
      view: ViewType;
      toggleView: () => void;
    }
  | undefined;

const ViewContext = React.createContext<ViewContextType>(undefined);

export default ViewContext;
