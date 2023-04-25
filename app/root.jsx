import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation
} from '@remix-run/react'

import styles from './tailwind.css'

export let links = () => [{ rel: 'stylesheet', href: styles }]

export default function App() {
  let { pathname } = useLocation()
  console.log('location', pathname)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-50">
        <div className="mt-2 flex flex-col items-center justify-center gap-2 md:mt-8 md:gap-8">
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
