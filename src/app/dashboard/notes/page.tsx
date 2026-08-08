import { CrudManager } from "@/components/CrudManager";
import { noteCategories } from "@/lib/constants";

export default function NotesPage() {
  return (
    <CrudManager
      title="Notes"
      description="Create, edit, delete, pin, categorize, search, and maintain private notes for learning, interview prep, ideas, and personal work."
      endpoint="/api/notes"
      primaryKey="title"
      secondaryKey="category"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "category", label: "Category", type: "select", options: noteCategories, required: true },
        { key: "content", label: "Content", type: "textarea", required: true },
        { key: "pinned", label: "Pin Note", type: "checkbox" },
      ]}
      empty="No notes yet. Capture your first note."
    />
  );
}
