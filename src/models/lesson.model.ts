import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { PartDetail } from "./partDetail.model"
import { ResultPart } from "./resultPart.model"
import { Playlist } from "./playlist.model"

@Entity()
export class Lesson extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    videoUrl: string

    @Column({nullable: true})
    title: string

    @ManyToOne((type) => Playlist, (playlist) => playlist.lessons)
    playlist: Playlist
}