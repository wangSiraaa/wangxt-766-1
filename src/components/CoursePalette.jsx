import CourseCard from './CourseCard';
import { ROLES } from '../data/constants';

export default function CoursePalette({
  courseTemplates,
  getTeacherName,
  getTeacherColor,
  role,
  onToggleMaterial,
}) {
  const canDrag = role !== ROLES.PARENT;

  return (
    <div className="course-palette">
      <h3 className="palette-title">📚 课程模板</h3>
      <p className="palette-hint">
        {canDrag ? '拖拽课程到右侧画布进行排课' : '家长仅可查看课程安排'}
      </p>
      <div className="palette-list">
        {courseTemplates.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            getTeacherName={getTeacherName}
            getTeacherColor={getTeacherColor}
            role={role}
            onToggleMaterial={onToggleMaterial}
          />
        ))}
      </div>
    </div>
  );
}
