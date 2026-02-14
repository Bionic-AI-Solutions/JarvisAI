import './StatusCard.css';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

export default function StatusCard({ title, value, subtitle, status = 'info', icon }: StatusCardProps) {
  return (
    <div className={`status-card status-card-${status}`}>
      <div className="status-card-header">
        {icon && <div className="status-card-icon">{icon}</div>}
        <span className="status-card-title">{title}</span>
      </div>
      <div className="status-card-value">{value}</div>
      {subtitle && <div className="status-card-subtitle">{subtitle}</div>}
    </div>
  );
}
