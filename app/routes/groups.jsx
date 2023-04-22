import { useState } from 'react'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData, useSubmit } from '@remix-run/react'

import TagsCloud from '../components/TagsCloud'
import { fetchGet } from '../utils/fetcher'
import getSearchParams from '../utils/getSearchParams'

export let meta = () => {
  return [{ title: 'Open Groups Hub' }]
}

let tagsData = [
  { value: 'sustainable', count: 25 },
  { value: 'recycle', count: 18 },
  { value: 'regenerative', count: 38 },
  { value: 'renewable', count: 30 },
  { value: 'solar', count: 28 },
  { value: 'Mutual Credit', count: 25 },
  { value: 'Open Data', count: 33 },
  { value: 'mutual aid', count: 20 },
  { value: 'Open Source', count: 22 },
  { value: 'wind power', count: 2 },
  { value: 'biodynamic', count: 25 },
  { value: 'ecodesign', count: 15 },
  { value: 'sustainable development', count: 17 },
  { value: 'resource recovery', count: 27 },
  { value: 'Organic', count: 30 },
  { value: 'rainforest', count: 15 },
  { value: 'Fair Trade', count: 30 },
  { value: 'Living systems', count: 11 }
]

export async function action({ request }) {
  let formData = await request.formData()
  let { _action, ...values } = Object.fromEntries(formData)
  if (_action === 'search') {
    let searchParams = getSearchParams(values)
    return redirect(`/groups?${searchParams}`)
  }
  return null
}

export async function loader({ request }) {
  try {
    let url = new URL(request.url)
    let params = {}
    for (let param of url.searchParams.entries()) {
      params[param[0]] = param[1]
    }

    if (!!params.tags === false) return null

    let searchParams = getSearchParams(params)
    let response = await fetchGet(
      `${process.env.PUBLIC_INDEX_URL}/nodes?${searchParams}&schema=${process.env.PUBLIC_GROUPS_SCHEMA}`
    )

    let nodes = await response.json()

    if (!response.ok) {
      if (response.status === 400) {
        return json({
          params: params,
          message: nodes.errors?.[0].detail,
          success: false
        })
      }

      return new Response('Node list loading error', {
        status: response.status
      })
    }

    // TODO: fetch profile data from each node inside a Promise.all
    nodes.data.map(node => {
      console.log('fetch =>', node.profile_url)
      return null
    })

    return json({
      nodes: nodes,
      params: params
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export default function Index() {
  let loaderData = useLoaderData()
  let nodes = loaderData?.nodes?.data
  let tag = loaderData?.params?.tags
  let [viewTags, setViewTags] = useState(nodes ? false : true)
  let [tagSelected, setTagSelected] = useState(tag ? tag : '')
  let submit = useSubmit()

  function handleTagClick(tag) {
    let formData = new FormData()
    formData.append('_action', 'search')
    formData.append('tags', tag.value)
    submit(formData, { method: 'post' })
    setTagSelected(tag.value)
    setViewTags(false)
  }

  function handleTagView() {
    let formData = new FormData()
    formData.append('_action', 'search')
    submit(formData, { method: 'post' })
    setViewTags(!viewTags)
    if (viewTags === false) {
      setTagSelected('')
    }
  }

  return (
    <div className="mt-2 flex flex-col items-center justify-center gap-2 md:mt-8 md:gap-8">
      <div className="flex justify-center gap-4 md:gap-8">
        <div className="w-20 rounded-lg bg-stone-500 p-2 text-center text-lg text-stone-50 shadow-xl dark:bg-stone-600 md:w-32 md:p-4 md:text-3xl">
          Groups
        </div>
        <Link to="/needs">
          <div className="w-20 rounded-lg bg-stone-300 p-2 text-center text-lg shadow-xl hover:scale-105 active:scale-90 active:shadow-md dark:bg-stone-400 dark:text-stone-800 md:w-32 md:p-4 md:text-3xl">
            Needs
          </div>
        </Link>
      </div>
      <div className="m-2 max-w-screen-xl justify-center rounded-md bg-stone-200 p-4 shadow-md dark:bg-stone-700 md:m-0">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {viewTags && (
            <div className="text-center text-base italic text-stone-900 dark:text-stone-50 md:text-xl">
              Select a tag
            </div>
          )}
          {!viewTags && (
            <button
              className="w-14 rounded-lg bg-stone-300 px-2 py-1 text-center text-xs hover:scale-105 active:scale-90 dark:bg-stone-400 dark:text-stone-950 md:w-24 md:px-4 md:py-2 md:text-base"
              onClick={() => handleTagView()}
            >
              Reset
            </button>
          )}
        </div>
        {viewTags && (
          <TagsCloud
            minSize={14}
            maxSize={48}
            tags={tagsData}
            handleTagClick={handleTagClick}
          />
        )}
        {tagSelected && (
          <div className="pt-2 text-center text-lg font-bold text-teal-800 dark:text-teal-500 md:pt-4 md:text-2xl">
            {tagSelected}
          </div>
        )}
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        {!viewTags && nodes?.length > 0
          ? nodes.map((node, index) => {
              return (
                <div key={index} className="py-2 md:py-4">
                  <div className="flex flex-col justify-between bg-white p-4 shadow-lg dark:bg-black">
                    <div className="flex">
                      <img
                        className="h-24 flex-none md:w-36 lg:h-auto"
                        src={node?.image}
                        alt={node?.name}
                      />
                      <div className="flex flex-col px-4 md:px-8">
                        <div className="text-xl font-bold text-stone-900 dark:text-stone-200 md:text-3xl">
                          {node?.name}
                        </div>
                        <a
                          className="mb-2 text-sm text-blue-700 dark:text-blue-500 md:text-lg"
                          href={`https://${node?.primary_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {node?.primary_url}
                        </a>
                        <div className="text-xs font-bold text-stone-400 dark:text-stone-500 md:text-base">
                          {node?.geographic_scope?.toLocaleUpperCase()}
                        </div>
                        <div className="font-italic text-xs text-stone-600 dark:text-stone-400 md:text-base">
                          {node?.locality}
                          {node?.locality && node?.country_name
                            ? ','
                            : null}{' '}
                          {node?.country_name}
                        </div>
                      </div>
                    </div>
                    <div className="my-2 text-sm text-stone-900 dark:text-stone-200 md:my-4 md:text-base md:text-lg">
                      {node?.description}
                    </div>
                    <div className="flex flex-wrap items-center">
                      {node?.tags.map((tag, index) => {
                        return (
                          <div
                            key={index}
                            className="m-1 rounded-3xl bg-teal-800 px-2 py-1 text-xs text-stone-50 dark:bg-teal-700 md:m-2 md:px-4 md:py-2 md:text-base"
                          >
                            {tag}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-2 text-right text-xs text-stone-400 dark:text-stone-500 md:mt-4 md:text-base">
                      Last Updated:{' '}
                      {new Date(node?.last_updated * 1000)
                        .toISOString()
                        .replace(/T.+/, '')}
                    </div>
                  </div>
                </div>
              )
            })
          : !viewTags && (
              <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
                No results
              </div>
            )}
      </div>
    </div>
  )
}
