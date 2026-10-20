import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { text, completed } = await req.json()

    if (text !== undefined) {
      await db.query(
        "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
        [text, completed, id]
      )
    } else {
      await db.query("UPDATE todos SET completed = ? WHERE id = ?", [
        completed,
        id,
      ])
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.query("DELETE FROM todos WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
