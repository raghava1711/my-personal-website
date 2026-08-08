import { CrudManager } from "@/components/CrudManager";

export default function LearningPage() {
  return (
    <CrudManager
      title="Learning"
      description="Manage learning topics, progress, statuses, notes, and target dates across Java, Spring Boot, SQL, DSA, JavaScript, React, Git/GitHub, System Design, and AWS."
      endpoint="/api/learning"
      primaryKey="topic"
      secondaryKey="status"
      fields={[
        { key: "topic", label: "Topic", required: true },
        { key: "progress", label: "Progress", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Planned", "Learning", "In Progress", "Completed", "Paused"] },
        { key: "targetDate", label: "Target Date", type: "date" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      empty="No learning topics yet. Add your first topic."
    />
  );
}
