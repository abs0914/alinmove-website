"use client";

type Row = { id?: string | number; resumeFilename?: string };

export const ResumeLinkField = ({
  cellData,
  rowData,
}: {
  cellData?: unknown;
  rowData?: Row;
}) => {
  const filename =
    (typeof cellData === "string" && cellData) ||
    rowData?.resumeFilename ||
    "Resume";
  const id = rowData?.id;
  if (!id) {
    return (
      <span style={{ color: "#8a8c93", fontSize: "12px" }}>(no resume)</span>
    );
  }
  return (
    <a
      href={`/api/admin/applications/${id}/resume`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "9999px",
        background: "#000",
        border: "1px solid rgba(255, 192, 0, 0.28)",
        color: "#FFC000",
        fontSize: "12px",
        fontWeight: 600,
        textDecoration: "none",
        lineHeight: 1.4,
      }}
    >
      <span aria-hidden>↓</span> {filename}
    </a>
  );
};
