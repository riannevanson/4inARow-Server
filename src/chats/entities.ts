import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import User from "../users/entity";
import { IsString, IsOptional } from "../../node_modules/class-validator";
import { Game } from "../games/entities";

@Entity()
export default class Chat extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column("text", { nullable: true })
  message: string;

  @ManyToOne(_ => User, user => user.chats)
  user: User; // moet misschien player zijn

  @ManyToOne(_ => Game, game => game.chats)
  game: Game;

  @IsOptional()
  @IsString()
  @Column("timestamp", {
    precision: 3,
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  timestamp: Date;
}
