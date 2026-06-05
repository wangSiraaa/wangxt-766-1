import { v4 as uuidv4 } from 'uuid';

export function checkTeacherConflict(schedule, entry) {
  return schedule.some(
    (s) =>
      s.teacherId === entry.teacherId &&
      s.timeslotId === entry.timeslotId &&
      s.id !== entry.id
  );
}

export function checkTrialFullClass(schedule, entry, classrooms, courseTemplates) {
  if (!entry.isTrial) return false;
  const sameTimeslot = schedule.filter(
    (s) => s.timeslotId === entry.timeslotId && s.id !== entry.id
  );
  if (sameTimeslot.length === 0) return false;
  return sameTimeslot.some((s) => {
    return s.currentStudents >= s.maxStudents;
  });
}

export function canDrop(schedule, entry, classrooms, courseTemplates) {
  const teacherConflict = checkTeacherConflict(schedule, entry);
  if (teacherConflict) {
    return { ok: false, reason: 'teacher_conflict', message: '该教师此时段已有课程，存在时间冲突' };
  }
  const trialFull = checkTrialFullClass(schedule, entry, classrooms, courseTemplates);
  if (trialFull) {
    return { ok: false, reason: 'trial_full', message: '试听课不能排到已有满班课程的时段' };
  }
  return { ok: true };
}

export function createScheduleEntry(courseId, classroomId, timeslotId, courseTemplates) {
  const tpl = courseTemplates.find((c) => c.id === courseId);
  if (!tpl) return null;
  return {
    id: uuidv4(),
    courseId,
    classroomId,
    timeslotId,
    teacherId: tpl.teacherId,
    name: tpl.name,
    isTrial: tpl.isTrial,
    maxStudents: tpl.maxStudents,
    materials: [...tpl.materials],
    materialsReady: tpl.materialsReady,
    currentStudents: tpl.isTrial ? 0 : Math.floor(Math.random() * (tpl.maxStudents * 0.6)),
  };
}
