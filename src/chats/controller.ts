// src/answers/controller.ts
import { JsonController, Get, Param } from "routing-controllers";
import Chat from "./entities";
// import answersById, { Answer } from "./data";

@JsonController()
export default class ChatController {
  @Get("/chats/:id")
  getChat(@Param("id") id: number) {
    return Chat.findOne(id);
  } //returns a promise so it sais 'not found"

  @Get("/chat")
  async allChats() {
    const chats = await Chat.find();
    return { chats };
  }
}
