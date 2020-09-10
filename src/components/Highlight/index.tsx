import React from "react";

interface IHighlightProps {
  text: string;
  highlight: string;
}

export const Highlight = ({ text, highlight }: IHighlightProps) => {
  const lowerCaseHighlight = highlight.toLowerCase();
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, key) =>
        part.toLowerCase() === lowerCaseHighlight ? (
          <b key={key}>{part}</b>
        ) : (
          <span key={key}>{part}</span>
        )
      )}
    </span>
  );
};
