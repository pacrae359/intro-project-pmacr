
import { getdata, putdata, deletedata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

document.addEventListener( "DOMContentLoaded", async function() {
  document.getElementById( "addperson" ).addEventListener( "click", addpersoninput )
  await gopeople()
} )


/**
 *
 * @returns { Promise< object > }
 */
async function fetchpeople() {
  return await getdata( "people" )
}

/**
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @returns { Promise< object > }
 */
async function addperson( name, email, notes ) {
  await putdata( "people", { name, email, notes } )
}

/**
 *
 * @param { number } id
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @param { string } prevemail
 */
async function updateperson( id, name, email, notes , prevemail ) {
  await putdata( "people", { id, name, email, notes , prevemail} )
}

/**
 * @returns { Promise }
 */
async function gopeople() {
  const p = await fetchpeople()
  cleartablerows( "peopletable" )

  for( const pi in p ) {
    addpersondom( p[ pi ] )
  }
}

/**
 *
 */
function addpersoninput() {
  clearform( "personform" )
  showform( "personform", async () => {
    await addperson( getformfieldvalue( "personform-name" ),
      getformfieldvalue( "personform-email" ),
      getformfieldvalue( "personform-notes" ) )
    await gopeople()
  } )
}

/**
 *
 */
function editperson( ev ) {
  clearform( "personform" )
  const personrow = findancestorbytype( ev.target, "tr" )
  setformfieldvalue( "personform-name", personrow.person.name )
  setformfieldvalue( "personform-email", personrow.person.email )
  setformfieldvalue( "personform-notes", personrow.person.notes )

  showform( "personform", async () => {
    // Call update person inside the callback of showform. Get the values of the form fields to use to update the details of the person on form submission.
    try {
      await updateperson(
        personrow.person.id,
        getformfieldvalue( "personform-name" ),
        getformfieldvalue( "personform-email" ),
        getformfieldvalue( "personform-notes" ) ,
        personrow.person.email )
      await gopeople()
    } catch ( err ) {
      console.log( "An error occured when editing: ", err )
    }
  } )
}

/**
 *
 */
async function removeperson( ev ) {
  const personrow = findancestorbytype( ev.target, "tr" )
  const id = personrow.person.id
  const name = personrow.person.name
  const confirmationStr = ( "Are you sure you would like to delete this user: "+ name )
  if( confirm( confirmationStr ) ) {
    await deletedata( "people", { id, name } )
    await gopeople()
  }
}

/**
 *
 * @param { object } person
 */
export function addpersondom( person ) {
  const table = gettablebody( "peopletable" )
  const newrow = table.insertRow()

  const cells = []
  for( let i = 0; i < ( 2 + 7 ); i++ ) {
    cells.push( newrow.insertCell( i ) )
  }

  // @ts-ignore
  newrow.person = person
  cells[ 0 ].innerText = person.name

  const deletebutton = document.createElement( "button" )
  deletebutton.textContent = "Delete Person"
  deletebutton.addEventListener( "click", removeperson )
  deletebutton.className = "deleteButton"
  deletebutton.style.cssText = "float: right;"

  const editbutton = document.createElement( "button" )
  editbutton.textContent = "Edit Person"
  editbutton.addEventListener( "click", editperson )
  editbutton.style.cssText = "float: right;"
  cells[ 8 ].appendChild( deletebutton )
  cells[ 8 ].appendChild( editbutton )
  
}