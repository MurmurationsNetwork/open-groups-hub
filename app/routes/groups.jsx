import { useState } from 'react'
import { json, redirect } from '@remix-run/node'
import {
  Link,
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

    return redirect(`/groups?${searchParams}`)
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
      `${process.env.PUBLIC_INDEX_URL}/nodes?schema=${process.env.PUBLIC_GROUPS_SCHEMA}&status=posted&page_size=500`
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
    `${process.env.PUBLIC_INDEX_URL}/nodes?${searchParams}&schema=${process.env.PUBLIC_GROUPS_SCHEMA}&status=posted&page_size=500`
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

        let needsResp = await fetchGet(
          `${process.env.PUBLIC_INDEX_URL}/nodes?schema=${process.env.PUBLIC_GROUPS_NEEDS_SCHEMA}&primary_url=${node.primary_url}&status=posted&page_size=500`
        )

        if (!needsResp.ok) {
          throw new Response(`Needs list loading error at ${response.url}`, {
            status: response.status,
            statusText: response.statusText
          })
        }

        let needsList = await needsResp.json()

        // Add needs total for node to payload, if any
        if (needsList.data.length > 0) {
          payload.needs = needsList.data.length
        }

        // Add data from Index
        payload.last_updated = node.last_updated
        payload.profile_url = node.profile_url

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

export default function Groups() {
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
            {navigation.state === 'idle' ? (
              <>
                <div className="pb-2 text-center text-lg font-bold text-teal-800 dark:text-teal-500 md:pb-4 md:text-2xl">
                  {tagSelected}
                </div>
                <button
                  className="mb-2 w-14 rounded-lg bg-stone-300 px-2 py-1 text-center text-xs hover:scale-105 active:scale-90 dark:bg-stone-400 dark:text-stone-950 md:mb-4 md:w-24 md:px-4 md:py-2 md:text-base"
                  onClick={() => handleTagView()}
                >
                  Reset
                </button>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        )}
        {/* Show the tag cloud if there is no tag selected */}
        {!tagSelected && (
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div>
              <div className="text-center text-base italic text-stone-900 dark:text-stone-50 md:text-xl">
                {navigation.state === 'idle' ? 'Select a tag' : 'Loading...'}
              </div>
              {navigation.state === 'idle' && (
                <TagsCloud
                  minSize={14}
                  maxSize={48}
                  tags={tagsData || []}
                  handleTagClick={handleTagClick}
                />
              )}
              <div className="text-center text-base italic text-stone-900 dark:text-stone-50 md:text-xl">
                {navigation.state === 'idle' && totalNodes > 0 && (
                  <span>(number of groups: {totalNodes})</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        {/* Show the list of nodes if there are any */}
        {navigation.state === 'idle' && nodes?.length > 0 ? (
          nodes.map((node, index) => {
            return (
              <div key={index} className="py-2 md:py-4">
                <div className="flex flex-col justify-between bg-white p-4 shadow-lg dark:bg-black md:p-8">
                  <div className="flex flex-wrap">
                    {node?.image && (
                      <div className="pr-4 md:pr-8">
                        <img
                          className="mb-2 h-24 md:h-36"
                          src={node?.image}
                          alt={node?.name}
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="text-xl font-bold text-stone-900 dark:text-stone-200 md:text-3xl">
                        {node?.name}
                      </div>
                      <span>
                        {' '}
                        <a
                          className="mb-2 text-sm font-bold text-blue-700 dark:text-blue-500 md:text-lg"
                          href={`https://${node?.primary_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {node?.primary_url}
                        </a>{' '}
                        {node?.needs > 0 && (
                          <Link to={`/needs?primary_url=${node?.primary_url}`}>
                            <button className="mx-2 animate-pulse rounded-sm bg-teal-500 px-2 py-1 text-xs font-bold text-stone-50 hover:scale-90 active:scale-105 dark:bg-teal-800 md:mx-4 md:px-4 md:py-2 md:text-base">
                              {node?.needs}{' '}
                              {node?.needs === 1 ? 'need' : 'needs'}
                            </button>
                          </Link>
                        )}
                      </span>
                      <div className="text-xs font-bold text-stone-400 dark:text-stone-500 md:text-base">
                        {node?.geographic_scope?.toLocaleUpperCase()}
                      </div>
                      <div className="font-italic text-xs text-stone-600 dark:text-stone-400 md:text-base">
                        {node?.locality}
                        {node?.locality && node?.country_name ? ',' : null}{' '}
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
                        <button
                          key={index}
                          className="m-1 rounded-3xl bg-teal-800 px-2 py-1 text-xs text-stone-50 hover:scale-90 active:scale-105 dark:bg-teal-700 md:m-2 md:px-4 md:py-2 md:text-base"
                          onClick={() => handleTagClick({ value: tag })}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex justify-between">
                    <div className="mt-2 text-xs text-stone-400 dark:text-stone-500 md:mt-4 md:text-base">
                      Source:{' '}
                      <a
                        className="mb-2 text-blue-700 dark:text-blue-500"
                        href={`${node?.profile_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {node?.profile_url
                          .replace(/(^\w+:|^)\/\//, '')
                          .replace(/\/.+/, '')}
                      </a>
                    </div>
                    <div className="mt-2 text-xs text-stone-400 dark:text-stone-500 md:mt-4 md:text-base">
                      Last Updated:{' '}
                      {new Date(node?.last_updated * 1000)
                        .toISOString()
                        .replace(/T.+/, '')}
                    </div>
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
  return HandleError(error, 'groups')
}
