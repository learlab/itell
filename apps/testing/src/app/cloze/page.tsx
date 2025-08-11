import { ClozeTest } from "@/components/cloze-test";

const sampleData = {
  text: "The sky's blue appearance is a result of Earth's atmosphere, which plays a crucial role in sustaining life. The discussion shifts to mental and physical __________, exemplified by George Hood's record-breaking _____, highlighting the role of mental toughness and _____-derived neurotrophic factor (BDNF). BDNF, a protein fostering brain health and __________, increases with exercise, especially those _________ mental effort, like planking. The narrative includes patients battling severe __________, underlining the potential of planking and its mental demands to elevate BDNF and improve ____ quality. Despite ongoing research, the link between grit, BDNF, and physical _________ remains compelling, advocating further study to harness these ________.",
  original_text:
    "The sky's blue appearance is a result of Earth's atmosphere, which plays a crucial role in sustaining life. The discussion shifts to mental and physical resilience, exemplified by George Hood's record-breaking plank, highlighting the role of mental toughness and Brain-derived neurotrophic factor (BDNF). BDNF, a protein fostering brain health and resilience, increases with exercise, especially those requiring mental effort, like planking. The narrative includes patients battling severe conditions, underlining the potential of planking and its mental demands to elevate BDNF and improve life quality. Despite ongoing research, the link between grit, BDNF, and physical exercises remains compelling, advocating further study to harness these benefits.",
  gaps: [
    {
      start: 153,
      end: 163,
      gapped_text: "resilience",
      original_word: null,
    },
    {
      start: 210,
      end: 215,
      gapped_text: "plank",
      original_word: null,
    },
    {
      start: 263,
      end: 268,
      gapped_text: "Brain",
      original_word: null,
    },
    {
      start: 348,
      end: 358,
      gapped_text: "resilience",
      original_word: null,
    },
    {
      start: 402,
      end: 411,
      gapped_text: "requiring",
      original_word: null,
    },
    {
      start: 490,
      end: 500,
      gapped_text: "conditions",
      original_word: null,
    },
    {
      start: 591,
      end: 595,
      gapped_text: "life",
      original_word: null,
    },
    {
      start: 673,
      end: 682,
      gapped_text: "exercises",
      original_word: null,
    },
    {
      start: 745,
      end: 753,
      gapped_text: "benefits",
      original_word: null,
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 pt-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            📝 Cloze Test
          </h1>
          <p className="text-gray-600">
            Fill in the blanks to complete the passage
          </p>
        </div>

        <ClozeTest data={sampleData} />
      </div>
    </main>
  );
}
