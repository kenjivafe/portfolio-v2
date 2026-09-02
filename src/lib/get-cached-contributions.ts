import { unstable_cache } from "next/cache"

import type { Activity } from "@/components/ui/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

const fetchContributions = unstable_cache(
  async (username: string) => {
    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL || `https://github-contributions-api.jogruber.de`}/v4/${username}?y=last`
    )

    // Throwing keeps a bad response out of the cache, so the next render retries
    // instead of serving an empty year for the full revalidate window.
    if (!res.ok) {
      throw new Error(`GitHub contributions API responded with ${res.status}`)
    }

    const data = (await res.json()) as GitHubContributionsResponse
    return data.contributions ?? []
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

export async function getCachedContributions(username: string) {
  try {
    return await fetchContributions(username)
  } catch {
    return [] as Activity[]
  }
}
