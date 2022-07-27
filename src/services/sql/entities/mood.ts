import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artist } from "./artist";

@Entity()
export class Mood {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @ManyToMany(() => Artist, (artist) => artist.moods)
  @JoinTable()
  artists!: Artist[];
}
