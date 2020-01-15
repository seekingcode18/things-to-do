process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const should = require('chai').should();
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const Activity = require('../models/model');

chai.use(chaiHttp);

describe('API routes', () => {
    Activity.collection.drop();

    it('should connect to the db', (done) => {
      let isConnected;
      const db_name = (process.env.NODE_ENV === 'test'? 'things_db_test':'things_db' );
      let url = `mongodb://localhost:27017/${db_name}`;

    mongoose.connect(url, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', (error) => {
      isConnected = false;
    })
    db.once('open', () => {
      isConnected = true;
    })

    done()
    isConnected.should.be(true)
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
        const location = res.body.location;
        res.body.should.have.property('category');
        res.body.category.should.equal('Music');
        res.body.should.have.property('title');
        res.body.title.should.equal('New Movement');
        location.should.have.property('city');
        location.city.should.equal('London');
        location.should.have.property('postcode');
        location.postcode.should.equal('7AY SE1');
        res.body.should.have.property('description');
        res.body.description.should.equal('Another concert in London for the first time...');
        res.body.should.have.property('frequency');
        res.body.frequency.should.equal('once');
        res.body.should.have.property('cost');
        res.body.cost.should.equal('high');
        done();
      })
  })

  it('should GET one activity', (done) => {
    chai.request(server)
      .get('/api/v1/activities/5e1db6e21f20f3431854fec7')
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
        const location = res.body.location;
        res.body.should.have.property('category');
        res.body.category.should.equal('Music');
        res.body.should.have.property('title');
        res.body.title.should.equal('New Movement');
        location.should.have.property('city');
        location.city.should.equal('London');
        location.should.have.property('postcode');
        location.postcode.should.equal('7AY SE1');
        res.body.should.have.property('description');
        res.body.description.should.equal('Another concert in London for the first time...');
        res.body.should.have.property('frequency');
        res.body.frequency.should.equal('once');
        res.body.should.have.property('cost');
        res.body.cost.should.equal('high');
        done();
      })
  })

  it('should DELETE one activity', (done) => {
    const activity = new Activity({
      "category": "Music",
      "title": "Dua Lipa",
      "location": {
        "city": "London",
        "postcode": "SE1 7AY"
      },
      "description": "A concert in London for the first time...",
      "frequency": "once",
      "date": new Date("2020-07-30T20:00:00"),
      "cost": "high"
    });

    let id;
    activity.save(function(err, res) {
      if (err) {
        console.log('Error: ', err)
      } else {
        console.log('Saved!', res)
        id = res._id
        chai.request(server)
        .delete(`/api/v1/activities/${id}`)
        .end((err, resp) => {
          done();
          // console.log(resp.body)
            resp.body.should.be.an('object');
            resp.body.should.have.property('category');
          })
        };
    });
    })
})