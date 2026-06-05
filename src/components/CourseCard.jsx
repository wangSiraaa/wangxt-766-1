import { useDrag } from 'react-dnd';
import { ROLES } from '../data/constants';

export default function CourseCard({ course, getTeacherName, getTeacherColor, role, onToggleMaterial }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'COURSE',
    item: { type: 'COURSE', courseId: course.id },
    canDrag: role !== ROLES.PARENT,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const teacherColor = getTeacherColor(course.teacherId);
  const isDraggable = role !== ROLES.PARENT;

  return (
    <div
      ref={dragRef}
      className="course-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderLeft: `4px solid ${teacherColor}`,
        cursor: isDraggable ? 'grab' : 'default',
        position: 'relative',
      }}
      data-testid={`course-card-${course.id}`}
    >
      <div className="course-card-name">{course.name}</div>
      <div className="course-card-teacher">{getTeacherName(course.teacherId)}</div>
      <div className="course-card-meta">
        最多{course.maxStudents}人
        {course.isTrial && <span className="trial-badge">试听</span>}
      </div>
      {role === ROLES.ADMIN && (
        <div
          className={`material-status ${course.materialsReady ? 'ready' : 'not-ready'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMaterial(course.id);
          }}
          title={course.materialsReady ? '材料已备齐，点击切换' : '材料未备齐，点击切换'}
        >
          {course.materialsReady ? '✅ 材料齐' : '⚠️ 材料缺'}
        </div>
      )}
    </div>
  );
}
