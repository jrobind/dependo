export default `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>dependo</title>
    <link rel="stylesheet" href="styles/style.css">
  </head>
  <body>
    <main class="app">
      <section class="container">
        <h2 class="container__heading">
          <span><%= it.dependencies %></span>
          dependencies
        </h2>

        <div class="container__dependencies">
        </div>
      </section>
      <section class="container">
        <h2 class="container__heading">
          <span><%= it.devDependencies %></span>
          dev-dependencies
        </h2>

        <div class="container__dependencies">
        </div>
      </section>
    </main>
  </body>
</html>`;
