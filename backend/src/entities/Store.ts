import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  // Point,
  // Index,
} from "typeorm";
import { User } from "./User";
import { StoreImage } from "./StoreImage";
import { Favorite } from "./Favorite";
import { Broadcast } from "./Broadcast";
import { BusinessNumber } from "./BusinessNumber";
import { BigRegion } from "./BigRegion";
import { SmallRegion } from "./SmallRegion";

@Entity("stores")
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.stores, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "fk_store_user",
  })
  user!: User;

  @Column({ name: "store_name" })
  storeName!: string;

  @OneToOne(() => BusinessNumber, (bn) => bn.store, { nullable: false })
  @JoinColumn({
    name: "business_number_id",
    foreignKeyConstraintName: "fk_store_business_number",
  })
  businessNumber!: BusinessNumber;

  @Column({ name: "address" })
  address!: string;

  @ManyToOne(() => BigRegion, (br) => br.stores, { nullable: false })
  @JoinColumn({
    name: "big_region_id",
    foreignKeyConstraintName: "fk_store_bigregion",
  })
  bigRegion!: BigRegion;

  @ManyToOne(() => SmallRegion, (sr) => sr.stores, { nullable: false })
  @JoinColumn({
    name: "small_region_id",
    foreignKeyConstraintName: "fk_store_smallregion",
  })
  smallRegion!: SmallRegion;

  // @Index({ spatial: true })
  // @Column({
  //   name: "location",
  //   type: "point",
  //   spatialFeatureType: "Point",
  //   srid: 4326,
  // })
  // location!: string;

  @Column({ name: "lat", type: "float"})
  lat!: number;

  @Column({ name: "lng", type: "float"})
  lng!: number;

  @Column({ name: "phone" })
  phone!: string;

  @Column({ name: "opening_hours" })
  openingHours!: string;

  @Column("text", { name: "menus" })
  menus!: string;

  @Column({ name: "type" })
  type!: string;

  @Column({ name: 'description', nullable: true })
  description!: string;

  @OneToMany(() => StoreImage, (img) => img.store)
  images!: StoreImage[];

  @OneToMany(() => Favorite, (fav) => fav.store)
  favorites!: Favorite[];

  @OneToMany(() => Broadcast, (bc) => bc.store)
  broadcasts!: Broadcast[];
}
