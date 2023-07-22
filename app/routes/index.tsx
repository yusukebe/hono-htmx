import type { Route } from 'sonik'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

type Bindings = {
  DB: D1Database
}

type Todo = {
  title: string
  id: string
}

const Item = ({ title, id }: { title: string; id: string }) => (
  <p
    hx-delete={`/todo/${id}`}
    hx-swap="outerHTML"
    class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2"
  >
    {title}
    <button class="font-medium">Delete</button>
  </p>
)

export default {
  GET: async (c) => {
    const { results } = await c.env.DB.prepare(`SELECT id, title FROM todo;`).all<Todo>()
    const todos = results as unknown as Todo[] // Currently, should fix a type mismatch.
    return (
      <>
        <form hx-post="/todo" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" class="mb-4">
          <div class="mb-2">
            <input name="title" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" />
          </div>
          <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
            Submit
          </button>
        </form>
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
      return c.body(null, 200)
    })
  }
} satisfies Route<{ Bindings: Bindings }>
