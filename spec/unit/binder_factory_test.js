require('rootpath')();

const chai = require('chai');
const should = require('chai').should();
const BinderFactory = require('binder_factory');
const expect = chai.expect;
const ModelFactory = require('spec/fixtures/model');

describe('Binder test', () => {

  it('Should bind only registered props', function () {
    
    var car = ModelFactory.car;
    var data = { model: 'BMW M3', year: 1988, flavor: 'vanilla' };
    
    var binder = BinderFactory.build('model', 'year', 'doors');
    
    binder.bind(car, data);
    
    car.model.should.eql('BMW M3');
    car.year.should.eql(1988);
    expect(car).to.not.have.property('flavor');
    
  });
  
  it('Should deep bind properties', function () {
    
    var car = ModelFactory.car;
    var data = { model: 'BMW M3', year: 1988, engine: { cylinders: 4, displacement: 2303, output: { power: 197, torque: 177 } } };
    
    var binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement', 'engine.output.power', 'engine.output.torque');
    
    binder.bind(car, data);
    
    car.model.should.eql('BMW M3');
    car.year.should.eql(1988);
    car.engine.cylinders.should.eql(4);
    car.engine.output.torque.should.eql(177);
  });
  
  it('Should not break when missing some properties on object to extends', function () {
    
    var car = ModelFactory.car;
    var data = { };
    
    var binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement', 'engine.output.power', 'engine.output.torque');
    
    binder.bind(car, data);
    
    expect(car.model).to.eql('');
    expect(car.year).to.eql(0);
    expect(car.engine.cylinders).to.eql(0);
    expect(car.engine.output.torque).to.eql(0);
  });
  
  it('Should not break when the object to extends is null', function () {
    
    var car = ModelFactory.car;
    
    var binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement', 'engine.output.power', 'engine.output.torque');
    
    binder.bind(car);
    
    expect(car.model).to.eql('');
    expect(car.year).to.eql(0);
    expect(car.engine.cylinders).to.eql(0);
    expect(car.engine.output.torque).to.eql(0);
  });
  
  it('Should bind all models properties with wildcard', function () {
    
    var car = ModelFactory.car;
    var data = { model: 'BMW M3', year: 1988, color: 'red', engine: { cylinders: 4, displacement: 2303, output: { power: 197, torque: 177 } } };
    
    var binder = BinderFactory.build('*');
    
    binder.bind(car, data);
    
    car.model.should.eql('BMW M3');
    car.year.should.eql(1988);
    car.engine.cylinders.should.eql(4);
    car.engine.output.torque.should.eql(177);
    expect(car.color).to.eql(undefined);
    
  });
});
