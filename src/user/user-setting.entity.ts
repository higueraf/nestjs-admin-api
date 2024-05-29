import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Role } from '../role/role.entity';
import { BranchDepartment } from '../branch/branch-department.entity';
import { CompanyUser } from '../company/company-user.entity';

@Entity({ name: 'UserSetting' })
export class UserSetting {
  @PrimaryGeneratedColumn('uuid')
  UserSettingID: string;

  @Column('uuid')
  CompanyUserID: string;

  @Column('uuid')
  RoleID: string;

  @Column({ type: 'uuid', nullable: true })
  BranchDepartmentID: string;

  @Column()
  PhoneNumberConfirmed: boolean;

  @Column()
  EmailConfirmed: boolean;

  @Column()
  IsConnected: boolean;

  @Column()
  IsActive: boolean;

  @Column()
  Token: string;

  @Column()
  Locked: boolean;

  @Column()
  AccessFailedDate: Date;

  @Column()
  DateJoined: Date;

  @Column()
  DateLastActive: Date;

  @Column()
  DateInvited: Date;

  @Column()
  Comment: string;

  @Column()
  CommentDate: Date;

  @Column()
  CanDownload: boolean;

  @Column({ type: 'uuid' })
  CreatedBy: string;

  @Column()
  CreatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  UpdatedBy: string;

  @Column({ nullable: true })
  UpdatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  DeletedBy: string;

  @Column({ nullable: true })
  DeletedAt: Date;

  @ManyToOne(
    () => BranchDepartment,
    (branchDepartment) => branchDepartment.userSettings,
  )
  @JoinColumn({ name: 'BranchDepartmentID' })
  branchDepartment: BranchDepartment;

  @ManyToOne(() => CompanyUser, (companyUser) => companyUser.userSettings)
  @JoinColumn({ name: 'CompanyUserID' })
  companyUser: CompanyUser;

  @ManyToOne(() => Role, (role) => role.userSettings)
  @JoinColumn({ name: 'RoleID' })
  role: Role;
}
