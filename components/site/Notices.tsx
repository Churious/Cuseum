export function MuseumNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="breathe-in max-w-[46ch] border-l border-line pl-5 text-sm italic text-ink-soft">
      {children}
    </p>
  );
}

export function LoadingRoom({ label }: { label: string }) {
  return (
    <p className="label-caps breathe-in py-24" role="status">
      {label}
    </p>
  );
}

export function EmptyState({
  title,
  line,
  action,
}: {
  title: string;
  line: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="max-w-[52ch] py-16">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-sm text-ink-soft">{line}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
