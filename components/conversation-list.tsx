"use client"

import { useChat } from "@/lib/chat-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface ConversationListProps {
  onSelectConversation: () => void
}

/**
 * Renders a list of active conversations.
 * It displays the recipient's avatar, name, and active status.
 */
export function ConversationList({
  onSelectConversation,
}: ConversationListProps) {
  const { conversations, isLoading, error, setActiveConversation } = useChat()

  const handleSelect = (conversationId: string) => {
    const selected = conversations.find(c => c.id === conversationId)
    if (selected) {
      setActiveConversation(selected)
      onSelectConversation()
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {conversations.map(convo => (
          <div
            key={convo.id}
            onClick={() => handleSelect(convo.id)}
            className="flex items-center p-2 rounded-lg hover:bg-muted cursor-pointer"
          >
            <div className="relative mr-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={convo.recipient_avatar_url || ""}
                  alt={convo.recipient_full_name}
                />
                <AvatarFallback>
                  {convo.recipient_full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {convo.recipient_is_active && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>
            <p className="font-semibold">{convo.recipient_full_name}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}