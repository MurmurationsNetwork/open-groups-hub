import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError
} from '@remix-run/react'

import styles from './tailwind.css'

export let links = () => [{ rel: 'stylesheet', href: styles }]

export default function App() {
  let { pathname } = useLocation()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-50">
        <div className="mt-4 flex flex-col items-center justify-center gap-2 md:mt-8">
          <div className="flex justify-center gap-4 md:gap-8">
            {pathname === '/groups' ? (
              <div className="w-20 rounded-lg bg-stone-500 p-2 text-center text-lg text-stone-50 shadow-xl dark:bg-stone-600 md:w-32 md:p-4 md:text-3xl">
                Groups
              </div>
            ) : (
              <Link to="/groups">
                <div className="w-20 rounded-lg bg-stone-300 p-2 text-center text-lg shadow-xl hover:scale-105 active:scale-90 active:shadow-md dark:bg-stone-400 dark:text-stone-800 md:w-32 md:p-4 md:text-3xl">
                  Groups
                </div>
              </Link>
            )}
            {pathname === '/needs' ? (
              <div className="w-20 rounded-lg bg-stone-500 p-2 text-center text-lg text-stone-50 shadow-xl dark:bg-stone-600 md:w-32 md:p-4 md:text-3xl">
                Needs
              </div>
            ) : (
              <Link to="/needs">
                <div className="w-20 rounded-lg bg-stone-300 p-2 text-center text-lg shadow-xl hover:scale-105 active:scale-90 active:shadow-md dark:bg-stone-400 dark:text-stone-800 md:w-32 md:p-4 md:text-3xl">
                  Needs
                </div>
              </Link>
            )}
          </div>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  let error = useRouteError()
  console.error('root ErrorBoundary', error)

  return (
    <html>
      <head>
        <title>Tools - Fatal Error</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-50">
        <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
          <span className="text-5xl md:text-8xl">😱</span>
          <h1 className="text-md mt-8 font-bold md:mt-16 md:text-3xl">
            A fatal error has occurred and was logged
          </h1>
          <code className="mt-4 text-sm md:mt-8 md:text-lg">
            {error instanceof Error ? error.message : JSON.stringify(error)}
          </code>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
