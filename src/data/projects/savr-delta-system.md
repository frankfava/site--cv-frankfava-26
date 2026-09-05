---
draft: false
featured: true
order: 2
title: "SAVR - Delta Ingestion System"
icon: ph:flow-arrow-duotone
role: "Senior Software Engineer"
type: "Customer Project"
summary: "Re-architecture of the ingestion pipeline at SAVR (Stockholm fintech). It had rewritten every row on every run; it now writes only the rows that changed."
startDate: "Jan 2026"
duration: 3
highlights:
    [
        "Designed and built as the closing project of the SAVR engagement.",
        "Kept the pull, cached it, and compared it against what was already stored.",
        "Only the writes that were a real change reach the database.",
    ]
caseStudy:
    audience: employer
    problem: Every run pulled the whole source and then overwrote the whole database, rewriting every row whether anything about it had changed or not. The run took about three hours.
    solution: Keep the pull, cache it, and compare it against what is already stored, so only the writes that are a real change are applied.
    build: Designed and built end-to-end as the closing project of my SAVR engagement - owned the architecture call, the implementation, and the cutover.
    outcome: The pipeline stopped rewriting rows nothing had changed about, on the platform's key data path.
skills: ["PHP", "LARAVEL", "POSTGRESQL", "API", "DOCKER", "GIT", "GITHUB", "CLAUDE"]
stillRunning:
    ownership: handed-over
    live: false
    status: "Handed over · 2026"
    figure: "Delta writes"
    figureNote: "instead of rewriting everything"
    body: "A pipeline that rewrote every row on every run, rebuilt to compare against what was stored and write only the rows that had changed."
    rank: 3
    title: "SAVR delta ingestion rebuild"
---
