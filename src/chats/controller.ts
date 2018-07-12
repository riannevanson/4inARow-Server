// src/answers/controller.ts
import { JsonController, Get, Param } from "routing-controllers";
import Chat from "./entities";
// import answersById, { Answer } from "./data";

@JsonController()
export default class ChatController {
<<<<<<< HEAD
  @Get("/chats/:id")
  getChat(@Param("id") id) {
    return Chat.findOne(id);
  } //returns a promise so it sais 'not found"
=======
  //   @Get("/chats/:id")
  //   getChat(@Param("id") id:number) {
  //     return Chat.findOne(id);
  //   }
>>>>>>> 021f389d2e5fa5c88581785bb8b33c318dfeceae

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
