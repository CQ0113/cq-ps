import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import ImageGallery from "./ImageGallery";
import RichTextDisplay from "./RichTextDisplay";

function ProjectFlipCard({ project }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasProjectLinks = Boolean(project.githubLink || project.liveLink);

  const galleryImages = useMemo(() => {
    if (Array.isArray(project.images) && project.images.length > 0) {
      return project.images;
    }
    if (project.image) {
      return [project.image];
    }
    return [];
  }, [project.image, project.images]);

  const handleToggleFlip = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      setIsFlipped((previous) => !previous);
    }
  };

  return (
    <article
      className={`project-flip-card ${isFlipped ? "is-flipped" : ""}`}
      onClick={handleToggleFlip}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="project-flip-inner">
        <div className="project-flip-face project-flip-front">
          <div className="project-face-glow" />
          {galleryImages.length > 0 ? (
            <div className="project-card-media mb-4">
              <ImageGallery images={galleryImages} className="project-card-gallery" />
            </div>
          ) : (
            <div className="project-card-media mb-4 flex items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/70 text-sm text-zinc-400">
              No image uploaded yet
            </div>
          )}

          <h3 className="text-xl font-bold text-zinc-100">{project.title}</h3>
    

          {Array.isArray(project.techStack) && project.techStack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, 6).map((tech, i) => (
                <span
                  key={i}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="project-flip-face project-flip-back">
          <div className="project-face-glow" />
          <h4 className="text-lg font-semibold text-zinc-100">{project.title}</h4>

          {project.description ? (
            <div className="mt-3 max-h-56 overflow-auto pr-1">
              <RichTextDisplay html={project.description} className="text-zinc-300" />
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">No description provided yet.</p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-glow inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-500/15 px-3 py-2 text-sm font-medium text-blue-200 transition hover:border-blue-300 hover:bg-blue-500/25"
              >
                GitHub
                <ExternalLink size={14} />
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-glow inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/25"
              >
                Live Site
                <ExternalLink size={14} />
              </a>
            )}
            
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectFlipCard;
