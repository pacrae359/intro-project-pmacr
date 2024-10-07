//Database connection file
const sqlite = require( "sqlite3" ).verbose()
const db = new sqlite.Database( "database.db", ( err ) => {
  if( err ) {
    console.error( "There was an error when connecting to the database: ", err )
  } else {
    console.log( "Successfully connected to the database." )
  }
} )

/**
 * This functions is used to get the list of preexisting rows in the people table of the database.
 * @returns {Promise<Array<object>>}
 */
function getPeople() {
  return new Promise( ( res,rej ) =>{
    // This runs the sql command against the database.
    db.all( "SELECT * FROM people",( err,rows ) => {
    // If successful return the rows, if not return the error.
      if( err ) {
        rej( err )
      } else {
        res( rows )
      }
    } )
  } )
}

/**
 * This functions is used to get a preexisting row in the people table of the database.
 * @returns {Promise<object>}
 */
function getPersonViaID( id ) {
  return new Promise( ( res,rej )=>{
    // This runs the sql command against the database.
    db.all( "SELECT * FROM people WHERE id=?",[id],( err,row ) => {
      // If successful return the row, if not return the error.
      if( err ) {
        rej( err )
      } else {
        res( row )
      }
    } )
  } )
}

/**
 * This function adds a new row to the people table when given a name, email and notes.
 * The id in the people table autoincrements so an id is not a necessary argument.
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @returns {Promise<object>}
 */

async function addPerson( name, email, notes ) {
  const sql = "INSERT INTO people (name,email,notes) VALUES (?,?,?)"
  return new Promise( ( res,rej ) => {
    // This runs the sql command against the database.
    db.run( sql,[name,email,notes], ( err, row ) => {
      // If successful return the row, if not return the error.
      if( err ) {
        if( err.code === "SQLITE_CONSTRAINT" ){
          rej({message: "This email already exists!", code: "SQL_CONSTRAINT"})
        }
        rej( err )
      } else {
        res( row )
      }
    } )
  } )
}

/**
 * This function is for updating a row in the people table with new information at a given id.
 * @param {number} id
 * @param {string} name
 * @param {string} email
 * @param {string} notes
 * @returns {Promise<object>}
 */
async function editPerson( id, name, email, notes, prevemail ) {
  let sql
  if( prevemail === email ) {
    sql = "UPDATE people SET name=?, notes=? WHERE id=?"
    return new Promise( ( res,rej ) => {
      // This runs the sql command against the database.
      db.run( sql,[name,notes,id], ( err,row )=>{
        // If successful return the row, if not return the error.
        if( err ) {
          rej( err )
        } else {
          res( row )
        }
      } )
    } )
  } else {
    sql = "UPDATE people SET name=?, email=?, notes=? WHERE id=?"
    return new Promise( ( res,rej ) => {
      // This runs the sql command against the database.
      db.run( sql,[name,email,notes,id], ( err,row )=>{
        // If successful return the row, if not return the error.
        if( err ) {
          if( err.code === "SQLITE_CONSTRAINT" ){
            rej({message: "This email already exists!", code: "SQL_CONSTRAINT"})
          }
          rej( err )
        } else {
          res( row )
        }
      } )
    } )
  }
}

/**
 * This function is for the deletion of a row from the people table based on a given id
 * @param {number} id
 * @returns {Promise<object>}
 */
async function deletePerson( id ) {
  const sql = ( "DELETE FROM people WHERE id=?" )
  return new Promise( ( res,rej ) => {
    // This runs the sql command against the database.
    db.run( sql, id, ( err,row ) => {
      // If successful return the row, if not return the error.
      if( err ) {
        rej( err )
      } else {
        res( row )
      }
    } )
  } )
}

module.exports = {
  deletePerson,
  editPerson,
  addPerson,
  getPeople,
  getPersonViaID
}