import { CTest } from "./c-test";
import { volume } from "#content";
// Example data - replace with API response later

const sampleText = `
This is a sample text. More text here for testing.

This is the second paragraph.
`;

const volumeSummary = volume.summary

export default function CTestPage() {
  const paragraphs = splitParagraphs(volumeSummary);
  return (
    <div className="mx-auto max-w-4xl p-6">
      <CTest showLetter={2} paragraphs={paragraphs} />
    </div>
  );
}

const splitParagraphs = (text: string): string[] => {
  return text.split(/\n\s*\n/).filter(Boolean);
};
