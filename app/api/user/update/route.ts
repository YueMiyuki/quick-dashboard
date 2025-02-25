import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

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

    if (newUsername) {
      const existingUser = await prisma.user.findUnique({
        where: { username: newUsername },
      })

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json({ message: "Username already taken" }, { status: 400 })
      }

      updates.username = newUsername
    }

    if (newPassword) {
      updates.password = await hash(newPassword, 12)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updates,
    })

    return NextResponse.json({ message: "User settings updated successfully" })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ message: "Failed to update user settings" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

