import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Sport } from "./Sport";
import { Broadcast } from "./Broadcast";

@Entity("leagues")
export class League {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @ManyToOne(() => Sport, (sport) => sport.leagues, { nullable: false })
  @JoinColumn({ name: "sport_id", foreignKeyConstraintName: "fk_league_sport" })
  sport!: Sport;
  
  @Column({ name: 'name' })
  name!: string;

  @OneToMany(() => Broadcast, (bc) => bc.league)
  broadcasts!: Broadcast[];
}
