export default function getSearchParams(params) {
  let searchParams = ''
  if (params?.tags) {
    searchParams += '&tags=' + params.tags
  }
  if (params?.primary_url) {
    searchParams += '&primary_url=' + params.primary_url
  }
  return searchParams
}
