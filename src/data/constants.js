const TEACHERS = [
  { id: 't1', name: '王老师', color: '#6366f1' },
  { id: 't2', name: '李老师', color: '#ec4899' },
  { id: 't3', name: '张老师', color: '#14b8a6' },
  { id: 't4', name: '陈老师', color: '#f59e0b' },
];

const CLASSROOMS = [
  { id: 'r1', name: '素描教室', capacity: 12 },
  { id: 'r2', name: '水彩教室', capacity: 10 },
  { id: 'r3', name: '油画教室', capacity: 8 },
  { id: 'r4', name: '国画教室', capacity: 10 },
];

const TIMESLOTS = [
  { id: 'ts1', label: '09:00-10:30', hour: 9 },
  { id: 'ts2', label: '10:45-12:15', hour: 10 },
  { id: 'ts3', label: '14:00-15:30', hour: 14 },
  { id: 'ts4', label: '15:45-17:15', hour: 15 },
  { id: 'ts5', label: '18:30-20:00', hour: 18 },
];

const COURSE_TEMPLATES = [
  {
    id: 'c1',
    name: '素描基础',
    teacherId: 't1',
    maxStudents: 12,
    isTrial: false,
    materials: ['铅笔', '素描纸', '橡皮'],
    materialsReady: true,
    duration: 1,
  },
  {
    id: 'c2',
    name: '水彩入门',
    teacherId: 't2',
    maxStudents: 10,
    isTrial: false,
    materials: ['水彩颜料', '水彩纸', '画笔', '调色盘'],
    materialsReady: false,
    duration: 1,
  },
  {
    id: 'c3',
    name: '油画进阶',
    teacherId: 't3',
    maxStudents: 8,
    isTrial: false,
    materials: ['油画颜料', '画布', '松节油', '画笔'],
    materialsReady: true,
    duration: 1,
  },
  {
    id: 'c4',
    name: '国画写意',
    teacherId: 't4',
    maxStudents: 10,
    isTrial: false,
    materials: ['毛笔', '宣纸', '墨汁', '颜料'],
    materialsReady: false,
    duration: 1,
  },
  {
    id: 'c5',
    name: '素描体验课',
    teacherId: 't1',
    maxStudents: 12,
    isTrial: true,
    materials: ['铅笔', '素描纸'],
    materialsReady: true,
    duration: 1,
  },
  {
    id: 'c6',
    name: '水彩体验课',
    teacherId: 't2',
    maxStudents: 10,
    isTrial: true,
    materials: ['水彩颜料', '水彩纸'],
    materialsReady: true,
    duration: 1,
  },
  {
    id: 'c7',
    name: '创意手工',
    teacherId: 't1',
    maxStudents: 10,
    isTrial: false,
    materials: ['彩纸', '剪刀', '胶水'],
    materialsReady: true,
    duration: 1,
  },
  {
    id: 'c8',
    name: '油画体验课',
    teacherId: 't3',
    maxStudents: 8,
    isTrial: true,
    materials: ['油画颜料', '画布'],
    materialsReady: false,
    duration: 1,
  },
];

const ROLES = {
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin',
};

export { TEACHERS, CLASSROOMS, TIMESLOTS, COURSE_TEMPLATES, ROLES };
