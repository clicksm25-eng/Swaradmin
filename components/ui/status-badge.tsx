interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "⏳ انتظار", className: "status-pending" },
  confirmed: { label: "✅ مؤكد", className: "status-confirmed" },
  completed: { label: "🏁 مكتمل", className: "status-completed" },
  cancelled: { label: "❌ ملغي", className: "status-cancelled" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "status-pending" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
