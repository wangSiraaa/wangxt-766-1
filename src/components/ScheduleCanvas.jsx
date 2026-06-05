import { CLASSROOMS, TIMESLOTS } from '../data/constants';
import TimeSlotCell from './TimeSlotCell';

export default function ScheduleCanvas({
  schedule,
  onDropCourse,
  onMoveEntry,
  onSelectEntry,
  onRemoveEntry,
  onToggleMaterial,
  selectedEntry,
  getTeacherName,
  getTeacherColor,
  role,
  conflictAlert,
}) {
  const getEntryAt = (classroomId, timeslotId) =>
    schedule.find((s) => s.classroomId === classroomId && s.timeslotId === timeslotId) || null;

  return (
    <div className="schedule-canvas">
      <div className="canvas-header">
        <div className="corner-cell">时段 / 教室</div>
        {CLASSROOMS.map((room) => (
          <div key={room.id} className="header-cell" data-testid={`header-${room.id}`}>
            {room.name}
            <span className="room-capacity">（{room.capacity}人）</span>
          </div>
        ))}
      </div>
      <div className="canvas-body">
        {TIMESLOTS.map((ts) => (
          <div key={ts.id} className="canvas-row">
            <div className="timeslot-label">{ts.label}</div>
            {CLASSROOMS.map((room) => (
              <TimeSlotCell
                key={`${room.id}-${ts.id}`}
                classroomId={room.id}
                timeslotId={ts.id}
                entry={getEntryAt(room.id, ts.id)}
                onDropCourse={onDropCourse}
                onMoveEntry={onMoveEntry}
                onSelectEntry={onSelectEntry}
                onRemoveEntry={onRemoveEntry}
                onToggleMaterial={onToggleMaterial}
                selectedEntry={selectedEntry}
                getTeacherName={getTeacherName}
                getTeacherColor={getTeacherColor}
                role={role}
                conflictCell={conflictAlert}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
