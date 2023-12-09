import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
  IsNull,
} from "typeorm";
import { PartDetail } from "./partDetail.model";
import { ResultDetail } from "./resultDetail.model";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  index: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column({nullable: true})
  imageUrl: string;

  @Column({nullable: true})
  audioUrl: string;

  @Column({ nullable: true })
  A: string;

  @Column({ nullable: true })
  B: string;

  @Column({ nullable: true })
  C: string;

  @Column({ nullable: true })
  D: string;

  @Column({select: false})
  createdAt: Date;

  @Column({select: false})
  updatedAt: Date;

  @ManyToOne((type) => PartDetail, (partDetail) => partDetail.questions)
  partDetail: PartDetail;

  @OneToMany((type) => ResultDetail, (resultDetail) => resultDetail.result)
  resultDetails: ResultDetail[];
}
