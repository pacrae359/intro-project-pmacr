const rooturl = `${window.location.protocol}//${window.location.host}/api/`

/**
 * Wrapper for all API GET requests
 * @param { string } api
 * @returns { Promise< object > }
 */
/* eslint-disable no-undef */
export async function getdata( api ) {
  try {
    const url = rooturl + api

    const response = await fetch( url )

    if( response.ok ) {
      const data = await response.json()
      return data
    } else {
      throw new Error( `Request failed with status: ${response.status}` )
    }
  } catch ( error ) {
    console.error( "Error fetching data:", error.message )
  }
}

/**
 * TODO check result
 * @param { string } api
 * @param { object } data
 * @returns { Promise }
 */
export async function putdata( api, data ) {
  const request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( data )
  }
  let url
  if( "id" in  data ) {
    url = rooturl + api + "/" + data.id
  } else {
    url = rooturl + api
  }
  const response = await fetch( url, request )
  if( !response.ok ) {
    const conType = response.headers.get( "Content-Type" )

    if( conType && conType.includes( "text/plain" ) ) {
      const err = await response.text()
      alert( err )
    } else {
      const err = await response.json()
      throw new Error( `There was an error when updating data: ${response.status} ${err.error}` )
    }
  }
}
export async function deletedata( api, data ) {
  const request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( data )
  }
  const url = rooturl + api + "/" + data.id
  const response = await fetch( url, request )
  if( !response.ok ) {
    const err = await response.text()
    throw new Error( `There was an error when updating data: ${response.status} ${err}` )
  }
}
/* eslint-enable no-undef */