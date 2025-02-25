"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserSettingsButton() {
  const router = useRouter()

  return (
    <Button variant="ghost" size="icon" onClick={() => router.push("/settings")} title="User Settings">
      <Settings className="h-5 w-5" />
      <span className="sr-only">User Settings</span>
    </Button>
  )
}

