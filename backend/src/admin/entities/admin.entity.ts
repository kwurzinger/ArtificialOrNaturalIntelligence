import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column('text', { nullable: false, unique: true })
  username: string;

  @Column('text', { nullable: false })
  password_hash: string;
}