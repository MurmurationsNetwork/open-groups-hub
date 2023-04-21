import { useState } from 'react'

import TagsCloud from '../components/TagsCloud'

export const meta = () => {
  return [{ title: 'Open Groups Hub' }]
}

const tagsData = [
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

const groupsData = [
  {
    name: 'Murmurations',
    primary_url: 'murmurations.network',
    description:
      'Murmurations is a distributed data sharing network to connect regenerative economy projects and organizations, making them visible to the world and each other. Making movements visible.',
    locality: 'London',
    country_name: 'United Kingdom',
    image:
      'https://murmurations.network/wp-content/uploads/2020/06/murmurations-logo-200.png',
    tags: ['Open Data', 'regenerative', 'Open Source', 'semantic web'],
    geographic_scope: 'international',
    last_updated: 1681054293
  },
  {
    name: 'Open Credit Network',
    primary_url: 'opencredit.network',
    description:
      'Banks have had a monopoly on credit creation for too long. Together we can build a new, democratically governed economy based on trust.',
    locality: 'London',
    country_name: 'United Kingdom',
    image: 'https://trade.opencredit.network/static/img/ocn-logo.svg',
    tags: ['Mutual Credit', 'regenerative'],
    geographic_scope: 'national',
    last_updated: 1611054293
  }
]

export default function Index() {
  let [viewTags, setViewTags] = useState(true)
  let [tagSelected, setTagSelected] = useState('')

  function handleTagClick(tag) {
    setTagSelected(tag.value)
    setViewTags(false)
  }

  function handleTagView() {
    setViewTags(!viewTags)
    if (viewTags === false) {
      setTagSelected('')
    }
  }

  return (
    <div className="mt-2 flex flex-col items-center justify-center gap-2 md:mt-8 md:gap-8">
      <div className="flex justify-center gap-4 md:gap-8">
        <div className="w-20 rounded-lg bg-stone-500 p-2 text-center text-lg text-stone-50 shadow-xl md:w-32 md:p-4 md:text-3xl">
          Groups
        </div>
        <div className="w-20 rounded-lg bg-stone-300 p-2 text-center text-lg shadow-xl hover:scale-105 active:scale-90 active:shadow-md md:w-32 md:p-4 md:text-3xl">
          Needs
        </div>
      </div>
      <div className="m-2 max-w-screen-xl justify-center rounded-md bg-stone-100 p-4 shadow-md md:m-0">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {viewTags && (
            <div className="text-center text-base italic md:text-xl">
              Select a tag
            </div>
          )}
          {!viewTags && (
            <button
              className="w-14 rounded-lg bg-stone-300 px-2 py-1 text-center text-xs hover:scale-105 active:scale-90 md:w-24 md:px-4 md:py-2 md:text-base"
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
          <div className="pt-2 text-center text-lg font-bold text-teal-800 md:pt-4 md:text-2xl">
            {tagSelected}
          </div>
        )}
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        {tagSelected &&
          groupsData.map((group, index) => {
            if (group.tags.includes(tagSelected)) {
              return (
                <div key={index} className="py-2 md:py-4">
                  <div className="flex flex-col justify-between bg-white p-4">
                    <div className="flex">
                      <img
                        className="h-24 flex-none md:w-36 lg:h-auto"
                        src={group.image}
                        alt={group.name}
                      />
                      <div className="flex flex-col px-4 md:px-8">
                        <div className="text-xl font-bold text-stone-900 md:text-3xl">
                          {group.name}
                        </div>
                        <a
                          className="mb-2 text-sm text-blue-700 md:text-lg"
                          href={`https://${group.primary_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {group.primary_url}
                        </a>
                        <div className="text-xs font-bold text-stone-400 md:text-base">
                          {group.geographic_scope.toLocaleUpperCase()}
                        </div>
                        <div className="font-italic text-xs md:text-base">
                          {group.locality}
                          {group.locality && group.country_name
                            ? ','
                            : null}{' '}
                          {group.country_name}
                        </div>
                      </div>
                    </div>
                    <div className="my-2 text-sm text-gray-700 md:my-4 md:text-base md:text-lg">
                      {group.description}
                    </div>
                    <div className="flex flex-wrap items-center">
                      {group.tags.map((tag, index) => {
                        return (
                          <div
                            key={index}
                            className="m-1 rounded-3xl bg-teal-800 px-2 py-1 text-xs text-stone-50 md:m-2 md:px-4 md:py-2 md:text-base"
                          >
                            {tag}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-2 text-right text-xs text-stone-400 md:mt-4 md:text-base">
                      Last Updated:{' '}
                      {new Date(group.last_updated * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            } else {
              return null
              /* return (
                <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
                  No results
                </div>
              ) */
            }
          })}
      </div>
    </div>
  )
}
