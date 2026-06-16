type DailyUpdateFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  update?: {
    id: string;
    date: Date;
    workedOn: string;
    completedTasks: string | null;
    blockers: string | null;
    tomorrowPlan: string | null;
  };
};

function formatDateInput(date?: Date) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default function DailyUpdateForm({
  action,
  submitLabel,
  update,
}: DailyUpdateFormProps) {
  return (
    <form
      action={action}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      {update ? <input type="hidden" name="id" value={update.id} /> : null}
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Date</span>
          <input
            name="date"
            type="date"
            defaultValue={formatDateInput(update?.date)}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Worked On</span>
          <textarea
            name="workedOn"
            defaultValue={update?.workedOn ?? ""}
            rows={4}
            required
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Completed Tasks
          </span>
          <textarea
            name="completedTasks"
            defaultValue={update?.completedTasks ?? ""}
            rows={3}
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Blockers</span>
          <textarea
            name="blockers"
            defaultValue={update?.blockers ?? ""}
            rows={3}
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Tomorrow Plan
          </span>
          <textarea
            name="tomorrowPlan"
            defaultValue={update?.tomorrowPlan ?? ""}
            rows={3}
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
