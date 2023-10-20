import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./auth.model";
import { Test } from "./test.model";
import { ResultDetail } from "./resultDetail.model";
import { ResultPart } from "./resultPart.model";

@Entity()
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  score: string;

  @Column({ nullable: true })
  readingCorrectCount: number;

  @Column({ nullable: true })
  listeningCorrectCount: number;

  @Column({ nullable: true })
  correctCount: number;

  @Column()
  time: string;

  @Column({select: false})
  dateComplete: Date;

  @Column({select: false})
  createdAt: Date;

  @Column({select: false})
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.results)
  user: User;

  @ManyToOne((type) => Test, (test) => test.results)
  test: Test;

  @OneToMany((type) => ResultDetail, (test) => test.result)
  resultDetails: ResultDetail[];

  @OneToMany((type) => ResultPart, (test) => test.result)
  resultParts: ResultDetail[];
}
