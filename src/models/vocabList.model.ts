import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { PartDetail } from "./partDetail.model";
import { User } from "./auth.model";
import { Vocab } from "./vocab.model";

@Entity()
export class VocabList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  vocabCount: number;

  @Column({ select: false })
  createdAt: Date;

  @Column({ select: false })
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.vocabLists)
  user: User;

  @OneToMany((type) => Vocab, (vocab) => vocab.vocabList)
  vocabs: Vocab[];
}
