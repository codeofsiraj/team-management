import TextareaWithBullet from "@/components/ui/TextareaWithBullet";

type DailyUpdateFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  update?: {
    id: string;
    date: Date;
    todaysTasks: string;
    blockers: string | null;
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
            className="w-full cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Today&apos;s Tasks</span>
          <TextareaWithBullet
            name="todaysTasks"
            defaultValue={update?.todaysTasks ?? ""}
            rows={4}
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Blockers</span>
          <TextareaWithBullet
            name="blockers"
            defaultValue={update?.blockers ?? ""}
            rows={3}
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
