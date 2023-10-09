import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { renderer, AddTodo, Item } from './components'

type Bindings = {
  DB: D1Database
}

type Todo = {
  title: string
  id: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('*', renderer)

app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(`SELECT id, title FROM todo;`).all<Todo>()
  const todos = results
  return c.render(
    <div>
      <AddTodo />
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id} />
      })}
      <div id="todo"></div>
    </div>
  )
})

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

export default app
