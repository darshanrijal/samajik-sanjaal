import { trpc } from "@/__rpc/react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { MailPlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  type ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { NewChatDialog } from "./new-chat-dialog";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
  const { user } = useSession();

  const utils = trpc.useUtils();

  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      utils.stream.getStreamUnreadCount.invalidate();
    }
  }, [channel?.id, utils.stream.getStreamUnreadCount.invalidate]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );
  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden"
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto font-bold text-xl md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
