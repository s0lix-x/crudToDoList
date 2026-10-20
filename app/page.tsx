"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Todo {
  id: number
  text: string
  completed: boolean
}

const API_URL = "/api/todos"

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")
  const [editId, setEditId] = useState<number | null>(null)

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      if (Array.isArray(data)) {
        setTodos(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const textVal = input.trim()
    if (!textVal) return

    if (editId !== null) {
      const targetId = editId
      setTodos((prev) =>
        prev.map((t) => (t.id === targetId ? { ...t, text: textVal } : t))
      )
      setEditId(null)
      setInput("")

      await fetch(`${API_URL}/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textVal }),
      })
    } else {
      const tempId = Date.now()
      const optimisticTodo: Todo = {
        id: tempId,
        text: textVal,
        completed: false,
      }
      setTodos((prev) => [optimisticTodo, ...prev])
      setInput("")

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textVal }),
        })
        const saved = await res.json()
        if (saved && saved.id) {
          setTodos((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: saved.id } : t))
          )
        }
      } catch (err) {
        setTodos((prev) => prev.filter((t) => t.id !== tempId))
      }
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id)
    setInput(todo.text)
  }

  const handleCancel = () => {
    setEditId(null)
    setInput("")
  }

  const handleToggle = async (todo: Todo) => {
    const nextCompleted = !todo.completed
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: nextCompleted } : t))
    )

    await fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: nextCompleted }),
    })
  }

  const handleDelete = async (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    if (editId === id) {
      handleCancel()
    }

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ToDo List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis tugas..."
            />
            <Button type="submit">
              {editId !== null ? "Update" : "Tambah"}
            </Button>
            {editId !== null && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Batal
              </Button>
            )}
          </form>

          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggle(todo)}
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
                <div className="flex items-center gap-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
