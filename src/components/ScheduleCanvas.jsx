import { useEffect, useRef } from 'react';
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
  jumpTarget,
  highlightTarget,
  onClearJumpTarget,
}) {
  const canvasRef = useRef(null);
  const cellRefs = useRef({});

  const getEntryAt = (classroomId, timeslotId) =>
    schedule.find((s) => s.classroomId === classroomId && s.timeslotId === timeslotId) || null;

  useEffect(() => {
    if (jumpTarget && canvasRef.current) {
      const cellKey = `${jumpTarget.classroomId}-${jumpTarget.timeslotId}`;
      const cell = cellRefs.current[cellKey];
      if (cell) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        const scrollLeft = cellRect.left - canvasRect.left + canvasRef.current.scrollLeft - 100;
        const scrollTop = cellRect.top - canvasRect.top + canvasRef.current.scrollTop - 50;
        canvasRef.current.scrollTo({
          left: scrollLeft,
          top: scrollTop,
          behavior: 'smooth',
        });
      }
      if (onClearJumpTarget) {
        setTimeout(() => onClearJumpTarget(), 100);
      }
    }
  }, [jumpTarget, onClearJumpTarget]);

  const setCellRef = (classroomId, timeslotId, element) => {
    const key = `${classroomId}-${timeslotId}`;
    cellRefs.current[key] = element;
  };

  const isHighlighted = (classroomId, timeslotId) => {
    if (!highlightTarget) return false;
    return highlightTarget.classroomId === classroomId && highlightTarget.timeslotId === timeslotId;
  };

  return (
    <div className="schedule-canvas" ref={canvasRef}>
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
              <div
                key={`${room.id}-${ts.id}`}
                ref={(el) => setCellRef(room.id, ts.id, el)}
                className={`cell-wrapper ${isHighlighted(room.id, ts.id) ? 'highlighted' : ''}`}
                data-testid={`cell-${room.id}-${ts.id}`}
              >
                <TimeSlotCell
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
                  isHighlighted={isHighlighted(room.id, ts.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
