import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  CountryID: string;

  @Column({ type: 'varchar', length: 150 })
  Name: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  Iso: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  Iso3: string;

  @Column({ type: 'int', nullable: true })
  NumCode: number;

  @Column({ type: 'int', nullable: true })
  PhoneCode: number;
}
