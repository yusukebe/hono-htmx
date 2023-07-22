export const AddTodo = () => (
  <form hx-post="/todo" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" class="mb-4">
    <div class="mb-2">
      <input name="title" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" />
    </div>
    <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
)

export const Item = ({ title, id }: { title: string; id: string }) => (
  <p
    hx-delete={`/todo/${id}`}
    hx-swap="outerHTML"
    class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2"
  >
    {title}
    <button class="font-medium">Delete</button>
  </p>
)
