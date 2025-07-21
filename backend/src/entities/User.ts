import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Store } from './Store';
import { Favorite } from './Favorite';

@Entity('users')
@Unique(['email'])
@Unique(['phone'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'email' })
  email!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'nickname' })
  nickname!: string;

  @Column({ name: 'phone' })
  phone!: string;

  @OneToMany(() => Store, store => store.user)
  stores!: Store[];

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites!: Favorite[];
}
