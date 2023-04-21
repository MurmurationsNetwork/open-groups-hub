import { useEffect, useState } from 'react'
import { TagCloud } from 'react-tagcloud'

export default function TagsCloud({ minSize, maxSize, tags, handleTagClick }) {
  let [mobile, setMobile] = useState(false)
  let [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (document?.documentElement.clientWidth < 640) {
      setMobile(true)
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])
  return (
    <TagCloud
      minSize={mobile ? minSize / 1.75 : minSize}
      maxSize={mobile ? maxSize / 1.75 : maxSize}
      tags={tags}
      colorOptions={{
        luminosity: darkMode ? 'light' : 'dark',
        hue: 'blue'
      }}
      renderer={renderer}
      onClick={tag => handleTagClick(tag)}
    />
  )
}

const renderer = (tag, size, color) => (
  <span
    key={tag.value}
    style={{
      fontSize: `${size}px`,
      margin: '3px',
      padding: '3px',
      display: 'inline-block',
      color: color
    }}
  >
    {tag.value}
  </span>
)
