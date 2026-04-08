import { Pencil, Trash2 } from "lucide-react";
import { categoryConfig } from "../../config/categoryConfig";
import { renderRecordSummary } from "../../utils/formHelpers";

function CollectionList({
  category,
  records,
  loading,
  onEdit,
  onDelete
}) {
  const config = categoryConfig[category];

  return (
    <div className="mt-5 space-y-3">
      {loading && (
        <p className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-3 text-sm text-zinc-400">
          Loading {config.label.toLowerCase()}...
        </p>
      )}

      {!loading && records.length === 0 && (
        <p className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-3 text-sm text-zinc-400">
          {config.emptyText}
        </p>
      )}

      {records.map((record) => (
        <article
          key={record.id}
          className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-medium text-zinc-100">
                {record.title || record.role || record.name || record.degree || record.fullName}
              </h3>
              <div className="mt-2">{renderRecordSummary(category, record)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(record)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200 transition hover:border-zinc-600"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => onDelete(record.id)}
                className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-200 transition hover:border-red-500/60"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CollectionList;
