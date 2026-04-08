import { categoryConfig } from "../config/categoryConfig";

export function getInitialFormValues(category) {
  const values = {};
  categoryConfig[category].fields.forEach((field) => {
    if (field.type === "select") {
      values[field.name] = field.options?.[0] ?? "";
      return;
    }
    // Initialize images as empty array for projects
    if (category === "projects" && field.name === "images") {
      values[field.name] = [];
      return;
    }
    values[field.name] = "";
  });
  return values;
}

export function normalizePayload(category, values) {
  const payload = { ...values };
  if (category === "projects") {
    payload.techStack = payload.techStack
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
    // Convert images comma-separated string to array
    if (payload.images && typeof payload.images === "string") {
      payload.images = payload.images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }
  }
  return payload;
}

export function mapRecordToFormValues(category, record) {
  const values = getInitialFormValues(category);

  Object.keys(values).forEach((key) => {
    if (key === "techStack" && Array.isArray(record.techStack)) {
      values[key] = record.techStack.join(", ");
      return;
    }
    if (key === "images" && Array.isArray(record.images)) {
      // Keep images as array in form for delete functionality
      values[key] = record.images;
      return;
    }
    values[key] = record[key] ?? values[key];
  });

  return values;
}

export function renderRecordSummary(category, record) {
  switch (category) {
    case "projects":
      return (
        <div className="space-y-2">
          <p className="text-sm text-zinc-300">{record.description}</p>
          <div className="flex flex-wrap gap-2">
            {(record.techStack ?? []).map((tech) => (
              <span
                key={`${record.id}-${tech}`}
                className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-xs text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      );
    case "experience":
      return (
        <p className="text-sm text-zinc-300">
          {record.company} | {record.duration}
        </p>
      );
    case "skills":
      return (
        <p className="text-sm text-zinc-300">
          {record.category} | {record.name}
        </p>
      );
    case "academics":
      return (
        <p className="text-sm text-zinc-300">
          {record.institution} | {record.duration} | GPA: {record.gpa || "N/A"}
        </p>
      );
    case "personal":
      return (
        <div className="space-y-1 text-sm text-zinc-300">
          <p>{record.headline}</p>
          <p>{record.email}</p>
          <p>{record.location || "Location not set"}</p>
        </div>
      );
    default:
      return null;
  }
}
