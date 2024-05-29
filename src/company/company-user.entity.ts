import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Company } from './company.entity';
import { UserSetting } from '../user/user-setting.entity';
import { UserToken } from 'src/user/user-token.entity';

@Entity('CompanyUser')
export class CompanyUser {
  @PrimaryGeneratedColumn('uuid')
  CompanyUserID: string;

  @Column({ type: 'uuid' })
  CompanyID: string;

  @Column({ type: 'uuid' })
  UserID: string;

  @ManyToOne(() => Company, (company) => company.companyUsers)
  @JoinColumn({ name: 'CompanyID', referencedColumnName: 'CompanyID' })
  company: Company;

  @ManyToOne(() => User, (user) => user.companyUsers)
  @JoinColumn({ name: 'UserID', referencedColumnName: 'UserID' })
  user: User;

  @OneToMany(() => UserSetting, (userSetting) => userSetting.companyUser)
  userSettings: UserSetting[];

  @OneToMany(() => UserToken, (userToken) => userToken.companyUser)
  userTokens: UserToken[];
}
