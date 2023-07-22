import type { Route } from 'sonik'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { AddTodo, Item } from '../components'

type Bindings = {
  DB: D1Database
}

type Todo = {
  title: string
  id: string
}

export default {
  GET: async (c) => {
    const { results } = await c.env.DB.prepare(`SELECT id, title FROM todo;`).all<Todo>()
    const todos = results as unknown as Todo[] // Currently, should fix a type mismatch.
    return (
      <>
        <AddTodo />
        {todos.map((todo) => {
          return <Item title={todo.title} id={todo.id} />
        })}
        <div id="todo"></div>
      </>
    )
  },
  APP: (app) => {
    app.post(
      '/todo',
      zValidator(
        'form',
        z.object({
          title: z.string().min(1)
        })
      ),
      async (c) => {
        const { title } = c.req.valid('form')
        const id = crypto.randomUUID()
        await c.env.DB.prepare(`INSERT INTO todo(id, title) VALUES(?, ?);`).bind(id, title).run()
        return c.html(<Item title={title} id={id} />)
      }
    )
    app.delete('/todo/:id', async (c) => {
      const id = c.req.param('id')
      await c.env.DB.prepare(`DELETE FROM todo WHERE id = ?;`).bind(id).run()
      c.status(200)
      return c.body(null)
    })
  }
} satisfies Route<{ Bindings: Bindings }>
