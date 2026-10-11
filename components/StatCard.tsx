export default function StatCard({
  tint,
  label,
  tag,
  value,
  note,
}: {
  tint: 1 | 2 | 3 | 4;
  label: string;
  tag: string;
  value: string;
  note: string;
}) {
  return (
    <div className={`card card-tint-${tint} p-5 space-y-2`}>
      <div className="flex justify-between items-center text-xs font-bold opacity-75">
        <span>{label}</span>
        <span>{tag}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{note}</div>
    </div>
  );
}