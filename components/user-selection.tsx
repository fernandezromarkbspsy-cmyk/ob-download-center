"use client"

import { useUsers, User } from "@/lib/users-context"
import { useChat } from "@/lib/chat-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface UserSelectionProps {
  onUserSelect: (user: User) => void
}

/**
 * Renders a list of users that can be selected to start a new chat.
 * It handles loading and error states for the user list.
 */
export function UserSelection({ onUserSelect }: UserSelectionProps) {
  const { users, isLoading, error } = useUsers()
  const { createOrSelectConversation } = useChat()

  const handleSelectUser = (user: User) => {
    createOrSelectConversation(user.id)
    onUserSelect(user) // Notify parent to switch view
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">New Message</h2>
        {/* Skeleton loaders for a better UX */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>Could not load users. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">New Message</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="flex items-center p-2 rounded-lg hover:bg-muted cursor-pointer"
            >
              <div className="relative mr-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar_url || ""} alt={user.full_name} />
                  <AvatarFallback>
                    {user.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.is_active && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {user.employee_id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}