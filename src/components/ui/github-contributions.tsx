"use client"

import { useEffect, useRef } from "react"
import type { Activity } from "@/components/ui/contribution-graph"
import styles from "../sections/about.module.css"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/contribution-graph"

export function GitHubContributions({
  contributions,
  githubProfileUrl,
}: {
  contributions: Activity[]
  githubProfileUrl: string
}) {
  const data = contributions
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [data])

  return (
    <ContributionGraph
      className="github-contributions"
      data={data}
      blockSize={10}
      blockMargin={3}
      blockRadius={0}
      fontSize={6}
    >
      <ContributionGraphCalendar
        className="github-calendar"
        title="GitHub Contributions"
        ref={scrollRef}
      >
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>

      <div className="github-footer">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="github-text">
              {totalCount.toLocaleString("en")} contributions in the last year on{" "}
              <a
                className="github-link"
                href={githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </div>
    </ContributionGraph>
  )
}

export function GitHubContributionsFallback() {
  return (
    <div className="gh-fallback">
      <div className="gh-loading-dot"></div>
    </div>
  )
}
