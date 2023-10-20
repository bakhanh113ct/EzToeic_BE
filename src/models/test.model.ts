import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { TestSet } from "./testSet.model"
import { Result } from "./result.model"
import { PartDetail } from "./partDetail.model"

@Entity()
export class Test extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({})
    sectionCount: number

    @Column()
    questionCount: number
    
    @Column()
    time: string

    @Column({select: false})
    createdAt: Date

    @Column({select: false})
    updatedAt: Date

    @ManyToOne((type) => TestSet, (testSet) => testSet.tests)
    testSet: TestSet

    @OneToMany((type) => Result, (result) => result.test)
    results: Result[]

    @OneToMany((type) => PartDetail, (result) => result.test)
    partDetails: Result[]
}