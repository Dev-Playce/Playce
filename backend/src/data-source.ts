import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Store } from "./entities/Store";
import { StoreImage } from "./entities/StoreImage";
import { Favorite } from "./entities/Favorite";
import { Broadcast } from "./entities/Broadcast";
import { Sport } from "./entities/Sport";
import { League } from "./entities/League";
import { BusinessNumber } from "./entities/BusinessNumber";
import { BigRegion } from "./entities/BigRegion";
import { SmallRegion } from "./entities/SmallRegion";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    User,
    Store,
    StoreImage,
    Favorite,
    Broadcast,
    BusinessNumber,
    BigRegion,
    SmallRegion,
    Sport,
    League,
  ],
  migrations: [path.join(__dirname, "migrations", "*.ts")],

}); 

