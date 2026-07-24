export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-ink-800 rounded ${className}`} />;
}

/** Aperçu de carte d'offre pendant le chargement, pour éviter le saut de mise en page. */
export function SkeletonOfferCard() {
  return (
    <div className="bg-ink-900 border border-ink-800 p-5 rounded-xl">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full shrink-0" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <Skeleton className="h-3 w-40 mt-3" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>
    </div>
  );
}
