import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_KEY || !process.env.STREAM_SECRET) {
  throw new Error("Stream keys not implimented");
}

export const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY,
  process.env.STREAM_SECRET
);
