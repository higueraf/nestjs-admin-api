import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('CompanySetting')
export class CompanySetting {
  @PrimaryGeneratedColumn('uuid')
  CompanySettingID: string;

  @Column({ type: 'uuid' })
  CompanyID: string;

  @Column({ type: 'varchar', length: 512 })
  WhiteLogo: string;

  @Column({ type: 'varchar', length: 512 })
  DarkLogo: string;

  @Column({ type: 'varchar', length: 512 })
  LoginBackground: string;

  @Column()
  UseCompanyName: boolean;

  @Column({ type: 'varchar', length: 512 })
  ShortcoutLink: string;

  @Column({ type: 'varchar', length: 512 })
  EmailLogo: string;

  @Column({ type: 'varchar', length: 512 })
  TokenType: string;

  @Column({ type: 'int' })
  TokenValidationDays: number;

  @Column()
  IsTokenForAdmin: boolean;

  @Column()
  IsTokenForViewer: boolean;

  @Column()
  IsTokenForGuest: boolean;

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

  @OneToOne(() => Company, (company) => company.companySetting)
  @JoinColumn({ name: 'CompanyID', referencedColumnName: 'CompanyID' })
  company: Company;
}
