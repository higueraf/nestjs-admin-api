import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Branch')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  BranchID: string;

  @Column({ type: 'varchar', length: 150 })
  Name: string;

  @Column({ type: 'uuid' })
  CompanyID: string;

  @Column({ type: 'uuid' })
  CreatedBy?: string;

  @Column()
  CreatedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  UpdatedBy?: string;

  @Column({ nullable: true })
  UpdatedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  DeletedBy?: string;

  @Column({ nullable: true })
  DeletedAt?: Date;
}
