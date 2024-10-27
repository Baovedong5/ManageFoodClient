import envConfig from "@/config";
import { io } from "socket.io-client";
import { getAccessTokenFromLocalStorage } from "./utils";

const socket = io(envConfig.NEXT_PUBLIC_URL_IMAGE, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
  },
});

export default socket;
