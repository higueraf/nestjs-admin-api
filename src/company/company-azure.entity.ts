import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('CompanyAzure')
export class CompanyAzure {
  @PrimaryGeneratedColumn('uuid')
  CompanyAzureID: string;

  @Column({ type: 'uuid' })
  CompanyID: string;

  @Column({ type: 'varchar', length: 512 })
  MigrationStorageFolder: string;

  @Column({ type: 'varchar', length: 512 })
  ProjectsConnection: string;

  @Column({ type: 'varchar', length: 512 })
  UploadsConnection: string;

  @Column({ type: 'varchar', length: 512 })
  ProjectsCopyToken: string;

  @Column({ type: 'varchar', length: 512 })
  UploadsCopyToken: string;

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

  @ManyToOne(() => Company, (company) => company.companyUsers)
  @JoinColumn({ name: 'CompanyID', referencedColumnName: 'CompanyID' })
  company: Company;
}
