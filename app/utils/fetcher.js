export async function fetchGet(url) {
  return fetch(url).catch(err => {
    throw new Response(`fetchGet error: ${err}`, {
      status: 500
    })
  })
}
