import { UserSetting } from '../user/user-setting.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('BranchDepartment')
export class BranchDepartment {
  @PrimaryGeneratedColumn('uuid')
  BranchDepartmentID: string;

  @Column({ type: 'varchar', length: 150 })
  Name: string;

  @Column({ type: 'uuid' })
  BranchID: string;

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

  @OneToMany(() => UserSetting, (userSetting) => userSetting.branchDepartment)
  userSettings: UserSetting[];
}
