import { UserSetting } from '../user/user-setting.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  RoleID: string;

  @Column({ type: 'varchar', length: 150 })
  Name: string;

  @Column()
  IsPublic: boolean;

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

  @OneToMany(() => UserSetting, (userSetting) => userSetting.role)
  userSettings?: UserSetting[];
}
