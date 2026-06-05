export default function ConflictAlert({ alert, onDismiss }) {
  if (!alert) return null;

  return (
    <div className="conflict-alert" data-testid="conflict-alert">
      <div className="conflict-alert-icon">⛔</div>
      <div className="conflict-alert-content">
        <div className="conflict-alert-title">排课冲突</div>
        <div className="conflict-alert-message">{alert.message}</div>
      </div>
      <button className="conflict-alert-dismiss" onClick={onDismiss}>✕</button>
    </div>
  );
}
