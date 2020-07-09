const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')
const { expect } = chai

const server = require('../../../server/app')

chai.use(chaiHttp)

let token

describe('Users route', () => {
  const signup = '/users/signup'
  const signin = '/users/signin'
  const secret = '/users/secret'

  const user = { email: faker.internet.email(), password: faker.internet.password() }
  const preSave = { email: 'mr.sometest@gmail.com', password: faker.internet.password() }

  before(async () => {
    const result = await chai.request(server).post(signup).send(preSave)

    expect(result.status).to.equal(201)
    token = result.body.token
  })

  //   after all tests are done we drop the test database
  after('dropping test db', async () => {
    await mongoose.connection.dropDatabase(() => {
      console.log('\n Test database dropped')
    })
    await mongoose.connection.close()
  })

  describe('signup', () => {
    it('should create a new user if email is not found', async () => {
      try {
        const result = await chai.request(server).post(signup).send(user)

        //   console.log(res.status)
        expect(result.status).to.equal(201)
        expect(result.body).not.to.be.empty
        expect(result.body).to.have.property('token')
      } catch (err) {
        console.log(err)
      }
    })
  })
})
