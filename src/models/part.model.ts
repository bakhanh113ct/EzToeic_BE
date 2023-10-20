import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { PartDetail } from "./partDetail.model"
import { ResultPart } from "./resultPart.model"

@Entity()
export class Part extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    number: string

    @Column()
    introduction: string

    @OneToMany((type) => PartDetail, (partDetail) => partDetail.part)
    partDetails: PartDetail[]

    @OneToMany((type) => ResultPart, (partDetail) => partDetail.part)
    resultParts: ResultPart[]
}