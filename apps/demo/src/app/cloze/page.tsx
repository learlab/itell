import { ClozeTest } from "@/components/cloze-test";

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

        <ClozeTest />
      </div>
    </main>
  );
}
