import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Store } from "./Store";
import { Sport } from "./Sport";
import { League } from "./League";

@Entity("broadcasts")
export class Broadcast {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Store, (store) => store.broadcasts, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({
    name: "store_id",
    foreignKeyConstraintName: "fk_broadcast_store",
  })
  store!: Store;

  @Column({ name: 'match_date', type: "date" })
  matchDate!: string;

  @Column({ name: 'match_time', type: "time" })
  matchTime!: string;

  @ManyToOne(() => Sport, (sport) => sport.broadcasts, { nullable: false })
  @JoinColumn({
    name: "sport_id",
    foreignKeyConstraintName: "fk_broadcast_sport",
  })
  sport!: Sport;

  @ManyToOne(() => League, (league) => league.broadcasts, { nullable: false })
  @JoinColumn({
    name: "league_id",
    foreignKeyConstraintName: "fk_broadcast_league",
  })
  league!: League;

  @Column({ name: 'team_one', nullable: true })
  teamOne!: string;

  @Column({ name: 'team_two', nullable: true })
  teamTwo!: string;

  @Column("text", { name: 'etc', nullable: true })
  etc!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
