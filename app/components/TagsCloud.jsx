import { useEffect, useState } from 'react'
import { TagCloud } from 'react-tagcloud'

export default function TagsCloud({ minSize, maxSize, tags, handleTagClick }) {
  let [mobile, setMobile] = useState(false)

  useEffect(() => {
    if (document?.documentElement.clientWidth < 640) {
      setMobile(true)
    }
  }, [])
  return (
    <TagCloud
      minSize={mobile ? minSize / 1.75 : minSize}
      maxSize={mobile ? maxSize / 1.75 : maxSize}
      tags={tags}
      colorOptions={{
        luminosity: 'dark',
        hue: 'blue'
      }}
      onClick={tag => handleTagClick(tag)}
    />
  )
}
