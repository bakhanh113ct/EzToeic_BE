import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { PartDetail } from "./partDetail.model"
import { ResultPart } from "./resultPart.model"
import { Lesson } from "./lesson.model"

@Entity()
export class Playlist extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({nullable: true})
    thumbnailUrl: string

    @OneToMany((type) => Lesson, (lesson) => lesson.playlist)
    lessons: Lesson[]
}