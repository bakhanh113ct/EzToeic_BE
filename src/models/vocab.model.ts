import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { PartDetail } from "./partDetail.model";
import { VocabList } from "./vocabList.model";

@Entity()
export class Vocab extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vocab: string;

  @Column()
  definition: string;

  @Column({ select: false })
  createdAt: Date;

  @Column({ select: false })
  updatedAt: Date;

  @OneToMany((type) => PartDetail, (partDetail) => partDetail.part)
  partDetails: PartDetail[];

  @ManyToOne((type) => VocabList, (vocabList) => vocabList.vocabs)
  vocabList: VocabList;
}
