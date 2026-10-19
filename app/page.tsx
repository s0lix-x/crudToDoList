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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    }

    setTodos(todos.concat(newTodo))
    setInput("")
  }

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            id: todo.id,
            text: todo.text,
            completed: !todo.completed,
          }
        }
        return todo
      })
    )
  }

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const handleSaveEdit = (id: number) => {
    if (!editText.trim()) return
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            id: todo.id,
            text: editText.trim(),
            completed: todo.completed,
          }
        }
        return todo
      })
    )
    setEditingId(null)
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
              placeholder="Tulis tugas baru..."
            />
            <Button type="submit">Tambah</Button>
          </form>

          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Belum ada tugas.
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-2 border p-2"
                >
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                      <Button
                        size="xs"
                        onClick={() => handleSaveEdit(todo.id)}
                      >
                        Simpan
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Batal
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => handleToggle(todo.id)}
                        />
                        <span
                          className={`text-sm ${
                            todo.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleStartEdit(todo)}
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
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
