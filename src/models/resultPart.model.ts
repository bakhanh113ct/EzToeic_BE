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
import { Result } from "./result.model";
import { Part } from "./part.model";
  
  @Entity()
  export class ResultPart extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    partNumber: number;
  
    @ManyToOne((type) => Result, (partDetail) => partDetail.resultParts)
    result: Result;

    @ManyToOne((type) => Part, (partDetail) => partDetail.resultParts)
    part: Part;
  }
  