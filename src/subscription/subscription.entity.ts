import { Company } from 'src/company/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Subscription')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  SubscriptionID: string;

  @Column()
  StartDate: Date;

  @Column()
  EndDate: Date;

  @Column()
  Storage: number;

  @Column()
  Price: number;

  @Column()
  FrequencyPayment: string;

  @Column()
  CompanyID: string;

  @Column()
  IsActive: boolean;

  @Column()
  SubscriptionStripeID: string;

  @Column()
  SeatsQty: number;

  @Column()
  IsUnlimitedGuests: boolean;

  @Column({ type: 'uuid' })
  PlanID: string;

  @Column({ type: 'uuid' })
  Reseller: string;

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

  @ManyToOne(() => Company, (company) => company.subscriptions)
  @JoinColumn({ name: 'CompanyID', referencedColumnName: 'CompanyID' })
  company: Company;
}
