type LearningFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  learning?: {
    id: string;
    title: string;
    description: string;
    category: string;
    referenceLink: string | null;
  };
};

const categories = [
  "Development",
  "Design",
  "Marketing",
  "Research",
  "AI Tools",
  "Other",
];

export default function LearningForm({
  action,
  submitLabel,
  learning,
}: LearningFormProps) {
  return (
    <form
      action={action}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      {learning ? <input type="hidden" name="id" value={learning.id} /> : null}
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            name="title"
            defaultValue={learning?.title}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Description
          </span>
          <textarea
            name="description"
            defaultValue={learning?.description ?? ""}
            rows={4}
            required
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            name="category"
            defaultValue={learning?.category ?? "Development"}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Reference Link
          </span>
          <input
            name="referenceLink"
            type="url"
            defaultValue={learning?.referenceLink ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
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
