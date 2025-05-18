import { useEffect, useRef } from "react";

/**
 * A hook that automatically resizes a textarea based on its content
 * @param value The value of the textarea
 * @param rows The minimum number of rows to display
 * @returns A ref to be attached to the textarea element
 */
export function useTextareaResize(value: string, rows: number = 1) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the height based on scrollHeight
    const newHeight = Math.max(
      textarea.scrollHeight,
      // Ensure minimum height based on rows
      rows * parseInt(getComputedStyle(textarea).lineHeight)
    );

    textarea.style.height = `${newHeight}px`;
  }, [value, rows]);

  return textareaRef;
}
