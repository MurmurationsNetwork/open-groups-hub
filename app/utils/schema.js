import { fetchGet } from './fetcher'

export async function loadSchema() {
  let response = await fetchGet(process.env.PUBLIC_LIBRARY_URL)
  if (!response.ok) {
    throw new Response('Schema list loading error', {
      status: response.status
    })
  }
  let schema = await response.json()
  return schema.data
    .filter(s => {
      return s.name.startsWith('projects_schema-v0.1.0')
    })
    .filter(s => {
      return s.name.startsWith('offers_wants_prototype-v0.0.2')
    })
}
