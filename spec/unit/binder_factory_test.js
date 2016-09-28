require('rootpath')();

var chai = require('chai');
var should = require('chai').should();
var BinderFactory = require('binder_factory');
var expect = chai.expect;

function getFreshModel() {
  return { 
    model: null, 
    year: 0, 
    engine: { 
      displacement: 0,
      cylinders: 0,
      output: {
        power: 0,
        torque: 0
      }
    } 
  };
  
}

describe('Binder test', () => {

  it('Should bind only registered props', function () {
    
    var data = { model: 'BMW M3', year: 1988, flavor: 'vanilla' };
    var model = getFreshModel();
    
    var binder = BinderFactory.build('model', 'year', 'doors');
    
    binder.bind(model, data);
    
    model.model.should.eql('BMW M3');
    model.year.should.eql(1988);
    expect(model).to.not.have.property('flavor');
    
  });
  
  it('Should deep bind properties', function () {
    
    var model = getFreshModel();
    var data = { model: 'BMW M3', year: 1988, engine: { cylinders: 4, displacement: 2303, output: { power: 197, torque: 177 } } };
    
    var binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement', 'engine.output.power', 'engine.output.torque');
    
    binder.bind(model, data);
    
    model.model.should.eql('BMW M3');
    model.year.should.eql(1988);
    model.engine.cylinders.should.eql(4);
    model.engine.output.torque.should.eql(177);
  });
});
