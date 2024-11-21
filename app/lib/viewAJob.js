export default async function viewAJob(postId) {
    const res = await fetch(`http://localhost:8080/jobPost/${postId}`, {
        cache: "no-store",
    });
    console.log(res);
    return res.json();
}
