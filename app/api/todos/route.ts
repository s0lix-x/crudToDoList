import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM todos ORDER BY id DESC")
    const todos = (rows as any[]).map((t) => ({
      ...t,
      completed: Boolean(t.completed),
    }))
    return NextResponse.json(todos)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 })
    }

    const [result]: any = await db.query(
      "INSERT INTO todos (text, completed) VALUES (?, false)",
      [text]
    )

    return NextResponse.json({
      id: result.insertId,
      text,
      completed: false,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
