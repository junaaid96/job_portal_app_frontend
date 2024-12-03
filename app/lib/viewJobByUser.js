export default async function viewJobByUser() {
    const res = await fetch("http://localhost:8080/jobPosts", {
        cache: "no-store",
    });
    return res.json();
}
