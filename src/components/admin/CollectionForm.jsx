import { Save, X, Trash2 } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { categoryConfig } from "../../config/categoryConfig";

function CollectionForm({
  category,
  isOpen,
  editingId,
  formValues,
  onClose,
  onInputChange,
  onProjectImageChange,
  onBackgroundMusicChange,
  onSubmit,
  isSaving,
  isImageUploading,
  selectedImageCount = 0,
  selectedMusicName = ""
}) {
  if (!isOpen) return null;

  const config = categoryConfig[category];
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [isDropActive, setIsDropActive] = useState(false);
  
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"]
    ]
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image"
  ];

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = Array.isArray(formValues.images)
      ? formValues.images.filter((_, idx) => idx !== indexToRemove)
      : [];
    onInputChange("images", updatedImages);
  };

  const handleDropUpload = (event) => {
    event.preventDefault();
    setIsDropActive(false);
    if (category !== "projects") {
      return;
    }
    onProjectImageChange?.(event.dataTransfer.files);
  };

  const handleReorderImages = (fromIndex, toIndex) => {
    if (!Array.isArray(formValues.images) || fromIndex === toIndex || fromIndex === null) {
      return;
    }

    const reordered = [...formValues.images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onInputChange("images", reordered);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 space-y-4 rounded-xl border border-zinc-700 bg-zinc-950/50 p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-100">
          {editingId ? "Edit Entry" : "Create Entry"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-zinc-700 p-1 text-zinc-300 transition hover:border-zinc-600"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {(category === "projects" || category === "personal") && (
          <label className="md:col-span-2 flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            {category === "projects" ? "Upload Project Images" : "Upload Profile Avatar"}
            <input
              type="file"
              accept="image/*"
              multiple={category === "projects"}
              onChange={(event) =>
                onProjectImageChange?.(event.target.files)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white"
            />
            {category === "projects" && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDropActive(true);
                }}
                onDragLeave={() => setIsDropActive(false)}
                onDrop={handleDropUpload}
                className={`rounded-lg border border-dashed px-4 py-3 text-[11px] transition ${
                  isDropActive
                    ? "border-blue-400 bg-blue-500/10 text-blue-200"
                    : "border-zinc-700 bg-zinc-900/40 text-zinc-400"
                }`}
              >
                Drag and drop images here to add them
              </div>
            )}
            {isImageUploading && (
              <span className="text-[11px] text-blue-300">Uploading image{category === "projects" ? "s" : ""}...</span>
            )}
            {category === "projects" && selectedImageCount > 0 && (
              <span className="text-[11px] text-emerald-300">
                {selectedImageCount} new image(s) queued for upload
              </span>
            )}
            {category === "projects" && Array.isArray(formValues.images) && formValues.images.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-zinc-300">{formValues.images.length} image(s)</p>
                  {formValues.images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onInputChange("images", [])}
                      className="text-[11px] text-red-400 transition hover:text-red-300"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {formValues.images.map((img, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDraggedImageIndex(idx)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        handleReorderImages(draggedImageIndex, idx);
                        setDraggedImageIndex(null);
                      }}
                      className="group relative h-24 cursor-grab overflow-hidden rounded-lg border border-zinc-700 active:cursor-grabbing"
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-zinc-900/70 opacity-0 transition group-hover:opacity-100"
                        title="Delete image"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (formValues.image || formValues.avatar) ? (
              <img
                src={formValues.image || formValues.avatar}
                alt={category === "projects" ? "Project preview" : "Avatar preview"}
                className="mt-2 h-36 w-full rounded-lg border border-zinc-700 object-cover"
              />
            ) : null}
          </label>
        )}

        {category === "personal" && (
          <label className="md:col-span-2 flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            Upload Background Music (MP3)
            <input
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={(event) => onBackgroundMusicChange?.(event.target.files)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white"
            />
            {selectedMusicName && (
              <span className="text-[11px] text-emerald-300">
                Selected track: {selectedMusicName}
              </span>
            )}
            {formValues.backgroundMusicUrl && (
              <audio controls preload="none" className="w-full">
                <source src={formValues.backgroundMusicUrl} type="audio/mpeg" />
                Your browser does not support audio preview.
              </audio>
            )}
          </label>
        )}

        {config.fields.map((field) => {
          if (category === "projects" && field.name === "images") {
            return null;
          }

          return (
          <label
            key={field.name}
            className={`flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400 ${
              field.type === "textarea" ? "md:col-span-2" : ""
            }`}
          >
            {field.label}
            {field.type === "textarea" && field.name === "description" ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden">
                <ReactQuill
                  value={formValues[field.name] || ""}
                  onChange={(value) => onInputChange(field.name, value)}
                  modules={quillModules}
                  formats={quillFormats}
                  theme="snow"
                  className="bg-zinc-900 text-zinc-100"
                  style={{
                    borderRadius: "0.5rem"
                  }}
                />
              </div>
            ) : field.type === "textarea" ? (
              <textarea
                value={formValues[field.name]}
                onChange={(event) =>
                  onInputChange(field.name, event.target.value)
                }
                required={field.required}
                rows={4}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-blue-500"
              />
            ) : field.type === "select" ? (
              <select
                value={formValues[field.name]}
                onChange={(event) =>
                  onInputChange(field.name, event.target.value)
                }
                required={field.required}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-blue-500"
              >
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formValues[field.name]}
                onChange={(event) =>
                  onInputChange(field.name, event.target.value)
                }
                required={field.required}
                placeholder={field.placeholder || ""}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-blue-500"
              />
            )}
          </label>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create"}
      </button>
    </form>
  );
}

export default CollectionForm;
