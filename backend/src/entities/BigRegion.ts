import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SmallRegion } from './SmallRegion';
import { Store } from './Store';

@Entity('big_regions')
export class BigRegion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name' })
  name!: string;

  @OneToMany(() => SmallRegion, sr => sr.bigRegion)
  smallRegions!: SmallRegion[];

  @OneToMany(() => Store, store => store.bigRegion)
  stores!: Store[];
}
