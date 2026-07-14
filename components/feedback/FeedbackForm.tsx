import { createFeedbackSubmission } from "@/app/feedback/actions";
import TextareaWithBullet from "@/components/ui/TextareaWithBullet";

type FeedbackFormProps = {
  type: "Suggestion" | "Issue Report";
};

export default function FeedbackForm({ type }: FeedbackFormProps) {
  return (
    <form
      action={createFeedbackSubmission}
      className="grid gap-5 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="type" value={type} />
      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#1F2937]">Title</span>
        <input
          name="title"
          required
          className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#770FC2] focus:outline-none focus:ring-2 focus:ring-[#A05DD0]/20"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#1F2937]">Description</span>
        <TextareaWithBullet name="description" rows={6} required />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#1F2937]">Priority</span>
        <select
          name="priority"
          defaultValue="Medium"
          className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#770FC2] focus:outline-none focus:ring-2 focus:ring-[#A05DD0]/20"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>
      <button className="rounded-md bg-[#770FC2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6B1BBD]">
        Submit
      </button>
    </form>
  );
}
