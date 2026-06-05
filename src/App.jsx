import ScheduleCanvas from './components/ScheduleCanvas';
import CoursePalette from './components/CoursePalette';
import DetailPanel from './components/DetailPanel';
import ConflictAlert from './components/ConflictAlert';
import RoleSwitcher from './components/RoleSwitcher';
import { useScheduler } from './hooks/useScheduler';
import { ROLES } from './data/constants';

export default function App() {
  const {
    schedule,
    role,
    setRole,
    dropCourse,
    removeEntry,
    moveEntry,
    toggleMaterialReady,
    toggleTemplateMaterial,
    selectedEntry,
    setSelectedEntry,
    conflictAlert,
    dismissConflict,
    getTeacherName,
    getTeacherColor,
    courseTemplates,
  } = useScheduler();

  return (
    <div className="app">
      <header className="app-header" data-testid="app-header">
        <h1 className="app-title">🎨 画室排课画布</h1>
        <RoleSwitcher role={role} onRoleChange={setRole} />
      </header>

      <ConflictAlert alert={conflictAlert} onDismiss={dismissConflict} />

      <div className="app-body">
        <CoursePalette
          courseTemplates={courseTemplates}
          getTeacherName={getTeacherName}
          getTeacherColor={getTeacherColor}
          role={role}
          onToggleMaterial={toggleTemplateMaterial}
        />

        <ScheduleCanvas
          schedule={schedule}
          onDropCourse={dropCourse}
          onMoveEntry={moveEntry}
          onSelectEntry={setSelectedEntry}
          onRemoveEntry={removeEntry}
          onToggleMaterial={toggleMaterialReady}
          selectedEntry={selectedEntry}
          getTeacherName={getTeacherName}
          getTeacherColor={getTeacherColor}
          role={role}
          conflictAlert={conflictAlert}
        />

        <DetailPanel
          entry={selectedEntry}
          getTeacherName={getTeacherName}
          getTeacherColor={getTeacherColor}
          role={role}
          onToggleMaterial={toggleMaterialReady}
          onRemove={removeEntry}
          onClose={() => setSelectedEntry(null)}
        />
      </div>

      <footer className="app-footer">
        <span>排课数据已自动保存至本地</span>
        <span>·</span>
        <span>已排 {schedule.length} 节课</span>
      </footer>
    </div>
  );
}
