import type { LayoutHandler } from 'sonik'

const handler: LayoutHandler = (children) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Sonik + htmx</title>
      </head>
      <body>
        <div class="p-4">
          <h1 class="text-4xl font-bold mb-4">
            <a href="/">Todo</a>
          </h1>
          {children}
        </div>
      </body>
    </html>
  )
}

export default handler
