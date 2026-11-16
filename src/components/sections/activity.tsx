import { getGitHubSnapshot } from "@/lib/github";
import { GitHubActivityLive } from "./activity-live";

export { GitHubActivitySkeleton } from "./activity-live";

export async function GitHubActivity() {
  const initialData = await getGitHubSnapshot();
  return <GitHubActivityLive initialData={initialData} />;
}
