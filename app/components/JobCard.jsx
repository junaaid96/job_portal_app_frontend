"use client";

import Link from "next/link";
import * as motion from "motion/react-client"; // Motion (formerly Framer Motion) for animations

/** One job in the grid. Splitting UI into small components keeps each one easy to read. */
export default function JobCard({ job }) {
  return (
    // motion.div animates from `initial` to `animate` when it mounts
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      {/* dynamic route: /jobPosts/123 is handled by app/jobPosts/[id]/page.js */}
      <Link href={`/jobPosts/${job.postId}`} className="block p-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">{job.postProfile}</h2>
        <p className="mb-4 line-clamp-3 text-gray-600">{job.postDescription}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {(job.postTechStack ?? []).map((tech) => (
            <span key={tech} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">{tech}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Experience: {job.requiredExperience} years</span>
          <span>Posted by: {job.addedBy}</span>
        </div>
      </Link>
    </motion.div>
  );
}
