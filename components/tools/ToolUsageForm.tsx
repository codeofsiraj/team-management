type ToolUsageFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  entry?: {
    id: string;
    toolName: string;
    category: string;
    purpose: string;
    timeSpent: string;
    outcome: string | null;
    date: Date;
  };
};

const categories = ["AI Assistant", "Automation", "Research", "Design", "Development", "Other"];

function formatDateInput(date?: Date) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default function ToolUsageForm({ action, submitLabel, entry }: ToolUsageFormProps) {
  return (
    <form action={action} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <div className="grid gap-5">
        <label className="grid gap-2"><span className="text-sm font-medium text-slate-700">Tool Name</span><input name="toolName" defaultValue={entry?.toolName} required className="rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>
        <label className="grid gap-2"><span className="text-sm font-medium text-slate-700">Category</span><select name="category" defaultValue={entry?.category ?? "AI Assistant"} required className="rounded-md border border-slate-300 px-3 py-2 text-sm">{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label className="grid gap-2"><span className="text-sm font-medium text-slate-700">Purpose</span><textarea name="purpose" defaultValue={entry?.purpose ?? ""} rows={3} required className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>
        <label className="grid gap-2"><span className="text-sm font-medium text-slate-700">Time Spent</span><input name="timeSpent" defaultValue={entry?.timeSpent} required className="rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>
        <label className="grid gap-2"><span className="text-sm font-medium text-slate-700">Outcome</span><textarea name="outcome" defaultValue={entry?.outcome ?? ""} rows={3} className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>
        <label className="grid gap-2"><span className="text-sm font-medium text-slate-700">Date</span><input name="date" type="date" defaultValue={formatDateInput(entry?.date)} required className="rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>
      </div>
      <div className="mt-6 flex justify-end"><button type="submit" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white">{submitLabel}</button></div>
    </form>
  );
}
