import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum LogEvent {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete',
  Error = 'Error',
}
@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  LogID: string;

  @Column({ nullable: true })
  DateTime: Date;

  @Column({ type: 'uuid' })
  UserID: string;

  @Column()
  UserName: string;

  @Column()
  Microservice: string;

  @Column()
  EventMessage: string;

  @Column()
  EventMethod: string;

  @Column()
  ErrorMessage: string;

  @Column({ type: 'uuid' })
  CompanyID: string;

  @Column()
  CompanyName: string;
}
