import { CrudManager } from "@/components/CrudManager";
import { eventTypes } from "@/lib/constants";

export default function CalendarPage() {
  return (
    <CrudManager
      title="Calendar"
      description="Manage private events such as interviews, coding practice, learning sessions, deadlines, meetings, and personal reminders."
      endpoint="/api/calendar"
      primaryKey="title"
      secondaryKey="eventType"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "eventType", label: "Event Type", type: "select", options: eventTypes },
        { key: "eventDate", label: "Date", type: "date", required: true },
        { key: "eventTime", label: "Time" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      empty="No calendar events yet. Add your first event."
    />
  );
}
