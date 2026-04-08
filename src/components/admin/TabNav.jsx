import { categoryConfig, categoryOrder } from "../../config/categoryConfig";

function TabButton({ tabKey, isActive, onClick }) {
  const config = categoryConfig[tabKey];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
        isActive
          ? "border-blue-500/60 bg-blue-500/15 text-blue-200"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
      }`}
    >
      <Icon size={16} />
      {config.label}
    </button>
  );
}

function TabNav({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categoryOrder.map((category) => (
        <TabButton
          key={category}
          tabKey={category}
          isActive={activeCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
}

export default TabNav;
