"use client";

import { useActionState, useState } from "react";
import { createJob } from "@/app/lib/api";
import { TECH_STACK_OPTIONS } from "@/app/lib/techStack";

/** A button that opens a modal form for creating a job post. */
export default function AddJobButton({ onJobAdded }) {
  const [isOpen, setIsOpen] = useState(false); // is the modal visible?

  // React 19 form Action: receives FormData, returns the next state.
  const [state, formAction, isPending] = useActionState(async (_prev, formData) => {
    const job = {
      postProfile: String(formData.get("postProfile")).trim(),
      postDescription: String(formData.get("postDescription")).trim(),
      requiredExperience: Number(formData.get("requiredExperience")), // the API expects a number
      postTechStack: formData.getAll("postTechStack").map(String), // all selected <option>s
      // no addedBy: the backend reads the username from the JWT
    };
    try {
      const saved = await createJob(job);
      onJobAdded(saved ?? job); // show it immediately in the parent's list
      setIsOpen(false); // close the modal
      return { error: null };
    } catch (err) {
      return { error: err.status === 401 ? "Please log in again." : "Failed to add job" };
    }
  }, { error: null });

  return (
    // <>...</> is a Fragment: groups elements without adding a DOM node
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700"
      >
        Add New Job
      </button>

      {isOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="add-job-title" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black/50">
          <div className="my-8 max-h-[90vh] w-2/3 overflow-y-auto rounded-lg bg-white p-6">
            <h2 id="add-job-title" className="mb-4 text-xl font-bold">Add New Job</h2>
            {state.error && <p role="alert" className="mb-4 text-red-600">{state.error}</p>}
            <form action={formAction}>
              <div className="mb-4">
                <label htmlFor="postProfile" className="mb-2 block">Job Title</label>
                <input id="postProfile" name="postProfile" type="text" required className="w-full rounded border p-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="postDescription" className="mb-2 block">Job Description</label>
                <textarea id="postDescription" name="postDescription" rows={4} required className="w-full rounded border p-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="requiredExperience" className="mb-2 block">Required Experience (years)</label>
                <input id="requiredExperience" name="requiredExperience" type="number" min={0} required className="w-full rounded border p-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="postTechStack" className="mb-2 block">Job Tech Stack</label>
                <select id="postTechStack" name="postTechStack" multiple required className="w-full rounded border p-2">
                  {TECH_STACK_OPTIONS.map((tech) => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple technologies</p>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded bg-gray-300 px-4 py-2">Cancel</button>
                <button type="submit" disabled={isPending} className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-60">
                  {isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
