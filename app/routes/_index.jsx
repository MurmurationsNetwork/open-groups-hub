import { useState } from 'react'

import TagsCloud from '../components/TagsCloud'

export const meta = () => {
  return [{ title: 'Offers Wants Aggregator' }]
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
        <div className="rounded-lg bg-stone-500 p-2 text-center text-lg text-stone-50 shadow-xl md:p-4 md:text-3xl">
          Projects
        </div>
        <div className="rounded-lg bg-stone-300 p-2 text-center text-lg shadow-xl hover:scale-105 active:scale-90 active:shadow-md md:p-4 md:text-3xl">
          Needs
        </div>
      </div>
      <div className="m-2 max-w-screen-xl justify-center rounded-md bg-stone-100 p-4 shadow-md md:m-0">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <div className="text-center text-base md:text-xl">Search by tag</div>
          <button
            className="w-16 rounded-lg bg-stone-300 px-2 py-1 text-center text-xs hover:scale-105 active:scale-90 md:w-32 md:px-4 md:py-2 md:text-base"
            onClick={() => handleTagView()}
          >
            {viewTags ? 'Hide' : 'Show'}
          </button>
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
    </div>
  )
}
