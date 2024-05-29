export enum RoleEnum {
  ADMIN = 'Admin',
  GUEST = 'Guest',
  MASTER = 'Master',
  OWNER = 'Owner',
  ROOT = 'Root',
  VIEWER = 'Viewer',
}

export const AllRoles =
  RoleEnum.ADMIN +
  ',' +
  RoleEnum.GUEST +
  ',' +
  RoleEnum.MASTER +
  ',' +
  RoleEnum.OWNER +
  ',' +
  RoleEnum.ROOT +
  ',' +
  RoleEnum.VIEWER;
