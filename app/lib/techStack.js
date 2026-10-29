// Shared constants and helpers for job tech stacks (plain JS, no React).

/** Options offered in the "Add job" form. */
export const TECH_STACK_OPTIONS = [
  "JavaScript", "Python", "Java", "React", "Node.js",
  "Angular", "Vue.js", "Spring Boot", "MongoDB", "PostgreSQL",
];

/** "React, Java , ,Go" -> ["React", "Java", "Go"] (trim and drop empty entries). */
export function parseTechStack(text) {
  return String(text ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
