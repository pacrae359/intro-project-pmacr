// I am using an older version of chai that still supports commonjs.
const chai = require( "chai" );
const chaiHttp = require( "chai-http" )
chai.use(chaiHttp)
const peopleModule = require( "../lib/people.js" )
const { addPerson, deletePerson, getPersonViaName, getPersonViaID } = require ( "../lib/db.js" )
const { handleapi } = require ( "../lib/api.js" )
const { expect } = chai;
const server = require( "../index.js" );

async function beforeEachSetUp() {
    // This creates and adds the TestName user to the database for use in relevant tests.
    var name = "TestName"
    var email = "TestEmail@Email.com"
    var notes = "Test notes"
    await addPerson( name,email,notes )
}

async function afterEachSetUp() {
    // This is used to remove the TestName user instance from the database after each test.
    const personrow = await getPersonViaName( "TestName" )
    await deletePerson( personrow[ 0 ].id )
}

// This is not all testing I would do for the full application, just showing that I would 
// test module functions directly, and then functionality through api calls!
describe("Person Modules", () => {
    // These two calls ensure that there is a consistent testing environment.
    beforeEach(async () => {
        await beforeEachSetUp();
    });
    
    afterEach(async () => {
        await afterEachSetUp();
    })

    it("should return a complete list of all people", async () => {
        const result = await peopleModule.get();
        expect( result ).to.have.length.above( 1, "The list should include at least 2 people" );
    });

    it("should stop duplicate emails when updating people", async () => {
        try{
            let personrow = await getPersonViaName( "TestName" )
            let thisPerson = personrow[ 0 ]
            thisPerson.notes = "Updated Notes!"
            const person = await peopleModule.edit( thisPerson.id, thisPerson.name , thisPerson.email, thisPerson.notes)
        } catch (err) {
            expect( "That Email Already Exists!" ).to.equal( err , "The error message in this instance should be 'That Email Already Exists' but isn't");
        }
    });

    it("should update a person with a unique email", async () => {
        let personrow = await getPersonViaName( "TestName" )
        let thisPerson = personrow[ 0 ]
        thisPerson.email = "Newemail@email.com"
        const person = await peopleModule.edit( {}, "PUT", thisPerson.id, thisPerson.name , thisPerson.email, thisPerson.notes)
        let newPersonRow = await getPersonViaName( "TestName" )
        let checkPerson = newPersonRow[ 0 ]
        expect( "Newemail@email.com" ).to.equal( checkPerson.email , "The email should have been updated to Newemail@email.com but wasn't");
    });


/*
* Just to repeat myself, this is not all the testing I would do in a final version.
* I am just testing some of the modules in people.js not all of them here!
* More just to show that I can do it :)
*/

});

/* 
* These tests create api calls that ensure that the full process from back to front
* end is working as anticipated
*/
describe("API Testing", () => {

    after((done) => {
        // Stop the server after tests are complete
        server.close(() => {
            done();
        });
    });

    var runhook = true;
    afterEach(async () => {
        console.log( runhook )
        if ( runhook ){
            await afterEachSetUp();
        }
    });

    it("should add a person with valid input through the API", async () => {
        const newPerson = {
            name: "TestName",
            email: "TestEmail@Email.com",
            notes: "Test notes"
        };
        const result = await chai.request(server).put("/api/people").send(newPerson);
        let newPersonRow = await getPersonViaName( "TestName" )
        let checkPerson = newPersonRow[ 0 ]
        expect(checkPerson.name).to.equal(newPerson.name, "The valid person instance was not added successfully")
    });

    it("should delete a person through the API", async() => {
        await beforeEachSetUp();
        runhook = false;
        let newPersonRow = await getPersonViaName( "TestName" )
        let checkPersonid = newPersonRow[ 0 ].id
        await chai.request(server).delete(`/api/people/${checkPersonid}`);
        const people = await peopleModule.get();
        for (let i = 0; i<people.length; i++) {
            expect(people[i].name).to.not.equal("TestName", "The existing person has not been deleted from the database!")
        }
    });

});