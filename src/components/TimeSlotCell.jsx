import { useDrop } from 'react-dnd';
import ScheduleBlock from './ScheduleBlock';
import { ROLES } from '../data/constants';

export default function TimeSlotCell({
  classroomId,
  timeslotId,
  entry,
  onDropCourse,
  onMoveEntry,
  onSelectEntry,
  onRemoveEntry,
  onToggleMaterial,
  selectedEntry,
  getTeacherName,
  getTeacherColor,
  role,
  conflictCell,
  isHighlighted,
}) {
  const [{ isOver, canDropHere }, dropRef] = useDrop({
    accept: ['COURSE', 'SCHEDULED'],
    canDrop: (item) => {
      if (role === ROLES.PARENT) return false;
      if (entry) return false;
      return true;
    },
    drop: (item) => {
      if (item.type === 'COURSE') {
        onDropCourse(item.courseId, classroomId, timeslotId);
      } else if (item.type === 'SCHEDULED') {
        onMoveEntry(item.entryId, classroomId, timeslotId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropHere: monitor.canDrop(),
    }),
  });

  const isConflictCell =
    conflictCell &&
    conflictCell.classroomId === classroomId &&
    conflictCell.timeslotId === timeslotId;

  let cellClass = 'timeslot-cell';
  if (isOver && canDropHere) cellClass += ' drop-over';
  if (canDropHere && !entry) cellClass += ' can-drop';
  if (isConflictCell) cellClass += ' conflict-flash';
  if (isHighlighted) cellClass += ' jump-highlight';

  return (
    <div
      ref={dropRef}
      className={cellClass}
      data-testid={`cell-${classroomId}-${timeslotId}`}
      data-classroom-id={classroomId}
      data-timeslot-id={timeslotId}
    >
      {entry ? (
        <ScheduleBlock
          entry={entry}
          getTeacherName={getTeacherName}
          getTeacherColor={getTeacherColor}
          isSelected={selectedEntry && selectedEntry.id === entry.id}
          onSelect={onSelectEntry}
          onRemove={onRemoveEntry}
          role={role}
          onToggleMaterial={onToggleMaterial}
        />
      ) : isOver && !canDropHere ? (
        <div className="drop-rejected">⛔</div>
      ) : null}
    </div>
  );
}
