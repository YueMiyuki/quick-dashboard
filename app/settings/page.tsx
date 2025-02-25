"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SettingsPage() {
  const [currentUsername, setCurrentUsername] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { data: session, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.username) {
      setCurrentUsername(session.user.username)
      setNewUsername(session.user.username)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push("/")
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newUsername: newUsername !== currentUsername ? newUsername : undefined,
          newPassword: newPassword || undefined
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success("Settings updated successfully")
        if (newUsername !== currentUsername) {
          await update({ username: newUsername })
        }
        router.push("/dashboard")
      } else {
        toast.error(data.message || "Failed to update settings")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while updating settings")
    }
  }

  if (!session) {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Current username: {currentUsername}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden dummy fields to prevent autofill */}
        <input type="text" name="fakeusername" className="hidden" />
        <input type="password" name="fakepassword" className="hidden" />

        <div>
          <Label htmlFor="newUsername">New Username</Label>
          <Input
            id="newUsername"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoComplete="new-username"
            placeholder="Enter new username"
            minLength={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword">New Password (leave blank to keep current)</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter new password"
          />
        </div>

        {newPassword && (
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Confirm new password"
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          Update Settings
        </Button>
      </form>
    </div>
  )
}