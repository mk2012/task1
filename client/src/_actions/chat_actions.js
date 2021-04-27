import axios from "axios";
import { GET_CHATS } from "./types";
import { CHAT_SERVER } from "../components/Config.js";

export function getChats() {
  const id = localStorage.getItem("userId");
  const request = axios
    .get(`${CHAT_SERVER}/getchat?userId=${id}`)
    .then((response) => response.data);

  return {
    type: GET_CHATS,
    payload: request,
  };
}
