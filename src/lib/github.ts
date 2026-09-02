import type { Activity } from "@/components/ui/contribution-graph"

export const GITHUB_USERNAME = "kenjivafe"
export const GITHUB_PROFILE_URL = "https://github.com/kenjivafe"

/**
 * The `y=last` window is a rolling 365 days, so it always contains every day of
 * the current calendar year to date — no second request is needed to total it.
 */
export function countContributionsThisYear(contributions: Activity[]) {
  const yearPrefix = `${new Date().getFullYear()}-`

  return contributions.reduce(
    (total, day) => (day.date.startsWith(yearPrefix) ? total + day.count : total),
    0
  )
}
