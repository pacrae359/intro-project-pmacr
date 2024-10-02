
const people = require( "./people" )

/**
 * Check for a valid API url call and handle.
 * @param { URL } parsedurl 
 * @param { object } res
 * @param { object } req
 * @param { object } receivedobj
 */
async function handleapi( parsedurl, res, req, receivedobj ) {

  const pathname = parsedurl.pathname

  const pathparts = pathname.split('/')

  let urlId;
/* Really not sure if theres a better way to do this where I don't write out the individual
  paths myself. Also this doesn't handle if the 4th part of the url isnt a number. 
  While that specifically isn't an issue for now it likely would be for scalability later
  on. */
  if(pathparts.length === 4){
    urlId = pathparts[3]
    urlId = Number(urlId)
    if(Number.isInteger(urlId)){
      if(req.method == "PUT"){
        const result = await people.edit(parsedurl, req.method, receivedobj);
        return result;
      }
      if(req.method == "GET"){
        const result = await people.getViaID(parsedurl, req.method, urlId)
        return result
      }
      if(req.method == "DELETE"){
        const result = await people.remove(parsedurl, req.method, urlId)
        return result
      }
  } else {
    console.error('Invalid ID: Non Integer.');
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('400 - Invalid ID')
  }
  }

  const calls = {
    "/api/people": { "GET": people.get, "PUT": people.add },
    "/api/people/:id": { "PUT": people.edit, "DELETE": people.remove, "GET": people.getViaID}
  }

  if( !( pathname in calls ) || !( req.method in calls[ pathname ] ) ) {
    console.error( "404 file not found: ", pathname )
    res.writeHead( 404, { "Content-Type": "text/plain" })
    res.end( "404 - Not found" )
    return
  }

  const data = await calls[ pathname ][ req.method ]( parsedurl, req.method, receivedobj )

  res.writeHead( 200, { "Content-Type": "application/json" } )
  res.end( JSON.stringify( data ) )
}


module.exports = {
  handleapi
}