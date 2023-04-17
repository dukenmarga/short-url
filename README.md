# short url

## Demo
See the demo: [https://short-it-vcys.onrender.com/](https://short-it-vcys.onrender.com/)

Demo link might take a while to spin up after a long hibernate.

## Function
The app will take long url and shorten it into several urls. It uses open API [https://shrtco.de/](https://shrtco.de/).

## Decription

This is a simple demo using technology below:
- [SvelteKit](https://kit.svelte.dev/)
  - [API route made using Sveltekit (+server.ts)](https://kit.svelte.dev/docs/routing#server) to call external API from shrtco.de
  - [Page (+page.svelte)](https://kit.svelte.dev/docs/routing#page) to show text input and to show the shorten URLs
  - [Typescript](https://www.typescriptlang.org/)
- [PouchDB](https://pouchdb.com/) (offline in browser database) to store the history of converted urls
- [Bulma CSS](https://bulma.io/)
- Deployment to [Render](https://render.com)
