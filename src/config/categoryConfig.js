import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  UserCircle2,
  Wrench
} from "lucide-react";

export const categoryConfig = {
  projects: {
    label: "Projects",
    icon: FolderKanban,
    emptyText: "No projects yet. Add your first project entry.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true
      },
      {
        name: "techStack",
        label: "Tech Stack (comma-separated)",
        type: "text",
        required: true
      },
      {
        name: "githubLink",
        label: "GitHub Link (optional for ideathon projects)",
        type: "url",
        required: false
      },
      {
        name: "liveLink",
        label: "Live Link (optional for ideathon projects)",
        type: "url",
        required: false
      },
      {
        name: "images",
        label: "Images (auto-filled after upload)",
        type: "url",
        required: false
      }
    ]
  },
  experience: {
    label: "Experience",
    icon: Briefcase,
    emptyText: "No experience entries yet. Add your first role.",
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      {
        name: "duration",
        label: "Duration",
        type: "text",
        required: true,
        placeholder: "2026 (Ongoing)"
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true
      }
    ]
  },
  skills: {
    label: "Skills",
    icon: Wrench,
    emptyText: "No skills yet. Add your first skill.",
    fields: [
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Frontend", "Backend", "AI", "DevOps", "Tools", "Other"]
      },
      { name: "name", label: "Skill Name", type: "text", required: true }
    ]
  },
  academics: {
    label: "Academics",
    icon: GraduationCap,
    emptyText: "No academic entries yet. Add your first academic record.",
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true },
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true
      },
      { name: "duration", label: "Duration", type: "text", required: true },
      { name: "gpa", label: "GPA", type: "text", required: false }
    ]
  },
  personal: {
    label: "Personal Info",
    icon: UserCircle2,
    emptyText: "No personal profile yet. Add your profile details.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: false },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "github", label: "GitHub URL", type: "url", required: false },
      { name: "linkedin", label: "LinkedIn URL", type: "url", required: false },
      { name: "resumeLink", label: "Resume URL", type: "url", required: false },
      {
        name: "avatar",
        label: "Avatar URL (auto-filled after upload)",
        type: "url",
        required: false
      }
    ]
  }
};

export const categoryOrder = ["projects", "experience", "skills", "academics", "personal"];
