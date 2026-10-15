import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";

async function safeCount(fn: () => Promise<number>): Promise<number> {
  try {
    return await fn();
  } catch (err) {
    console.error("[RecruitingOverview] count failed", err);
    return 0;
  }
}

export const RecruitingOverview = async () => {
  const payload = await getPayloadClient();
  const nowIso = new Date().toISOString();
  const weekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [openings, applicants, newThisWeek, inInterviews] = await Promise.all([
    safeCount(async () => {
      const result = await payload.count({
        collection: "job-listings",
        where: {
          and: [
            { _status: { equals: "published" } },
            {
              or: [
                { applicationDeadline: { exists: false } },
                { applicationDeadline: { greater_than_equal: nowIso } },
              ],
            },
          ],
        },
        overrideAccess: true,
      });
      return result.totalDocs ?? 0;
    }),
    safeCount(async () => {
      const result = await payload.count({ collection: "applications", overrideAccess: true });
      return result.totalDocs ?? 0;
    }),
    safeCount(async () => {
      const result = await payload.count({
        collection: "applications",
        where: { appliedAt: { greater_than_equal: weekAgoIso } },
        overrideAccess: true,
      });
      return result.totalDocs ?? 0;
    }),
    safeCount(async () => {
      const result = await payload.count({
        collection: "applications",
        where: { status: { equals: "interviewing" } },
        overrideAccess: true,
      });
      return result.totalDocs ?? 0;
    }),
  ]);

  const tiles = [
    {
      label: "Open roles",
      value: openings,
      href: "/admin/collections/job-listings?where[_status][equals]=published",
    },
    { label: "Total applicants", value: applicants, href: "/admin/collections/applications" },
    {
      label: "New this week",
      value: newThisWeek,
      href: `/admin/collections/applications?where[appliedAt][greater_than_equal]=${encodeURIComponent(
        weekAgoIso,
      )}`,
    },
    {
      label: "In interviews",
      value: inInterviews,
      href: "/admin/collections/applications?where[status][equals]=interviewing",
    },
  ];

  return (
    <section
      aria-label="Recruiting overview"
      style={{
        margin: "0 0 24px",
        padding: "20px",
        background: "linear-gradient(180deg, #0f1117 0%, #000 100%)",
        border: "1px solid rgba(255, 192, 0, 0.18)",
        borderRadius: "16px",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#FFC000",
          margin: "0 0 16px",
        }}
      >
        Recruiting overview
      </p>
      <div
        style={{
          display: "grid",
          gap: "12px",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            style={{
              display: "block",
              padding: "16px",
              background: "#000",
              border: "1px solid rgba(255, 192, 0, 0.12)",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#fff",
              transition: "border-color 120ms ease",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#B5B7BD",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {tile.label}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "32px",
                fontWeight: 800,
                color: "#FFC000",
                lineHeight: 1,
              }}
            >
              {tile.value}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
