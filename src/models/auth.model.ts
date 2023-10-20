import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Result } from "./result.model";
import { VocabList } from "./vocabList.model";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @Column()
  name: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  phone: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ select: false })
  createdAt: Date;

  @Column({ select: false })
  updatedAt: Date;

  @OneToMany((type) => Result, (result) => result.user)
  results: Result[];

  @OneToMany((type) => VocabList, (vocab) => vocab.user)
  vocabLists: VocabList[];
}
