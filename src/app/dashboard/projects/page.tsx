import { CrudManager } from "@/components/CrudManager";

export default function ProjectsPage() {
  return (
    <CrudManager
      title="Projects"
      description="Add, edit, delete, search, and publish project cards for the public portfolio. Sample data is clearly marked and replaceable."
      endpoint="/api/projects"
      primaryKey="title"
      secondaryKey="description"
      fields={[
        { key: "title", label: "Project Name", required: true },
        { key: "description", label: "Description", type: "textarea", required: true },
        { key: "technologies", label: "Technologies", type: "tags" },
        { key: "githubUrl", label: "GitHub URL", type: "url" },
        { key: "liveUrl", label: "Live Demo URL", type: "url" },
        { key: "imageUrl", label: "Image URL", type: "url" },
        { key: "featured", label: "Featured", type: "checkbox" },
      ]}
      empty="No projects yet. Create your first project."
    />
  );
}
