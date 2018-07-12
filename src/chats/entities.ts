import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import User from "../users/entity";

@Entity()
export default class Chat extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column("text", { nullable: false })
  message: string;

  @ManyToOne(_ => User, user => user.chats)
  user: User;
}
