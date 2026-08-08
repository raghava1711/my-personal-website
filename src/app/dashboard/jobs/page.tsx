import { CrudManager } from "@/components/CrudManager";
import { jobStatuses } from "@/lib/constants";

export default function JobsPage() {
  return (
    <CrudManager
      title="Job Applications"
      description="Track companies, roles, application dates, interview dates, locations, URLs, notes, statuses, and career pipeline progress in a Kanban-style view."
      endpoint="/api/jobs"
      primaryKey="company"
      secondaryKey="role"
      kanbanStatuses={[...jobStatuses]}
      fields={[
        { key: "company", label: "Company", required: true },
        { key: "role", label: "Job Role", required: true },
        { key: "applicationDate", label: "Application Date", type: "date" },
        { key: "status", label: "Status", type: "select", options: [...jobStatuses] },
        { key: "interviewDate", label: "Interview Date", type: "date" },
        { key: "location", label: "Location" },
        { key: "jobUrl", label: "Job URL", type: "url" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      empty="No job applications yet. Add your first application."
    />
  );
}
