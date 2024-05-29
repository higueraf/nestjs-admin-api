import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CompanyUser } from './company-user.entity';
import { CompanySetting } from './company-setting.entity';
import { Subscription } from '../subscription/subscription.entity';

@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  CompanyID: string;

  @Column({ type: 'varchar', length: 128 })
  Name: string;

  @Column({ type: 'varchar', length: 500 })
  Address: string;

  @Column({ type: 'varchar', length: 128 })
  PhoneNumber: string;

  @Column({ type: 'varchar', length: 128 })
  CountryID: string;

  @Column({ type: 'varchar', length: 150 })
  FolderName: string;

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

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.company)
  companyUsers: CompanyUser[];

  @OneToOne(() => CompanySetting, (companySetting) => companySetting.company)
  companySetting: CompanySetting;

  @OneToMany(() => Subscription, (subscription) => subscription.company)
  subscriptions: Subscription[];
}
