function StatusBadge({ status }) {
  const badgeClassMap = {
    New: "bg-primary-subtle text-primary-emphasis",
    "In Progress": "bg-warning-subtle text-warning-emphasis",
    "Follow-up": "bg-info-subtle text-info-emphasis",
    Converted: "bg-success-subtle text-success-emphasis",
    Closed: "bg-secondary-subtle text-secondary-emphasis",
  };

  return <span className={`badge ${badgeClassMap[status] || "bg-light text-dark"}`}>{status}</span>;
}

export default StatusBadge;

