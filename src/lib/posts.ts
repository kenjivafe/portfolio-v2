export interface Post {
  slug: string;
  cat: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
  content: Section[];
}

export interface Section {
  heading?: string;
  body: string;
}

export const POSTS: Post[] = [
  {
    slug: 'design-systems-for-developers',
    cat: 'Design',
    date: 'Mar 2025',
    title: 'Design Systems for Developers: Building UI that scales with your codebase',
    excerpt: 'How to build a consistent, maintainable design system from scratch — covering tokens, component APIs, and the handoff between design and code.',
    readTime: '6 min read',
    content: [
      {
        body: `Every project starts clean. You pick a font, settle on a primary color, and write your first button. Three months later you have seven slightly different button variants, four shades of gray that all mean "secondary text," and a design file that diverges more from the codebase with every sprint. Sound familiar?`,
      },
      {
        body: `A design system is the answer — but most tutorials approach it from the designer's side. This one is for developers: the people who actually write the CSS, define the component props, and live with the consequences.`,
      },
      {
        heading: 'Start with tokens, not components',
        body: `The instinct is to build components first. Resist it. A button built before you've defined your spacing scale will just be a button — not a piece of a coherent system. Design tokens are the atoms: named values for color, spacing, typography, and motion that everything else references.`,
      },
      {
        body: `In CSS, this means custom properties. In code, it might be a constants file or a theme object. The key insight is that a token like \`--color-text-secondary\` is far more durable than \`#606055\`. When you rebrand or support dark mode, you change the token — not every component that uses the color.`,
      },
      {
        body: `Define your token hierarchy before writing a single component. Color tokens should flow from primitive (the raw hex) to semantic (what it means). \`--gray-500\` is a primitive. \`--color-text-muted\` is semantic. Components reference semantic tokens only.`,
      },
      {
        heading: 'Component APIs are contracts',
        body: `When you write a component, you're defining an interface. The props are a contract with everyone who uses it. Design that contract deliberately. A \`Button\` with a \`variant\` prop that accepts \`"primary" | "ghost" | "danger"\` is far easier to consume — and constrain — than one that accepts arbitrary \`className\` overrides for everything.`,
      },
      {
        body: `The "escape hatch" problem is real: if you don't give people a safe way to deviate, they'll find an unsafe one. Build in a \`className\` prop for layout-level concerns (margin, width) but never expose it as a styling free-for-all. Document what's intentional and what isn't.`,
      },
      {
        body: `Composition beats configuration. A \`Card\` that accepts a \`header\` slot and a \`footer\` slot scales better than a \`Card\` with 14 boolean props. Think about the natural units of variation and model them explicitly.`,
      },
      {
        heading: 'The design-to-code handoff',
        body: `The most common failure mode isn't bad components — it's drift. A designer updates a color in Figma, a developer ships a slightly different shade, and six months later you have two parallel realities. The handoff process needs to be a loop, not a one-way street.`,
      },
      {
        body: `The most practical fix is to make tokens the canonical source of truth and share them across Figma and code. Tools like Tokens Studio (for Figma) can sync directly to a JSON file that feeds your CSS custom properties. When the designer changes a token, the developer pulls the change — no interpretation required.`,
      },
      {
        body: `If that tooling investment isn't feasible, at minimum establish a convention: every design decision has a named token, and the name is the same in Figma and in code. The discipline of naming is what prevents "that blue" from becoming five different blues.`,
      },
      {
        heading: 'Scaling without bureaucracy',
        body: `A design system should feel like infrastructure, not governance. The moment it feels like you need approval to add a component, you've over-engineered it. Keep the core small and opinionated; let the consuming codebases extend it for their specific needs.`,
      },
      {
        body: `Version it. Changelog it. When you make a breaking change to a component API, say so explicitly. The overhead of maintaining a \`CHANGELOG.md\` is tiny compared to debugging why three different teams' UIs broke after a library update.`,
      },
      {
        body: `The goal isn't consistency for its own sake — it's speed. A well-built design system means the tenth feature ships faster than the first, because the decisions are already made. That's the return on the investment.`,
      },
    ],
  },
  {
    slug: 'sub-100ms-latency',
    cat: 'Backend',
    date: 'Feb 2025',
    title: 'The quest for sub-100ms latency in distributed systems',
    excerpt: 'Practical techniques for optimizing network paths, database queries, and caching layers to achieve high-performance APIs.',
    readTime: '8 min read',
    content: [
      {
        body: `100ms is the threshold where users start to notice a delay. Below it, interactions feel instant. Above it, there's friction — small, almost imperceptible, but compounding across every click and keystroke until it erodes trust in your product.`,
      },
      {
        body: `Getting an API consistently below that number in a distributed system isn't a single optimization. It's a stack of decisions that each shave off a few milliseconds — and an understanding of where time actually goes.`,
      },
      {
        heading: 'Measure first, optimize second',
        body: `The most common mistake is optimizing by intuition. You add a cache because caches are fast, or rewrite a query because it feels slow, without knowing whether either is the actual bottleneck. Start with distributed tracing. Tools like OpenTelemetry with a Jaeger or Tempo backend will show you exactly where each request spends its time.`,
      },
      {
        body: `In most web APIs, the breakdown looks something like this: 2–5ms network RTT within a datacenter, 5–20ms database query time, 1–3ms serialization, and then a long tail of business logic that's hard to categorize. The database is almost always where the time goes. Start there.`,
      },
      {
        heading: 'Database query optimization',
        body: `The single highest-leverage optimization in most applications is adding a missing index. An unindexed \`WHERE\` clause on a table with a million rows will do a full sequential scan — O(n) instead of O(log n). Run \`EXPLAIN ANALYZE\` on your slow queries and look for "Seq Scan" on large tables.`,
      },
      {
        body: `N+1 queries are the second most common culprit. They happen when you fetch a list of records and then make a separate query for each one. ORMs hide this from you — which is why it's worth logging query counts in development and alarming when a single request issues more than, say, 10 queries.`,
      },
      {
        body: `Connection pooling matters more than most developers expect. Opening a new database connection takes 20–100ms on its own. A connection pool keeps connections warm and reuses them across requests. Tools like PgBouncer (for PostgreSQL) can be the difference between a p99 of 80ms and 400ms under load.`,
      },
      {
        heading: 'Caching with intention',
        body: `Caching is powerful and dangerous in equal measure. The danger isn't cache misses — it's stale data that silently corrupts your application's correctness. Before reaching for Redis, ask: what's the cost of serving stale data here? For user profile data, probably acceptable. For an account balance, definitely not.`,
      },
      {
        body: `When caching is appropriate, think in layers. Application-level caches (in-process, keyed by request parameters) are the fastest but consume memory and don't share across instances. Distributed caches like Redis add a network hop but are shared. CDN caches work for public, read-heavy responses.`,
      },
      {
        body: `Cache key design is underrated. A poorly scoped key leads to either too many misses (cache is useless) or too many false hits (stale data). Include every dimension of variation in the key: user ID if the data is user-specific, locale if it's translated, and a version hash if the schema can change.`,
      },
      {
        heading: 'Network path optimization',
        body: `Once your application logic is fast, the network itself becomes the constraint. An API server in Singapore serving users in São Paulo has a minimum latency of ~280ms from physics alone — the speed of light through fiber. Edge computing (Cloudflare Workers, Vercel Edge Functions) moves computation closer to users.`,
      },
      {
        body: `Keep-alive connections and HTTP/2 multiplexing reduce the overhead of connection setup on repeated requests. If you're still serving an API over HTTP/1.1 without keep-alive, you're leaving easy performance on the table.`,
      },
      {
        body: `The goal isn't always to hit sub-100ms on every request globally. It's to understand your latency budget, know where it goes, and make deliberate trade-offs. An API that's 120ms with correct data beats one that's 50ms with a cache invalidation bug.`,
      },
    ],
  },
  {
    slug: 'postgresql-to-specialized-datastores',
    cat: 'Database',
    date: 'Jan 2025',
    title: 'When PostgreSQL isn\'t enough: Moving to specialized datastores',
    excerpt: 'Analyzing when to supplement your relational database with Redis, ClickHouse, or ElasticSearch for specific workloads.',
    readTime: '7 min read',
    content: [
      {
        body: `PostgreSQL is one of the most capable databases ever built. It handles relational data, JSON documents, full-text search, time-series data, and geospatial queries — often well enough that you never need anything else. "Use Postgres for everything" is genuinely good advice for most projects.`,
      },
      {
        body: `But there are workloads where "well enough" isn't enough. When your analytics queries are competing with your OLTP workload for I/O. When your search latency is creeping up as your data grows. When you need sub-millisecond key lookups that don't justify a disk round-trip. This is when you start looking at specialized datastores — and when you need to be careful.`,
      },
      {
        heading: 'The case for Redis',
        body: `Redis is the easiest addition to justify. It's in-memory, so reads are fast (sub-millisecond for simple key lookups). It has a well-understood operational model and is supported by every cloud provider. The use cases are clear: session storage, rate limiting, real-time leaderboards, pub/sub messaging, and caching.`,
      },
      {
        body: `The trap is using Redis as a primary datastore. Its persistence model (RDB snapshots or AOF logs) is not equivalent to PostgreSQL's durability guarantees. If you need the data to survive a hard restart with zero loss, Redis requires careful configuration — and even then, it's optimized for performance, not durability.`,
      },
      {
        body: `Think of Redis as an acceleration layer on top of Postgres, not a replacement for it. The canonical pattern: write to Postgres first, then update Redis. Reads go to Redis when possible, fall back to Postgres on a miss. The source of truth never changes.`,
      },
      {
        heading: 'ClickHouse for analytics',
        body: `When your analytics queries — "show me all orders by region this quarter, grouped by SKU" — start taking seconds on a table with 50 million rows, that's not a query optimization problem. That's an architecture problem. OLTP databases like PostgreSQL store data row-by-row; analytics queries that scan many rows and aggregate columns are fundamentally inefficient on that layout.`,
      },
      {
        body: `ClickHouse is a columnar database designed for exactly this workload. It stores data column-by-column, which means an aggregation over a single column reads only that column from disk — not every field of every row. A query that takes 8 seconds in PostgreSQL might take 200ms in ClickHouse on the same data.`,
      },
      {
        body: `The cost is operational complexity and a very different data model. ClickHouse doesn't do transactions or row-level updates well. It's designed for append-heavy, read-heavy analytical workloads. The pattern is to replicate data from PostgreSQL into ClickHouse (via CDC tools like Debezium) and keep them in sync.`,
      },
      {
        heading: 'Elasticsearch for search',
        body: `PostgreSQL's full-text search is usable for simple cases — keyword matching with \`tsvector\` and \`tsquery\` works fine when your search index fits comfortably and your ranking needs are basic. When users expect Google-quality relevance ranking, faceted filtering, and sub-100ms search across millions of documents, you need a dedicated search engine.`,
      },
      {
        body: `Elasticsearch (or its open-source fork OpenSearch) is the standard answer. It uses an inverted index structure optimized for text retrieval, supports complex scoring functions, and handles aggregations for facets and filters efficiently. The operational complexity is real — Elasticsearch clusters require tuning and monitoring — but managed offerings from Elastic Cloud or AWS reduce the burden significantly.`,
      },
      {
        heading: 'When not to add another datastore',
        body: `The hidden cost of a polyglot persistence architecture is coordination. Every new datastore is another system that can go down, another data source that can get out of sync, another thing your team needs to understand and operate. Before adding one, ask: have I genuinely exhausted what Postgres can do?`,
      },
      {
        body: `Materialized views, partial indexes, table partitioning, and connection pooling solve a surprising number of performance problems without introducing new infrastructure. An index on the right column often beats adding Redis. A partitioned table often beats migrating to ClickHouse.`,
      },
      {
        body: `Introduce a new datastore when the data model or access pattern is fundamentally different from what a relational database handles well — not because it's faster in a benchmark. The operational cost of an extra system compounds over years; make sure the benefit does too.`,
      },
    ],
  },
  {
    slug: 'multi-tenant-saas',
    cat: 'SaaS',
    date: 'Dec 2024',
    title: 'Building Multi-tenant SaaS: Security, Isolation, and the Data Trap',
    excerpt: 'Lessons learned from implementing multi-tenancy: from row-level security to separate infrastructure silos.',
    readTime: '9 min read',
    content: [
      {
        body: `Multi-tenancy is one of those architectural decisions that seems straightforward until you're three years in and a customer asks why their data showed up in another customer's dashboard. That bug doesn't just cost you a customer — it costs you the trust of everyone who hears about it.`,
      },
      {
        body: `The stakes are high enough that the isolation strategy deserves serious thought before you write a line of code. Here are the approaches, the trade-offs, and the lessons that come from living with each one.`,
      },
      {
        heading: 'Three isolation models',
        body: `At the database level, multi-tenancy comes in three flavors. The first is separate databases: each tenant gets their own database instance. Maximum isolation, maximum cost. This is the right model for enterprise customers who contractually require it, or for workloads where a runaway tenant's queries could affect others.`,
      },
      {
        body: `The second is shared database, separate schemas: all tenants share a database server, but each gets their own schema (namespace). PostgreSQL's schema feature supports this well. It's a reasonable middle ground — cheaper than separate databases, with good logical isolation. The operational overhead of schema migrations becomes significant at scale, though.`,
      },
      {
        body: `The third, and most common, is shared database, shared schema with a \`tenant_id\` column on every table. Cheapest to operate, hardest to get right. Every query must filter by \`tenant_id\`. Miss one, and you have a data leak.`,
      },
      {
        heading: 'Row-level security: the right way to enforce isolation',
        body: `If you go with the shared-schema approach, don't rely on application-level \`WHERE tenant_id = ?\` clauses alone. They work until they don't — a new developer writes a query, forgets the filter, and the bug makes it to production.`,
      },
      {
        body: `PostgreSQL's Row-Level Security (RLS) lets you enforce tenant isolation at the database level. You define a policy: "for SELECT, only return rows where \`tenant_id\` matches the current session's tenant." The application sets the session variable when it establishes a connection; the database enforces the filter automatically, on every query, without trusting the application layer.`,
      },
      {
        body: `The setup requires discipline: every table needs \`tenant_id\`, every query context needs the session variable, and you need to verify RLS is enabled on every table (easy to miss when you add a new one). But the guarantee you get in return — that a missing WHERE clause can't leak data — is worth it.`,
      },
      {
        heading: 'The data trap: migrations at scale',
        body: `Here's the problem nobody warns you about. In a single-tenant application, a schema migration runs once, and if it's slow, you schedule it for a maintenance window. In a shared-schema multi-tenant application with 10,000 tenants and 500 million rows, that same migration might run for hours and lock your database.`,
      },
      {
        body: `Online schema change tools (like \`pg_repack\` or \`pglogical\`-based approaches) help with some operations, but they have limits. Adding a column with a default value, in older versions of PostgreSQL, required rewriting the entire table. PostgreSQL 11+ made this a metadata-only operation for constant defaults — one of many reasons to stay on a recent version.`,
      },
      {
        body: `The discipline that saves you here is: test every migration against production-scale data volumes before you run it in production. A migration that takes 2ms on a development dataset can take 20 minutes on 500 million rows. The difference matters enormously when you have SLAs.`,
      },
      {
        heading: 'Tenant-aware rate limiting and resource isolation',
        body: `Even with perfect data isolation, one tenant can affect others through resource consumption. A tenant running a heavy export job, or making API calls in a tight loop, consumes database connections, CPU, and I/O that all tenants share. Without controls, your largest or most aggressive tenant will degrade the experience for everyone else.`,
      },
      {
        body: `Implement per-tenant rate limiting at the API gateway level. Track resource usage — query time, rows scanned, API calls — per tenant. When a tenant approaches a limit, throttle them before they impact others. This is table stakes for a SaaS that serves more than a handful of customers.`,
      },
      {
        body: `The architecture of multi-tenant SaaS is ultimately about one thing: making guarantees you can keep. Isolation guarantees. Performance guarantees. Data guarantees. The complexity is in building systems that keep those guarantees even as the tenant count grows, the data volumes compound, and the team churns. Start with the strictest isolation model you can afford and relax it deliberately — never the other way around.`,
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
