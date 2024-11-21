export default async function searchJob(searchTerm) {
    const res = await fetch(
        `http://localhost:8080/jobPosts/search/${searchTerm}`,
        {
            cache: "no-store",
        }
    );
    return res.json();
}
