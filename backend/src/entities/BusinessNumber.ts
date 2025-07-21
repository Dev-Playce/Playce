import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Unique } from 'typeorm';
import { Store } from './Store';

@Entity('business_numbers')
@Unique(['businessNumber'])
export class BusinessNumber {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'business_number' })
  businessNumber!: string;

  @Column({ name: 'is_valid' })
  isValid!: boolean;

  @OneToOne(() => Store, store => store.businessNumber)
  store!: Store;
}