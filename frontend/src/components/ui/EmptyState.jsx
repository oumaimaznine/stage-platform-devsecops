/**
 * État vide générique. Une page vide doit orienter vers une action,
 * pas seulement constater l'absence de contenu.
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 border border-dashed border-ink-800 rounded-xl">
      {icon && (
        <div className="text-ink-500 mb-4" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-white font-semibold">{title}</h3>
      {description && <p className="text-ink-500 text-sm mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
