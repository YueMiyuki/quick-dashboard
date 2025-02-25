"use client"

import { Button } from "@/components/ui/button"
import { CircleUserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function UserSettingsButton() {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <Button
      variant="ghost"
      onClick={() => router.push("/settings")}
      className="flex items-center gap-2"
    >
      <CircleUserRound className="h-5 w-5" />
      <span className="sr-only">User Settings</span>
      {session.user.username && (
        <span className="hidden sm:inline">{session.user.username}</span>
      )}
    </Button>
  )
}