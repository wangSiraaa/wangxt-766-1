import { useDrag } from 'react-dnd';
import { ROLES } from '../data/constants';

export default function ScheduleBlock({
  entry,
  getTeacherName,
  getTeacherColor,
  isSelected,
  onSelect,
  onRemove,
  role,
  onToggleMaterial,
}) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'SCHEDULED',
    item: { type: 'SCHEDULED', entryId: entry.id, courseId: entry.courseId },
    canDrag: role !== ROLES.PARENT,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const teacherColor = getTeacherColor(entry.teacherId);
  const isDraggable = role !== ROLES.PARENT;
  const showMaterialWarning = !entry.materialsReady;

  return (
    <div
      ref={dragRef}
      className={`schedule-block ${isSelected ? 'selected' : ''} ${showMaterialWarning ? 'material-warning' : ''} ${entry.isTrial ? 'trial' : ''}`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        borderLeft: `4px solid ${teacherColor}`,
        cursor: isDraggable ? 'grab' : 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(entry);
      }}
      data-testid={`schedule-block-${entry.id}`}
      data-course-id={entry.courseId}
      data-teacher-id={entry.teacherId}
      data-is-trial={entry.isTrial ? 'true' : 'false'}
      data-materials-ready={entry.materialsReady ? 'true' : 'false'}
    >
      <div className="schedule-block-name">{entry.name}</div>
      <div className="schedule-block-teacher">{getTeacherName(entry.teacherId)}</div>
      <div className="schedule-block-meta">
        {entry.currentStudents}/{entry.maxStudents}人
        {entry.isTrial && <span className="trial-badge">试听</span>}
      </div>
      {showMaterialWarning && (
        <div className="material-warning-tag" title="材料未备齐">⚠️ 未备齐</div>
      )}
      {role === ROLES.ADMIN && (
        <div className="schedule-block-actions">
          <button
            className="material-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaterial(entry.id);
            }}
            title={entry.materialsReady ? '标记材料未备齐' : '标记材料已备齐'}
          >
            {entry.materialsReady ? '✅' : '📦'}
          </button>
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(entry.id);
            }}
            title="移除排课"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
