const db = require( "./db" )

/**
 * @typedef { Object } person
 * @property { number } id
 * @property { string } name - The name of the person.
 * @property { string } email - The email address of the person.
 * @property { string } [ notes ] - Additional notes about the person (optional).
 */

/**
 * Demo function to return an array of people objects
 * //@param { URL } parsedurl
 * @returns { Promise< Array< person > > }
 */
async function get( /*parsedurl*/ ) {
  try {
    const people = await db.getPeople()
    return people
  } catch ( err ) {
    console.error( "Error when getting people data:", err )
    throw ( err )
  }
}

async function edit( parsedurl, method, id, name, email, notes ) {
  try {
    const people = await db.editPerson( id, name, email, notes )
    return people
  } catch ( err ) {
    console.error( "Error editing person: ", err )
  }
}

async function getViaID( parsedurl, method, id ) {
  try {
    const person = await db.getPersonViaID( id )
    return person
  } catch ( err ) {
    console.error( 'Error getting person with id: ${id}', err )
  }
}

async function remove( parsedurl, method, id, name ) {
  try {
    const people = await db.deletePerson( id )
    return people
  } catch ( err ) {
    console.error( 'Error when removing person: ${id}', err )
  }
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add( parsedurl, method, person ) {
  try {
    const people = await db.addPerson( person.name,person.email,person.notes )
    return people
  } catch ( err ) {
    console.error( "Error adding person: ", err )
  }
}

module.exports = {
  get,
  add,
  edit,
  getViaID,
  remove
}