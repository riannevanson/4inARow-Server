// src/answers/controller.ts
import {
  JsonController,
  Get,
  Param,
  Post,
  HttpCode,
  Body
} from "routing-controllers";
import Chat from "./entities";
// import User from "../users/entity";

@JsonController()
export default class ChatController {
  @Get("/chats/:id")
  getChat(@Param("id") id: number) {
    return Chat.findOneById(id);
  }

  //   @Get("/chats/:id")
  //   getChat(@Param("id") id) {
  //     console.log(id, "id");
  //     return Chat.findOneById(id);
  //   }

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
}
