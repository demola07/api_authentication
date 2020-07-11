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

    it('should return 403 if user alreaady exists', async () => {
      try {
        const result = await chai.request(server).post(signup).send(preSave)

        expect(result.status).to.equal(403)
        expect(result.body).to.be.deep.equal('User already exists')
      } catch (err) {
        console.log(err)
      }
    })

    describe('Secret', () => {
      it('should return 401 if not authenticated', async () => {
        try {
          const result = await chai.request(server).get(secret)

          expect(result.status).to.equal(401)
          expect(result.status).to.equal(401)
          expect(result.body).to.be.deep.equal('User is not authenticated.')
        } catch (err) {
          console.log(err)
        }
      })

      it('should return 200 if authenticated', async () => {
        try {
          const result = await chai.request(server).get(secret).set('Authorization', token)

          expect(result.status).to.equal(200)
          expect(result.body).to.be.deep.equal('You have reached the protected route')
        } catch (err) {
          console.log(err)
        }
      })
    })

    describe('Signin', () => {
      it('should return error 400 if user email and password is empty', async () => {
        let user = {}
        const result = await chai.request(server).post(signin).send(user)

        expect(result.status).to.equal(400)
      })

      it("should return 200 and token if user's email and password is valid", async () => {
        try {
          const result = await chai.request(server).post(signin).send(preSave)

          expect(result.status).to.equal(200)
          expect(result.body).not.to.be.empty
          expect(result.body).to.have.property('token')
        } catch (err) {
          console.log(err)
        }
      })

      it("should return 403 if user's email or password is invalid", async () => {
        try {
          const user = { email: faker.internet.email(), password: faker.internet.password() }
          const result = await chai.request(server).post(signin).send(user)

          expect(result.body.error).to.be.deep.equal('User does not exist')
        } catch (err) {
          console.log(err)
        }
      })

      it("should return 'invalid credentials' if password is invalid", async () => {
        try {
          const user = { email: preSave.email, password: faker.internet.password() }
          const result = await chai.request(server).post(signin).send(user)

          expect(result.body.error).to.be.deep.equal('Invalid Credentials')
        } catch (err) {
          console.log(err)
        }
      })
    })
  })
})
