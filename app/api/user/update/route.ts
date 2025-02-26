import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"
import type { NextAuthOptions } from "next-auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as NextAuthOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { newUsername, newPassword } = await req.json()

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const updates: { username?: string; password?: string } = {}
    let shouldInvalidate = false

    if (newUsername) {
      const existingUser = await prisma.user.findUnique({
        where: { username: newUsername },
      })

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json({ message: "Username already taken" }, { status: 400 })
      }

      updates.username = newUsername
      shouldInvalidate = true
    }

    if (newPassword) {
      updates.password = await hash(newPassword, 12)
      shouldInvalidate = true
    }

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      })
    }

    const response = NextResponse.json({ 
      message: "User settings updated successfully",
      shouldInvalidate
    })

    // Clear session cookie if credentials changed
    if (shouldInvalidate) {
      response.headers.set(
        'Set-Cookie', 
        `next-auth.session-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
      )
    }

    return response

  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ message: "Failed to update user settings" }, { status: 500 })
  }
}