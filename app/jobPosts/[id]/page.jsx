"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { deleteJob, getJob, updateJob } from "@/app/lib/api";
import { parseTechStack } from "@/app/lib/techStack";
import { useAuth } from "@/app/hooks/useAuth";
import Spinner from "@/app/components/Spinner";

/** "/jobPosts/[id]": job details; the owner can edit or delete it. */
export default function JobPostDetails() {
  const { id } = useParams(); // the [id] segment of the URL
  const router = useRouter(); // programmatic navigation
  const { username } = useAuth();

  const [job, setJob] = useState(null); // the loaded job
  const [loadError, setLoadError] = useState(null); // error while loading
  const [actionError, setActionError] = useState(null); // error while saving/deleting
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition(); // pending flag for async actions

  // Load the job whenever the id changes.
  useEffect(() => {
    let ignore = false;
    getJob(id)
      .then((data) => !ignore && setJob(data))
      .catch((err) => !ignore && setLoadError(err.status === 404 ? "Job post not found" : "Failed to load job details"));
    return () => {
      ignore = true;
    };
  }, [id]);

  // Save handler: React 19 lets transitions wrap async functions.
  const handleSave = (formData) => {
    startTransition(async () => {
      try {
        await updateJob({
          postId: job.postId,
          postProfile: String(formData.get("postProfile")).trim(),
          postDescription: String(formData.get("postDescription")).trim(),
          requiredExperience: Number(formData.get("requiredExperience")),
          postTechStack: parseTechStack(formData.get("postTechStack")),
          // addedBy is set by the server from the JWT
        });
        const fresh = await getJob(id); // reload so we show exactly what the server stored
        setJob(fresh);
        setIsEditing(false);
        setActionError(null);
      } catch {
        setActionError("Failed to update job post");
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    startTransition(async () => {
      try {
        await deleteJob(id);
        router.push("/jobPosts"); // client-side navigation back to the list
      } catch {
        setActionError("Failed to delete job post");
      }
    });
  };

  // Early returns keep the main JSX simple.
  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div role="alert" className="border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
          <p>{loadError}</p>
        </div>
        <Link href="/jobPosts" className="mt-4 inline-block text-blue-600">← Back to jobs</Link>
      </div>
    );
  }
  if (!job) return <Spinner fullScreen />;

  const isOwner = username != null && username === job.addedBy; // only the author may edit

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/jobPosts" className="mb-4 inline-block text-blue-600">← Back to jobs</Link>
      <motion.div
        className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {actionError && <p role="alert" className="bg-red-100 p-3 text-red-700">{actionError}</p>}
        {/* AnimatePresence animates the element that is leaving (exit) before the new one enters */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <h1 className="mb-4 text-3xl font-bold text-gray-800">{job.postProfile}</h1>
              <p className="mb-6 text-gray-600">{job.postDescription}</p>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Required Experience</h3>
                  <p>{job.requiredExperience} years</p>
                </div>
                <div className="rounded bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Posted By</h3>
                  <p>{job.addedBy}</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-gray-700">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(job.postTechStack ?? []).map((tech) => (
                    <span key={tech} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">{tech}</span>
                  ))}
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-4">
                  <button onClick={() => setIsEditing(true)} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Edit Job Post</button>
                  <button onClick={handleDelete} disabled={isPending} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-60">Delete Job Post</button>
                </div>
              )}
            </motion.div>
          ) : (
            // Uncontrolled inputs with defaultValue: the browser keeps the value, FormData reads it on submit
            <motion.form key="edit" action={handleSave} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 p-6">
              <div>
                <label htmlFor="postProfile" className="mb-2 block text-sm font-medium text-gray-700">Job Title</label>
                <input id="postProfile" name="postProfile" defaultValue={job.postProfile} required className="w-full rounded border p-2" />
              </div>
              <div>
                <label htmlFor="postDescription" className="mb-2 block text-sm font-medium text-gray-700">Job Description</label>
                <textarea id="postDescription" name="postDescription" defaultValue={job.postDescription} rows={4} required className="w-full rounded border p-2" />
              </div>
              <div>
                <label htmlFor="requiredExperience" className="mb-2 block text-sm font-medium text-gray-700">Required Experience (years)</label>
                <input id="requiredExperience" name="requiredExperience" type="number" min={0} defaultValue={job.requiredExperience} required className="w-full rounded border p-2" />
              </div>
              <div>
                <label htmlFor="postTechStack" className="mb-2 block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
                <input id="postTechStack" name="postTechStack" defaultValue={(job.postTechStack ?? []).join(", ")} required className="w-full rounded border p-2" />
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={isPending} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-60">
                  {isPending ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
