import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import path from "path"
import { unlink } from "fs/promises"

export async function DELETE(
  req: Request,
  context: { params: { [key: string]: string | string[] } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = context.params

  if (typeof id !== "string") {
    return NextResponse.json(
      { error: "Invalid file ID format" },
      { status: 400 }
    )
  }

  try {
    const file = await prisma.file.findUnique({
      where: { id: id },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), "public", file.path)
    await unlink(filePath)

    await prisma.file.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}