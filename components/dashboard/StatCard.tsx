type StatCardProps = {
  label: string;
  value: number;
  description: string;
};

export default function StatCard({ label, value, description }: StatCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </section>
  );
}
