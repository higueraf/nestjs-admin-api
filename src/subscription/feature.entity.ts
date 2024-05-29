import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlanFeature } from './plan-feature.entity';

@Entity('Feature')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  FeatureID: string;

  @Column()
  Name: string;

  @OneToMany(() => PlanFeature, (planFeature) => planFeature.feature)
  planFeatures: PlanFeature[];
}
