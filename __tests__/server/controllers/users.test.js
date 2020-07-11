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

describe.only('Users controller', () => {
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
})
