import { useState } from "react";
import { Course } from "@/types";


export function useCourseEditor() {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'EDITOR'>('LIST');

  const openEditor = (course: Course) => {
    setActiveCourse(course);
    setViewMode('EDITOR');
  };

  const closeEditor = () => {
    setActiveCourse(null);
    setViewMode('LIST');
  };

  const updateCourse = <K extends keyof Course>(
    key: K,
    value: Course[K]
  ) => {
    setActiveCourse((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return {
    activeCourse,
    viewMode,
    openEditor,
    closeEditor,
    updateCourse,
    setActiveCourse,
  };
}
