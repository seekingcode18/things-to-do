process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const should = require('chai').should();
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const MongoClient = require('mongodb').MongoClient;

chai.use(chaiHttp);

describe('API routes', () => {
  it('should connect to the db', (done) => {
    MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
      if(err) throw err;
      const dbo = db.db('things_db_test')
      dbo.collection('activities').find({}).toArray((err, result) => {
        if(err) throw err;
        result.length.should.equal(0);
        done();
        db.close();
      })
    });
  })

  it('should POST an activity', (done) => {
    chai.request(server)
      .post('/api/v1/activities')
      .send({
        "category": "Music",
        "title": "New Movement",
        "city": "London",
        "postcode": "7AY SE1",
        "description": "Another concert in London for the first time...",
        "frequency": "once",
        "date": new Date("2020-07-30T20:00:00"),
        "cost": "high"
      })
      .end((err, res) => {
        res.should.be.a('object');
        res.body.should.have.property('result');
        res.body.should.have.property('ops');
        const ops = res.body.ops[0];
        const location = ops.location;
        ops.should.have.property('category');
        ops.category.should.equal('Music');
        ops.should.have.property('title');
        ops.title.should.equal('New Movement');
        location.should.have.property('city');
        location.city.should.equal('London');
        location.should.have.property('postcode');
        location.postcode.should.equal('7AY SE1');
        ops.should.have.property('description');
        ops.description.should.equal('Another concert in London for the first time...');
        ops.should.have.property('frequency');
        ops.frequency.should.equal('once');
        ops.should.have.property('cost');
        ops.cost.should.equal('high');
        done();
        //collection.drop();
      })
  })

})