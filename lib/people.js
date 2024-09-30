const db = require("./db")

/**
 * @typedef { Object } person
 * @property { number } id
 * @property { string } name - The name of the person.
 * @property { string } email - The email address of the person.
 * @property { string } [ notes ] - Additional notes about the person (optional).
 */

/**
    * @type { Array< person > }
    */
let people = [];

/**
 * 
 * @returns { Promise< Array<Object> >}
 */
const getDBPersonData = async() => {
  try{
    return new Promise(function(resolve,reject){
      db.all('SELECT * FROM people',(err,rows) => { 
        if (err){
            console.error('There was an error fetching person data.', err) ;
            return reject(err);
        } else {
            console.log('Data fetching...');
            return resolve(rows);
        }
      });
    });
  } catch (err) {
    console.error('There was an error when fetching the data: ', err);
  }
};

const getdata = async() => {
  try{
    people = await getDBPersonData();
    console.log('Successfully fetched person data.')
  } catch(err) {
    console.error('Error getting person data: ', err)
  }
}

getdata();

/**
 * Demo function to return an array of people objects
 * @param { URL } parsedurl 
 * @returns { Promise< Array< person > > }
 */
async function get( parsedurl ) {
  return people
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add( parsedurl, method, person ) {

  if( undefined !== person.id ) {
    people.some( element => {
      if( element.id == person.id ) {
        element.name = person.name
        element.email = person.email
        element.notes = person.notes
        return true
      }
      return false
    } )
    return person
  }

  person.id = people.reduce( ( maxid, obj ) => {
    return Math.max( maxid, obj.id )
  }, -Infinity ) + 1

  people.push( person )

  return person
}


module.exports = {
  get,
  add
}