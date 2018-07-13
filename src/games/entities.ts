import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToOne
} from "typeorm";
import User from "../users/entity";
import Chat from "../chats/entities";

export type Symbol = "x" | "o";
export type Row = [
  Symbol | null,
  Symbol | null,
  Symbol | null,
  Symbol | null,
  Symbol | null,
  Symbol | null,
  Symbol | null
];
export type Board = [Row, Row, Row, Row, Row, Row];

type Status = "pending" | "started" | "finished";

const emptyRow: Row = [null, null, null, null, null, null, null];
const emptyBoard: Board = [
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow
];

export type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CellInfo = [Index | null, Index | null];
export type WinnerCells = [CellInfo, CellInfo, CellInfo, CellInfo];

const emptyCellInfo: CellInfo = [null, null];
const emptyWinnerCells: WinnerCells = [
  emptyCellInfo,
  emptyCellInfo,
  emptyCellInfo,
  emptyCellInfo
];

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column("json", { default: emptyBoard })
  board: Board;

  @Column("char", { length: 1, default: "x" })
  turn: Symbol;

  @Column("char", { length: 1, nullable: true })
  winner: Symbol;

  @Column("text", { default: "pending" })
  status: Status;

  @Column("json", { default: emptyWinnerCells })
  winnerCells: any; //WinnerCells;

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[];

  @OneToMany(_ => Chat, chat => chat.game, { eager: true })
  chats: Chat[];
}

@Entity()
@Index(["game", "user", "symbol"], { unique: true })
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @ManyToOne(_ => User, user => user.players)
  user: User;

  @ManyToOne(_ => Game, game => game.players)
  game: Game;

  @Column() userId: number;

  @Column("char", { length: 1 })
  symbol: Symbol;
}
