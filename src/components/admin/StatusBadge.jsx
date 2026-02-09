const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/40',
    cutting: 'bg-orange-500/15 text-orange-200 border border-orange-500/40',
    stitching: 'bg-blue-500/15 text-blue-200 border border-blue-500/40',
    ready: 'bg-green-500/15 text-green-200 border border-green-500/40',
    approved: 'bg-green-500/15 text-green-200 border border-green-500/40',
    rejected: 'bg-red-500/15 text-red-200 border border-red-500/40',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
