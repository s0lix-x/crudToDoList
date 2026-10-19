"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setTodos(
      todos.concat({
        id: Date.now(),
        text: input.trim(),
        completed: false,
      })
    )
    setInput("")
  }

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          return {
            id: t.id,
            text: t.text,
            completed: !t.completed,
          }
        }
        return t
      })
    )
  }

  const handleDelete = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ToDo List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis tugas..."
            />
            <Button type="submit">Tambah</Button>
          </form>

          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between border p-2"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggle(todo.id)}
                  />
                  <span
                    className={
                      todo.completed
                        ? "line-through text-muted-foreground text-sm"
                        : "text-sm"
                    }
                  >
                    {todo.text}
                  </span>
                </div>
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={() => handleDelete(todo.id)}
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
