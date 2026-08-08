import { CrudManager } from "@/components/CrudManager";

export default function GoalsPage() {
  return (
    <CrudManager
      title="Goals"
      description="Create, edit, complete, delete, and track personal and career goals with progress and deadlines."
      endpoint="/api/goals"
      primaryKey="title"
      secondaryKey="status"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "progress", label: "Progress", type: "number" },
        { key: "deadline", label: "Deadline", type: "date" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Completed", "Paused", "Archived"] },
      ]}
      empty="No goals yet. Create your first goal."
    />
  );
}
