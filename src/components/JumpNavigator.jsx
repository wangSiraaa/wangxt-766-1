import { useState } from 'react';
import { CLASSROOMS, TIMESLOTS } from '../data/constants';

export default function JumpNavigator({
  schedule,
  onJumpTo,
  onJumpToEntry,
  getTeacherName,
  getTeacherColor,
}) {
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedTimeslot, setSelectedTimeslot] = useState('');
  const [selectedEntry, setSelectedEntry] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleJump = () => {
    if (selectedClassroom && selectedTimeslot) {
      onJumpTo(selectedClassroom, selectedTimeslot);
    }
  };

  const handleEntryJump = () => {
    if (selectedEntry) {
      onJumpToEntry(selectedEntry);
      setSelectedEntry('');
    }
  };

  return (
    <div className="jump-navigator">
      <div className="jump-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="jump-icon">🎯</span>
        <span className="jump-title">定位跳转</span>
        <span className={`jump-toggle ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {isExpanded && (
        <div className="jump-body">
          <div className="jump-section">
            <h5 className="jump-section-title">按位置跳转</h5>
            <div className="jump-selectors">
              <select
                className="jump-select"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                data-testid="jump-classroom-select"
              >
                <option value="">选择教室</option>
                {CLASSROOMS.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <select
                className="jump-select"
                value={selectedTimeslot}
                onChange={(e) => setSelectedTimeslot(e.target.value)}
                data-testid="jump-timeslot-select"
              >
                <option value="">选择时段</option>
                {TIMESLOTS.map((ts) => (
                  <option key={ts.id} value={ts.id}>
                    {ts.label}
                  </option>
                ))}
              </select>
              <button
                className="jump-btn"
                onClick={handleJump}
                disabled={!selectedClassroom || !selectedTimeslot}
                data-testid="jump-position-btn"
              >
                跳转
              </button>
            </div>
          </div>

          <div className="jump-section">
            <h5 className="jump-section-title">按课程跳转</h5>
            <div className="jump-selectors">
              <select
                className="jump-select jump-select-wide"
                value={selectedEntry}
                onChange={(e) => setSelectedEntry(e.target.value)}
                data-testid="jump-entry-select"
              >
                <option value="">选择课程</option>
                {schedule.map((entry) => {
                  const room = CLASSROOMS.find((r) => r.id === entry.classroomId);
                  const ts = TIMESLOTS.find((t) => t.id === entry.timeslotId);
                  return (
                    <option key={entry.id} value={entry.id}>
                      {entry.name} - {room?.name || '未知'} - {ts?.label || '未知'}
                    </option>
                  );
                })}
              </select>
              <button
                className="jump-btn"
                onClick={handleEntryJump}
                disabled={!selectedEntry}
                data-testid="jump-entry-btn"
              >
                定位
              </button>
            </div>
          </div>

          {schedule.length > 0 && (
            <div className="jump-quick-list">
              <h5 className="jump-section-title">快速跳转</h5>
              <div className="quick-list-grid">
                {schedule.slice(0, 6).map((entry) => {
                  const room = CLASSROOMS.find((r) => r.id === entry.classroomId);
                  const ts = TIMESLOTS.find((t) => t.id === entry.timeslotId);
                  const teacherColor = getTeacherColor(entry.teacherId);
                  return (
                    <button
                      key={entry.id}
                      className="quick-jump-item"
                      onClick={() => onJumpToEntry(entry.id)}
                      style={{ borderLeftColor: teacherColor }}
                      data-testid={`quick-jump-${entry.id}`}
                    >
                      <span className="quick-jump-name">{entry.name}</span>
                      <span className="quick-jump-info">
                        {room?.name} · {ts?.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
