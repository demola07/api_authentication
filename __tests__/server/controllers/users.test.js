const chai = require('chai')
const faker = require('faker')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const { expect } = chai

const User = require('../../../server/models/User')
const userController = rewire('../../../server/controllers/users.js')

chai.use(sinonChai)

let sandbox = null

describe('Users controller', () => {
  let req = {
    user: { id: faker.random.number() },
    value: {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
  }
  let res = {
    json: function () {
      return this
    },
    status: function () {
      return this
    }
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('Secret', () => {
    it('should return "You have reached the protected route" when called', async () => {
      sandbox.spy(console, 'log')
      sandbox.spy(res, 'json')

      try {
        await userController.secret(req, res)

        expect(console.log).to.have.been.called
        expect(res.json.calledWith({ message: 'You have reached the protected route' })).to.be.ok
        expect(res.json).to.have.been.calledWith({
          message: 'You have reached the protected route'
        })
      } catch (err) {
        throw new Error(err)
      }
    })
  })

  describe('Signin', () => {
    it('should return token when signin is called', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      /*  this test we are going to only test for 
          statusCode and that res.json was only called once
          next test we are going to fake jwt token        */

      try {
        await userController.signIn(req, res)

        expect(res.status).to.have.been.calledWith(200)
        expect(res.json.callCount).to.equal(1)
        expect(res.json).to.have.been.calledOnce
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should return fake token with rewire', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      // fake jwt token with rewire
      let signToken = userController.__set__('signToken', (user) => 'fakeToken')

      // we expect res.json to have been called with our fake token
      try {
        await userController.signIn(req, res)

        expect(res.json).to.have.been.calledWith({ success: true, token: 'fakeToken' })
        signToken()
      } catch (err) {
        throw new Error(err)
      }
    })
  })

  describe('Signup', () => {
    it('should return 403 if the user is already saved in the db', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve({ id: faker.random.number() }))

      try {
        await userController.signUp(req, res)

        expect(res.status).to.have.been.calledWith(403)
        expect(res.json).to.have.been.calledWith({ success: false, error: 'User already exists' })
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should return 200 if user is not in db and it was saved successfully', async () => {
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({ id: faker.random.number() }))

      try {
        await userController.signUp(req, res)

        expect(res.status).to.have.been.calledWith(201)
        expect(res.json.callCount).to.equal(1)
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should return fake token in res.json', async () => {
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({ id: faker.random.number() }))

      let signToken = userController.__set__('signToken', (user) => 'fakeTokenNumberTwo')

      await userController.signUp(req, res)

      expect(res.json).to.have.been.calledWith({
        success: true,
        message: 'User created',
        token: 'fakeTokenNumberTwo'
      })
      signToken()
    })
  })
})
