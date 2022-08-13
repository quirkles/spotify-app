import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mood } from "./mood";

@Entity()
export class Artist {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  externalSpotifyUrl!: string;

  @Column({ length: 100, unique: true })
  spotifyUri!: string;

  @Column({ length: 100, unique: true })
  spotifyId!: string;

  @Column({ length: 100 })
  imageUrl!: string;

  @ManyToMany(() => Mood, (mood) => mood.artists)
  moods!: Mood[];
}
