// src/answers/controller.ts
import { JsonController, Get, Param } from "routing-controllers";
import Chat from "./entities";
// import answersById, { Answer } from "./data";

@JsonController()
export default class ChatController {
  //   @Get("/chats/:id")
  //   getChat(@Param("id") id:number) {
  //     return Chat.findOne(id);
  //   }

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
}
