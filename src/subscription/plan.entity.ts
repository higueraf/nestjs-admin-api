import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlanFeature } from './plan-feature.entity';

@Entity('Plan')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  PlanID: string;

  @Column()
  Name: string;

  @OneToMany(() => PlanFeature, (planFeature) => planFeature.plan)
  planFeatures: PlanFeature[];
}
