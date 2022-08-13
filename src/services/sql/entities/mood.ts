import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Artist } from "./artist";

@Entity()
export class Mood {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  createdBy!: string;

  @Column({ length: 250, nullable: true })
  description!: string;

  @Column({ default: 0 })
  playCount!: number;

  @ManyToMany(() => Artist, (artist) => artist.moods)
  @JoinTable()
  artists!: Artist[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
