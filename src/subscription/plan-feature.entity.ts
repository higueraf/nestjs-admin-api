import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { Feature } from './feature.entity';

@Entity('PlanFeature')
export class PlanFeature {
  @PrimaryGeneratedColumn('uuid')
  PlanFeatureID: string;

  @Column({ type: 'uuid', nullable: true })
  PlanID: string;

  @Column({ type: 'uuid', nullable: true })
  FeatureID: string;

  @Column({ type: 'uuid', nullable: true })
  CompanyID: string;

  @ManyToOne(() => Plan, (plan) => plan.planFeatures)
  @JoinColumn({ name: 'PlanID', referencedColumnName: 'PlanID' })
  plan: Plan;

  @ManyToOne(() => Feature, (feature) => feature.planFeatures)
  @JoinColumn({ name: 'FeatureID', referencedColumnName: 'FeatureID' })
  feature: Feature;
}
