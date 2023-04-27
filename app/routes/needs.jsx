import { useState } from 'react'
import { json, redirect } from '@remix-run/node'
import {
  useLoaderData,
  useNavigation,
  useRouteError,
  useSubmit
} from '@remix-run/react'

import HandleError from '../components/HandleError'
import TagsCloud from '../components/TagsCloud'
import { fetchGet } from '../utils/fetcher'
import getSearchParams from '../utils/getSearchParams'

export let meta = () => {
  return [{ title: 'Groups' }]
}

export async function action({ request }) {
  let formData = await request.formData()
  let { _action, ...values } = Object.fromEntries(formData)

  if (_action === 'search') {
    let searchParams = getSearchParams(values)

    return redirect(`/needs?${searchParams}`)
  }

  return null
}

export async function loader({ request }) {
  let url = new URL(request.url)
  let params = {}
  for (let param of url.searchParams.entries()) {
    params[param[0]] = param[1]
  }
  // If there is no tag for searching, load the tag list
  if (!!params.tags === false) {
    let response = await fetchGet(
      `${process.env.PUBLIC_INDEX_URL}/nodes?schema=${process.env.PUBLIC_GROUPS_NEEDS_SCHEMA}&status=posted&page_size=500`
    )

    if (!response.ok) {
      throw new Response(`Tag list loading error at ${response.url}`, {
        status: response.status,
        statusText: response.statusText
      })
    }

    let nodesList = await response.json()

    let tagsData = []
    nodesList.data.map(node => {
      node.tags.map(tag => {
        let tagIndex = tagsData.findIndex(item => item.value === tag)
        if (tagIndex > -1) {
          tagsData[tagIndex].count++
        } else {
          tagsData.push({ value: tag, count: 1 })
        }
        return null
      })
      return null
    })

    return json({
      tagsData: tagsData,
      totalNodes: nodesList.data.length
    })
  }

  // Otherwise fetch nodes from Index that match the tag
  let searchParams = getSearchParams(params)
  let response = await fetchGet(
    `${process.env.PUBLIC_INDEX_URL}/nodes?${searchParams}&schema=${process.env.PUBLIC_GROUPS_NEEDS_SCHEMA}&status=posted&page_size=500`
  )

  if (!response.ok) {
    throw new Response(`Node list loading error at ${response.url}`, {
      status: response.status,
      statusText: response.statusText
    })
  }

  let nodesList = await response.json()

  // Fetch profile data from each node
  let nodes = []
  await Promise.all(
    nodesList.data.map(async node => {
      try {
        let response = await fetchGet(node.profile_url)

        if (!response.ok) {
          console.error(
            `${response.status} error loading profile: ${node.profile_url}`
          )

          return null
        }

        let payload = await response.json()

        // Add last_updated date/time from Index
        payload.last_updated = node.last_updated
        nodes.push(payload)

        return null
      } catch (error) {
        console.error(`Could not load profile: ${node.profile_url}\n`, error)

        return null
      }
    })
  )

  return json({
    nodes: nodes,
    params: params
  })
}

export default function Needs() {
  let loaderData = useLoaderData()
  let navigation = useNavigation()
  let submit = useSubmit()
  let nodes = loaderData?.nodes
  let tag = loaderData?.params?.tags
  let tagsData = loaderData?.tagsData
  let totalNodes = loaderData?.totalNodes
  let [showTags, setShowTags] = useState(nodes ? false : true)
  let [tagSelected, setTagSelected] = useState(tag ? tag : '')

  // handleTagClick() is called when a tag is clicked in the TagsCloud component
  function handleTagClick(tag) {
    let formData = new FormData()
    formData.append('_action', 'search')
    formData.append('tags', tag.value)
    submit(formData, { method: 'post' })
    setTagSelected(tag.value)
    setShowTags(false)
  }

  // handleTagView() is called when the "Reset" button is clicked to clear the tag search
  function handleTagView() {
    let formData = new FormData()
    formData.append('_action', 'search')
    submit(formData, { method: 'post' })
    setShowTags(!showTags)
    if (showTags === false) {
      setTagSelected('')
    }
  }

  return (
    <div className="my-2 flex flex-col items-center justify-center md:my-4">
      <div className="m-2 max-w-screen-xl justify-center rounded-md bg-stone-200 px-4 py-2 shadow-md dark:bg-stone-700 md:m-0 md:m-4 md:px-8">
        {/* Show the selected tag if there is one */}
        {tagSelected && (
          <div className="flex flex-col items-center">
            <div className="pb-2 text-center text-lg font-bold text-teal-800 dark:text-teal-500 md:pb-4 md:text-2xl">
              {tagSelected}
            </div>
            <button
              className="w-14 rounded-lg bg-stone-300 px-2 py-1 text-center text-xs hover:scale-105 active:scale-90 dark:bg-stone-400 dark:text-stone-950 md:w-24 md:px-4 md:py-2 md:text-base"
              onClick={() => handleTagView()}
            >
              Reset
            </button>
            <div className="mt-2 md:mt-4">
              {navigation.state !== 'idle' ? 'Loading...' : ''}
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Show the tag cloud if there is no tag selected */}
          {!tagSelected && (
            <div>
              <div className="text-center text-base italic text-stone-900 dark:text-stone-50 md:text-xl">
                Select a tag
              </div>
              <TagsCloud
                minSize={14}
                maxSize={48}
                tags={tagsData || []}
                handleTagClick={handleTagClick}
              />
              <div className="text-center text-base italic text-stone-900 dark:text-stone-50 md:text-xl">
                {navigation.state === 'idle' && totalNodes > 0 && (
                  <span>(number of needs: {totalNodes})</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        {/* Show the list of nodes if there are any */}
        {nodes?.length > 0 ? (
          nodes.map((node, index) => {
            return (
              <div key={index} className="py-2 md:py-4">
                <div className="flex flex-col justify-between bg-white p-4 shadow-lg dark:bg-black md:p-8">
                  <div className="flex flex-wrap">
                    {node?.image && (
                      <div className="pr-4 md:pr-8">
                        <img
                          className="h-24 flex-none md:h-auto md:w-36"
                          src={node?.image}
                          alt={node?.title}
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="text-xl font-bold text-stone-900 dark:text-stone-200 md:text-3xl">
                        {node?.title}
                      </div>
                      <a
                        className="mb-2 text-sm font-bold text-blue-700 dark:text-blue-500 md:text-lg"
                        href={`https://${node?.primary_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {node?.primary_url}
                      </a>
                      <div className="text-xs text-stone-400 dark:text-stone-500 md:text-base">
                        {node?.geographic_scope && (
                          <span className="font-bold">
                            {node?.geographic_scope?.toLocaleUpperCase()}{' '}
                          </span>
                        )}
                        {node?.geolocation && (
                          <span>
                            (
                            <a
                              className="text-xs text-blue-700 dark:text-blue-500 md:text-base"
                              href={`https://www.openstreetmap.org/?mlat=${node.geolocation.lat}&mlon=${node.geolocation.lon}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              see location
                            </a>
                            )
                          </span>
                        )}
                        {node?.expires_at && (
                          <div className="text-xs text-stone-400 dark:text-stone-500 md:text-sm">
                            Expires:{' '}
                            {new Date(node.expires_at * 1000)
                              .toISOString()
                              .replace(/T.+/, '')}
                          </div>
                        )}
                        {/* {node?.transaction_type && (
                          <span>({node.transaction_type})</span>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className="my-4 text-sm text-stone-900 dark:text-stone-200 md:my-8 md:text-lg">
                    {node?.description}
                  </div>
                  {node?.details_url && (
                    <div className="mb-2 w-72 text-sm text-stone-900 dark:text-stone-200 md:mb-4 md:w-11/12 md:text-base">
                      More details:{' '}
                      <a
                        className="mb-2 block truncate text-blue-700 dark:text-blue-500"
                        href={`${node.details_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {node.details_url}
                      </a>
                    </div>
                  )}
                  <div className="text-sm text-stone-900 dark:text-stone-200 md:text-base">
                    <div>Contact:</div>
                    {node?.contact_details?.email && (
                      <div className="w-72 md:w-11/12">
                        <a
                          className="block truncate text-blue-700 dark:text-blue-500"
                          href={`mailto:${node.contact_details.contact_form}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {node.contact_details.email}
                        </a>
                      </div>
                    )}
                    {node?.contact_details?.contact_form && (
                      <div className="w-72 md:w-11/12">
                        <a
                          className="block truncate text-blue-700 dark:text-blue-500"
                          href={`${node.contact_details.contact_form}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {node.contact_details.contact_form}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="my-4 flex flex-wrap items-center md:my-8">
                    {node?.tags.map((tag, index) => {
                      return (
                        <div
                          key={index}
                          className="m-1 rounded-3xl bg-teal-800 px-2 py-1 text-xs text-stone-50 hover:scale-90 active:scale-105 dark:bg-teal-700 md:m-2 md:px-4 md:py-2 md:text-base"
                          onClick={() => handleTagClick({ value: tag })}
                        >
                          {tag}
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-2 text-right text-xs text-stone-400 dark:text-stone-500 md:mt-4 md:text-sm">
                    Last Updated:{' '}
                    {new Date(node?.last_updated * 1000)
                      .toISOString()
                      .replace(/T.+/, '')}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
            {tagSelected && navigation.state === 'idle' ? 'No results' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return HandleError(error, 'needs')
}
