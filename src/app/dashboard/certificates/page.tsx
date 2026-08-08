import { CrudManager } from "@/components/CrudManager";

export default function CertificatesPage() {
  return (
    <CrudManager
      title="Certificates"
      description="Manage certificate cards, issuing organizations, dates, image links, and verification URLs shown on the public website."
      endpoint="/api/certificates"
      primaryKey="name"
      secondaryKey="issuer"
      fields={[
        { key: "name", label: "Certificate Name", required: true },
        { key: "issuer", label: "Issuing Organization", required: true },
        { key: "issuedAt", label: "Issue Date", type: "date" },
        { key: "imageUrl", label: "Certificate Image URL", type: "url" },
        { key: "certificateUrl", label: "View Certificate URL", type: "url" },
      ]}
      empty="No certificates yet. Add your first certificate."
    />
  );
}
