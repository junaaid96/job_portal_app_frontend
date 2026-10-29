// loading.js is a special Next.js file: it is shown automatically (via React Suspense)
// while a page in this folder is loading.
import Spinner from "@/app/components/Spinner";

export default function Loading() {
  return <Spinner fullScreen />;
}
