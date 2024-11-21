export default async function viewAllJobs() {
    const res = await fetch("http://localhost:8080/jobPosts", {
        cache: "no-store",
    });
    return res.json();
}
