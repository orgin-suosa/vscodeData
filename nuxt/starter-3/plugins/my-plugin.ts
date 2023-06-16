export default defineNuxtPlugin(() => {
    addRouteMiddleware('global-middleware', (to, from) => {
        console.log('global middleware that runs on every route change')
      },
      { global: false }
    )
  })
  