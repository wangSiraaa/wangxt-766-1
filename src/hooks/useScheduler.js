import { useState, useCallback, useEffect, useRef } from 'react';
import { TEACHERS, CLASSROOMS, TIMESLOTS, COURSE_TEMPLATES, ROLES } from '../data/constants';
import { canDrop, createScheduleEntry } from '../utils/conflicts';
import { loadState, saveState } from '../utils/storage';
import seed766 from '../data/seed-766.json';

const DRAG_TYPES = { COURSE: 'COURSE', SCHEDULED: 'SCHEDULED' };

function buildInitialState() {
  const saved = loadState();
  if (saved && saved.schedule && saved.role) return saved;
  return {
    schedule: seed766.initialSchedule.map((s) => ({ ...s })),
    role: ROLES.ADMIN,
    courseTemplates: COURSE_TEMPLATES.map((c) => ({ ...c })),
  };
}

export function useScheduler() {
  const [state, setState] = useState(buildInitialState);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [conflictAlert, setConflictAlert] = useState(null);
  const [jumpTarget, setJumpTarget] = useState(null);
  const [highlightTarget, setHighlightTarget] = useState(null);
  const bounceTimers = useRef({});

  useEffect(() => {
    saveState(state);
  }, [state]);

  const schedule = state.schedule;
  const role = state.role;
  const courseTemplates = state.courseTemplates;

  const setRole = useCallback((newRole) => {
    setState((prev) => ({ ...prev, role: newRole }));
  }, []);

  const dropCourse = useCallback(
    (courseId, classroomId, timeslotId, existingEntryId) => {
      const entry = createScheduleEntry(courseId, classroomId, timeslotId, courseTemplates);
      if (!entry) return false;

      if (existingEntryId) {
        entry.id = existingEntryId;
      }

      const result = canDrop(schedule, entry, CLASSROOMS, courseTemplates);
      if (!result.ok) {
        setConflictAlert({ ...result, entry, classroomId, timeslotId });
        if (bounceTimers.current[entry.id]) clearTimeout(bounceTimers.current[entry.id]);
        bounceTimers.current[entry.id] = setTimeout(() => {
          setConflictAlert(null);
        }, 3000);
        return false;
      }

      setState((prev) => {
        let newSchedule;
        if (existingEntryId) {
          newSchedule = prev.schedule.map((s) => (s.id === existingEntryId ? entry : s));
        } else {
          newSchedule = [...prev.schedule, entry];
        }
        return { ...prev, schedule: newSchedule };
      });

      setConflictAlert(null);
      return true;
    },
    [schedule, courseTemplates]
  );

  const removeEntry = useCallback((entryId) => {
    setState((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== entryId),
    }));
    setSelectedEntry(null);
  }, []);

  const moveEntry = useCallback(
    (entryId, newClassroomId, newTimeslotId) => {
      const existing = schedule.find((s) => s.id === entryId);
      if (!existing) return false;
      return dropCourse(existing.courseId, newClassroomId, newTimeslotId, entryId);
    },
    [schedule, dropCourse]
  );

  const toggleMaterialReady = useCallback((entryId) => {
    setState((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s) =>
        s.id === entryId ? { ...s, materialsReady: !s.materialsReady } : s
      ),
    }));
  }, []);

  const toggleTemplateMaterial = useCallback((courseId) => {
    setState((prev) => ({
      ...prev,
      courseTemplates: prev.courseTemplates.map((c) =>
        c.id === courseId ? { ...c, materialsReady: !c.materialsReady } : c
      ),
    }));
  }, []);

  const dismissConflict = useCallback(() => {
    setConflictAlert(null);
  }, []);

  const getEntryAt = useCallback(
    (classroomId, timeslotId) => {
      return schedule.find(
        (s) => s.classroomId === classroomId && s.timeslotId === timeslotId
      ) || null;
    },
    [schedule]
  );

  const getTeacherName = useCallback((teacherId) => {
    const t = TEACHERS.find((t) => t.id === teacherId);
    return t ? t.name : '未知';
  }, []);

  const getTeacherColor = useCallback((teacherId) => {
    const t = TEACHERS.find((t) => t.id === teacherId);
    return t ? t.color : '#6b7280';
  }, []);

  const jumpTo = useCallback((classroomId, timeslotId) => {
    setJumpTarget({ classroomId, timeslotId });
    setHighlightTarget({ classroomId, timeslotId });
    setTimeout(() => {
      setHighlightTarget(null);
    }, 3000);
    setTimeout(() => {
      setJumpTarget(null);
    }, 100);
  }, []);

  const jumpToEntry = useCallback((entryId) => {
    const entry = schedule.find((s) => s.id === entryId);
    if (entry) {
      jumpTo(entry.classroomId, entry.timeslotId);
      setSelectedEntry(entry);
    }
  }, [schedule, jumpTo]);

  const clearJumpTarget = useCallback(() => {
    setJumpTarget(null);
  }, []);

  const getSeedBusinessCode = useCallback(() => {
    return seed766.businessCode;
  }, []);

  return {
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
    getEntryAt,
    getTeacherName,
    getTeacherColor,
    courseTemplates,
    DRAG_TYPES,
    jumpTarget,
    highlightTarget,
    jumpTo,
    jumpToEntry,
    clearJumpTarget,
    getSeedBusinessCode,
  };
}
