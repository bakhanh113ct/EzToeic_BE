import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Test } from "./test.model"

@Entity()
export class TestSet extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({select: false})
    createdAt: Date

    @Column({select: false})
    updatedAt: Date

    @OneToMany((type) => Test, (event) => event.testSet)
    tests: Test[]
}