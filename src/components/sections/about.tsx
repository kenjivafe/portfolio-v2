import Image from "next/image";
import { Suspense } from "react";
import { CheckCircle2, Volume2 } from "lucide-react";
import Reveal from "../ui/reveal";
import styles from "./about.module.css";
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/ui/github-contributions";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import LanyardStatus from "@/components/ui/lanyard-status";

const GITHUB_USERNAME = "kenjivafe";
const GITHUB_PROFILE_URL = "https://github.com/kenjivafe";

export default async function About() {
  const contributions = await getCachedContributions(GITHUB_USERNAME);

  return (
    <section className={styles["about-section"]} id="about">
      <Reveal className="row label-bar">
        <div className="s-label">About</div>
      </Reveal>
      <div className="row">
        <Reveal className={styles["about-left"]}>
          <div className={styles["profile-header"]}>
            <div className={styles["avatar-wrap"]}>
              <Image
                src="/avatar.png"
                width={160}
                height={160}
                alt="Kenji"
                className={styles["avatar-img"]}
                priority
              />
            </div>
            <div className={styles["profile-info"]}>
              <div className={styles["profile-meta"]}>
                software-engineer font-medium
              </div>
              <div className={styles["profile-name-row"]}>
                <h3 className={styles["profile-name"]}>Kenji Von Ashley</h3>
                <CheckCircle2
                  size={22}
                  className={styles["verified-icon"]}
                  fill="var(--accent)"
                  stroke="var(--white-b-color)"
                />
                <Volume2 size={18} className={styles["speaker-icon"]} />
              </div>
              <div className={styles["profile-tagline"]}>
                Creating with code. Small details matter.
              </div>
            </div>
          </div>

          <div className={styles["profile-grid-row"]}>
            <p className={styles["about-body"]}>
              Based in Kalinga, Philippines, I'm a software engineer dedicated to building high-performance backend systems and scalable SaaS architecture. I believe the most effective software is invisible — achieving seamless reliability through rigorous system design and pixel-perfect implementation.
            </p>
          </div>

          <div className={styles["profile-grid-row"]}>
            <LanyardStatus />
          </div>
        </Reveal>
        <Reveal delay="d2" className={styles["about-right"]}>
          <div className={styles["timeline-head"]}>Experience</div>
          <div className={styles["tl-item"]}>
            <div className={styles["tl-yr"]}>2024 — Now</div>
            <div>
              <div className={styles["tl-role"]}>Founder and Lead Developer</div>
              <div className={styles["tl-place"]}>Rigko</div>
            </div>
          </div>
          <div className={styles["tl-item"]}>
            <div className={styles["tl-yr"]}>2026 — Now</div>
            <div>
              <div className={styles["tl-role"]}>Backend and API Developer</div>
              <div className={styles["tl-place"]}>Grit Digital Performance</div>
            </div>
          </div>
          <div className={styles["tl-item"]}>
            <div className={styles["tl-yr"]}>2025 — Now</div>
            <div>
              <div className={styles["tl-role"]}>UI/UX and Frontend Developer</div>
              <div className={styles["tl-place"]}>RESQ-Link</div>
            </div>
          </div>
          <div className={styles["tl-item"]}>
            <div className={styles["tl-yr"]}>2025 — Now</div>
            <div>
              <div className={styles["tl-role"]}>Founder and Lead Developer</div>
              <div className={styles["tl-place"]}>Northernware</div>
            </div>
          </div>
          <div className={styles["tl-item"]}>
            <div className={styles["tl-yr"]}>2024 — Now</div>
            <div>
              <div className={styles["tl-role"]}>Apprentice</div>
              <div className={styles["tl-place"]}>Hackthenorth.ph</div>
            </div>
          </div>
          <div className={styles["tl-item"]}>
            <div className={styles["tl-yr"]}>2025</div>
            <div>
              <div className={styles["tl-role"]}>Apprentice and Junior Developer</div>
              <div className={styles["tl-place"]}>DICT Region II</div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className={`row ${styles["github-row"]}`}>
        <Reveal delay="d3" className={styles["github-wrap"]}>
          <Suspense fallback={<GitHubContributionsFallback />}>
            <GitHubContributions
              contributions={contributions}
              githubProfileUrl={GITHUB_PROFILE_URL}
            />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}
