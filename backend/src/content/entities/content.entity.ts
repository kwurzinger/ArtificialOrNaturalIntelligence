import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Content {
    @PrimaryGeneratedColumn()
    content_id: number;

    @Column('int', { nullable: false })
    content_level: number;

    @Column('text', { nullable: false })
    content_link: string;

    @Column('text', { nullable: false })
    content_creator: string;
}