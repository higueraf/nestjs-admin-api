import { CompanyUser } from 'src/company/company-user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('UserTokenID')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  UserTokenID: string;

  @Column({ type: 'uuid' })
  CompanyUserID: string;

  @Column()
  Token: string;

  @Column({ type: 'uuid', nullable: true })
  ExpirationDate: Date;

  @Column()
  SingleUse: boolean;

  @Column()
  IsUsed: boolean;

  @Column({ nullable: true })
  CreatedAt: Date;

  @ManyToOne(() => CompanyUser, (companyUser) => companyUser.userSettings)
  @JoinColumn({ name: 'CompanyUserID' })
  companyUser: CompanyUser;
}
