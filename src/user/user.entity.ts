import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CompanyUser } from '../company/company-user.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  UserID: string;

  @Column()
  Name: string;

  @Column()
  Username: string;

  @Column()
  Password: string;

  @Column()
  Email: string;

  @Column()
  Address: string;

  @Column()
  PhoneNumber: string;

  @Column({ nullable: true })
  Title: string;

  @Column({ type: 'uuid', nullable: true })
  CreatedBy: string;

  @Column({ nullable: true })
  CreatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  UpdatedBy: string;

  @Column({ nullable: true })
  UpdatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  DeletedBy: string;

  @Column({ nullable: true })
  DeletedAt: Date;

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.user)
  companyUsers: CompanyUser[];
}
