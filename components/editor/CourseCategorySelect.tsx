import React, { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { CourseCategory } from "@/types";
import {
  createCourseCategory,
  getCourseCategories,
} from "@/services/courseApi";

interface Props {
  categoryId?: string | null;
  onChange: (categoryId: string | null, category: CourseCategory | null) => void;
}

const CourseCategorySelect: React.FC<Props> = ({ categoryId, onChange }) => {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const list = await getCourseCategories();
      setCategories(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const handleSelect = (value: string) => {
    if (value === "__add__") {
      setError(null);
      setNewName("");
      setModalOpen(true);
      return;
    }
    if (!value) {
      onChange(null, null);
      return;
    }
    const selected = categories.find((category) => category.id === value) ?? null;
    onChange(value, selected);
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      setError("Category name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const created = await createCourseCategory(name);
      setCategories((prev) =>
        [...prev.filter((item) => item.id !== created.id), created].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      onChange(created.id, created);
      setModalOpen(false);
      setNewName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create topic");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Topic
      </label>
      <select
        value={categoryId ?? ""}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white"
        disabled={loading}
      >
        <option value="">None</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
        <option value="__add__">Add topic…</option>
      </select>
      {loading && (
        <p className="text-xs text-gray-400 mt-1">Loading topics…</p>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Plus size={16} /> Add topic
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Safety"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={saving}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCategorySelect;
