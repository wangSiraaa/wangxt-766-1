import { ROLES } from '../data/constants';

const ROLE_LABELS = {
  [ROLES.ADMIN]: '管理员',
  [ROLES.TEACHER]: '教师',
  [ROLES.PARENT]: '家长',
};

const ROLE_ICONS = {
  [ROLES.ADMIN]: '🔧',
  [ROLES.TEACHER]: '✏️',
  [ROLES.PARENT]: '👨‍👩‍👧',
};

export default function RoleSwitcher({ role, onRoleChange }) {
  return (
    <div className="role-switcher">
      <span className="role-label">当前角色：</span>
      {Object.values(ROLES).map((r) => (
        <button
          key={r}
          className={`role-btn ${role === r ? 'active' : ''}`}
          onClick={() => onRoleChange(r)}
          data-testid={`role-${r}`}
        >
          {ROLE_ICONS[r]} {ROLE_LABELS[r]}
        </button>
      ))}
    </div>
  );
}
