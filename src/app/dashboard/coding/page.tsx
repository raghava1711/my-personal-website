import { CrudManager } from "@/components/CrudManager";
import { codingDifficulties, codingPlatforms } from "@/lib/constants";

export default function CodingPage() {
  return (
    <CrudManager
      title="Coding Tracker"
      description="Track solved problems by platform, difficulty, category, date solved, status, notes, and progress for interview preparation."
      endpoint="/api/coding"
      primaryKey="problem"
      secondaryKey="platform"
      fields={[
        { key: "platform", label: "Platform", type: "select", options: codingPlatforms },
        { key: "problem", label: "Problem", required: true },
        { key: "difficulty", label: "Difficulty", type: "select", options: codingDifficulties },
        { key: "category", label: "Category" },
        { key: "solvedAt", label: "Date Solved", type: "date" },
        { key: "status", label: "Status", type: "select", options: ["Solved", "Revisit", "In Progress"] },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      empty="No coding problems tracked yet. Add your first problem."
    />
  );
}
