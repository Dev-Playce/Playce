import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Store } from "./Store";

@Entity("favorites")
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.favorites, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "fk_favorite_user",
  })
  user!: User;

  @ManyToOne(() => Store, (store) => store.favorites, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: "store_id",
    foreignKeyConstraintName: "fk_favorite_store",
  })
  store!: Store;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
