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
  afterEach(() => {
    Activity.collection.drop();
  })

  it('should connect to the db', (done) => {
    let isConnected;
    const db_name = (process.env.NODE_ENV === 'test' ? 'things_db_test' : 'things_db');
    let url = `mongodb://localhost:27017/${db_name}`;

    mongoose.connect(url, {
      useNewUrlParser: true
    });
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
    activity.save(function (err, res) {
      if (err) {
        console.log('Error: ', err)
      } else {
        id = res._id;
        chai.request(server)
          .get(`/api/v1/activities/${id}`)
          .end((err, res) => {
            res.should.be.a('object');
            const location = res.body[0].location;
            res.body[0].should.have.property('category');
            res.body[0].category.should.equal('Music');
            res.body[0].should.have.property('title');
            res.body[0].title.should.equal('Dua Lipa');
            location.should.have.property('city');
            location.city.should.equal('London');
            location.should.have.property('postcode');
            location.postcode.should.equal('SE1 7AY');
            res.body[0].should.have.property('description');
            res.body[0].description.should.equal('A concert in London for the first time...');
            res.body[0].should.have.property('frequency');
            res.body[0].frequency.should.equal('once');
            res.body[0].should.have.property('cost');
            res.body[0].cost.should.equal('high');
            done();
          })
      }
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
    activity.save(function (err, res) {
      if (err) {
        console.log('Error: ', err)
      } else {
        //console.log('Saved!', res)
        id = res._id
        chai.request(server)
          .delete(`/api/v1/activities/${id}`)
          .end((err, resp) => {
            resp.body.should.be.an('object');
            resp.body.should.have.property('category');
            done()
          })

      };
    });
  })
  
  it('should UPDATE an activity', (done) => {
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
    activity.save(function (err, res) {
      if (err) {
        console.log('Error: ', err)
      } else {
        //console.log('Saved!', res)
        id = res._id
        chai.request(server).put(`/api/v1/activities/${id}`)
      .send({
        "title": "New Movement",
        "city": "Berlin"
      })
      .end((err, res) => {
        res.should.be.a('object');
        res.body.should.have.property('n');
        res.body.n.should.equal(1);
        res.body.should.have.property('nModified');
        res.body.nModified.should.equal(1);
        res.body.should.have.property('ok');
        res.body.ok.should.equal(1);
        done();
      })
      

      };
    });
    
      
  })
})