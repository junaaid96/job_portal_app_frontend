import viewAJob from "@/app/lib/viewAJob";

export const metadata = {
    title: "Job Portal App - Job Details",
    description: "Details of a job post",
};

export default async function JobPostDetails({ params }) {
    const { id } = await params;
    const jobPost = await viewAJob(id);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold">{jobPost.postProfile}</h1>
            <p className="my-6">{jobPost.postDescription}</p>
            <p>Required Experience: {jobPost.requiredExperience}</p>
            <p>Skills: {jobPost.postTechStack.join(", ")}</p>
        </div>
    );
}
