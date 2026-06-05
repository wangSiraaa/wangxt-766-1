import { CLASSROOMS, TIMESLOTS, TEACHERS, ROLES } from '../data/constants';

export default function DetailPanel({
  entry,
  getTeacherName,
  getTeacherColor,
  role,
  onToggleMaterial,
  onRemove,
  onClose,
}) {
  if (!entry) {
    return (
      <div className="detail-panel">
        <h3 className="detail-title">📋 课程详情</h3>
        <p className="detail-empty">点击课程块查看详情</p>
      </div>
    );
  }

  const room = CLASSROOMS.find((r) => r.id === entry.classroomId);
  const ts = TIMESLOTS.find((t) => t.id === entry.timeslotId);
  const teacher = TEACHERS.find((t) => t.id === entry.teacherId);
  const teacherColor = getTeacherColor(entry.teacherId);

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h3 className="detail-title">📋 课程详情</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="detail-body">
        <div className="detail-section">
          <h4 style={{ borderLeft: `4px solid ${teacherColor}`, paddingLeft: 8 }}>{entry.name}</h4>
          {entry.isTrial && <span className="trial-badge">试听课</span>}
        </div>

        <div className="detail-row">
          <span className="detail-label">教师</span>
          <span className="detail-value">{getTeacherName(entry.teacherId)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">教室</span>
          <span className="detail-value">{room ? room.name : '未知'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">时段</span>
          <span className="detail-value">{ts ? ts.label : '未知'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">学生</span>
          <span className="detail-value">{entry.currentStudents} / {entry.maxStudents}</span>
        </div>

        <div className="detail-section">
          <h4>材料清单</h4>
          <div className={`material-summary ${entry.materialsReady ? 'ready' : 'not-ready'}`}>
            {entry.materialsReady ? '✅ 材料已备齐' : '⚠️ 材料未备齐'}
          </div>
          <ul className="material-list">
            {entry.materials.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
          {role === ROLES.ADMIN && (
            <button
              className={`material-action-btn ${entry.materialsReady ? 'unready' : 'ready'}`}
              onClick={() => onToggleMaterial(entry.id)}
            >
              {entry.materialsReady ? '标记为未备齐' : '标记为已备齐'}
            </button>
          )}
        </div>

        {role !== ROLES.PARENT && (
          <button className="remove-action-btn" onClick={() => onRemove(entry.id)}>
            移除此排课
          </button>
        )}
      </div>
    </div>
  );
}
