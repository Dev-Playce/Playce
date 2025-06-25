import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Store } from "./Store";

@Entity("stores_images")
export class StoreImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Store, (store) => store.images, { nullable: false })
  @JoinColumn({
    name: "store_id",
    foreignKeyConstraintName: "fk_storeimage_store",
  })
  store!: Store;

  @Column()
  img_url!: string;

  @Column()
  is_main!: boolean;
}
