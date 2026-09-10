import React, { useEffect, useState } from "react";
import { Course } from "@/types";
import { listCertificateTemplates } from "@/api/certificates";

interface TemplateOption {
  id: string;
  filename: string;
  name?: string;
}

interface Props {
  templateId?: string | null;
  onChange: (
    templateId: string | null,
    template: Course["certificateTemplate"],
  ) => void;
}

function templateLabel(template: TemplateOption) {
  return template.name || template.filename || template.id;
}

const CourseCertificateTemplateSelect: React.FC<Props> = ({
  templateId,
  onChange,
}) => {
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await listCertificateTemplates();
        setTemplates(
          list.map((template) => ({
            id: template.id,
            filename: template.filename,
            name: template.filename,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load certificate templates",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Certificate template
      </label>
      <select
        value={templateId ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) {
            onChange(null, null);
            return;
          }
          const selected = templates.find((template) => template.id === value);
          onChange(
            value,
            selected
              ? {
                  id: selected.id,
                  filename: selected.filename,
                  name: templateLabel(selected),
                }
              : { id: value, filename: value, name: value },
          );
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white"
        disabled={loading}
      >
        <option value="">None</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {templateLabel(template)}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        None means this course will not issue a certificate.
      </p>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default CourseCertificateTemplateSelect;
