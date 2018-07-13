// src/answers/controller.ts
import {
  JsonController,
  Get,
  Param,
  //Post,
  //HttpCode,
  Body,
  //Put,
  NotFoundError,
  //CurrentUser,
  Patch
} from "routing-controllers";
import Chat from "./entities";
import { io } from "../index";
//import User from "../users/entity";
//import { Game } from "../games/entities";
// import User from "../users/entity";

@JsonController()
export default class ChatController {
  @Get("/chats/:id")
  getChat(@Param("id") id: number) {
    return Chat.findOneById(id);
  }

  @Get("/chats")
  async allChats() {
    const chats = await Chat.find();
    console.log(chats, "chats");
    return { chats };
  }

  // @Post("/games/:id([0-9]+)/chats")
  // @HttpCode(201)
  // async createMessage(
  //   @CurrentUser() user: User,
  //   @Param("id") gameId: number,
  //   @Body() input: Chat, user: User,
  // ) {

  //   //const game = await Game.findOneById(gameId);
  //   const newMessage = new Chat();
  //   newMessage.message = input.message;
  //   newMessage.timestamp = input.timestamp;
  //   newMessage.gameId = gameId

  //   return input.save();
  // }

  @Patch("/chats/:id([0-9]+)")
  async updateChat(@Param("id") id: number, @Body() update: Partial<Chat>) {
    const chat = await Chat.findOneById(id);
    if (!chat) throw new NotFoundError("Cannot find chat");
    update.message; // = chat.message + update.message;

    io.emit("action", {
      type: "UPDATE_MESSAGE",
      payload: update.message
    });

    return Chat.merge(chat, update).save();
  }
}
