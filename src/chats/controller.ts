// src/answers/controller.ts
import {
  JsonController,
  Get,
  Param,
  Post,
  HttpCode,
  Body,
  Put,
  NotFoundError
} from "routing-controllers";
import Chat from "./entities";
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

  @Post("/chats")
  @HttpCode(201)
  createMessage(@Body() chat: Chat) {
    return chat.save();
  }

  @Put("/chats/:id")
  async updateChat(@Param("id") id: number, @Body() update: Partial<Chat>) {
    const chat = await Chat.findOneById(id);
    if (!chat) throw new NotFoundError("Cannot find chat");

    return Chat.merge(chat, update).save();
  }
}
