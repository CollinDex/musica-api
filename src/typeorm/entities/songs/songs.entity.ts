import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('varchar', {array: true})
    artists: string[];

    @Column({type: 'date'})
    releasedDate: Date;

    @Column({type:'time'})
    duration: Date;

    @Column({nullable: true})
    favorite: string;

    @Column({type: 'text', nullable:true})
    lyrics: string;
}