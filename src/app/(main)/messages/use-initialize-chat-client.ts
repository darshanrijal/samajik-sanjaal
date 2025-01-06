import { trpc } from "@/__rpc/react";
import { useSession } from "@/hooks/use-session";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const getTokenPromise = trpc.stream.getToken.useQuery().promise;
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STREAM_KEY) {
      return;
    }
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY);

    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () => await getTokenPromise.then((data) => data.token)
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [
    user.id,
    user.username,
    user.displayName,
    user.avatarUrl,
    getTokenPromise,
  ]);

  return chatClient;
}
