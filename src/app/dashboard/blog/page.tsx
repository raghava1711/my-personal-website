import { CrudManager } from "@/components/CrudManager";

export default function BlogPage() {
  return (
    <CrudManager
      title="Blog"
      description="Create, edit, delete, and publish technical blog posts for Java, Spring Boot, SQL, backend development, Git/GitHub, DSA, interviews, and projects."
      endpoint="/api/blog"
      primaryKey="title"
      secondaryKey="category"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "category", label: "Category", type: "select", options: ["Java", "Spring Boot", "SQL", "Backend Development", "Git/GitHub", "DSA", "Interview Preparation", "Projects"], required: true },
        { key: "excerpt", label: "Short Description", type: "textarea", required: true },
        { key: "content", label: "Article Content", type: "textarea", required: true },
        { key: "thumbnailUrl", label: "Thumbnail URL", type: "url" },
        { key: "published", label: "Published", type: "checkbox" },
      ]}
      empty="No blog posts yet. Create your first technical article."
    />
  );
}
