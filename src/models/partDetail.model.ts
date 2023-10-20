import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Test } from "./test.model";
import { Part } from "./part.model";
import { Question } from "./question.model";

@Entity()
export class PartDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionCount: number;

  @Column()
  selectAnswerCount: number;

  @Column({ select: false })
  createdAt: Date;

  @Column({ select: false })
  updatedAt: Date;

  @ManyToOne((type) => Part, (part) => part.partDetails)
  part: Part;

  @ManyToOne((type) => Test, (test) => test.partDetails)
  test: Test;

  @OneToMany((type) => Question, (question) => question.partDetail)
  questions: Question[];
}
