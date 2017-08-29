const chai = require('chai');
const expect = require('chai').expect;
const BinderFactory = require('../../index');
const ModelFactory = require('../fixtures/model');

describe('Binder test', () => {

  it('Should bind only registered props', () => {
    const car = ModelFactory.car;
    const data = { model: 'BMW M3', year: 1988, flavor: 'vanilla' };
    const binder = BinderFactory.build('model', 'year', 'doors');

    binder.bind(car, data);

    expect( car.model ).to.eql( data.model );
    expect( car.year ).to.eql( data.year );
    expect( car ).to.not.have.property( 'flavor' );
  });

  it('Should deep bind properties', () => {
    const car = ModelFactory.car;
    const data = { model: 'BMW M3', year: 1988, engine: { cylinders: 4, displacement: 2303,
                                                          output: { power: 197, torque: 177 } } };
    const binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement',
                                       'engine.output.power', 'engine.output.torque');

    binder.bind(car, data);

    expect( car.model ).to.eql( data.model );
    expect( car.year ).to.eql( data.year );
    expect( car.engine.cylinders ).to.eql( data.engine.cylinders );
    expect( car.engine.output.torque ).to.eql( data.engine.output.torque );
  });

  it('Should deep bind properties to another properties names', () => {

    const car = ModelFactory.car;
    const data = { model: 'BMW M3', year: 1988, engine: { cylinders: 4, displacement: 2303,
                                                          output: { power: 197, torque: 177 } } };

    const binder = BinderFactory.build('model', 'year', 'engine.cylinders',
                                     { 'engine.displacement': 'engine.nominalDisplacement' },
                                     { 'engine.output.power': 'engine.bhp' },
                                     { 'engine.output.torque': 'engine.torque' } );

    binder.bind(car, data);

    expect( car.model ).to.eql( data.model );
    expect( car.year ).to.eql( data.year );
    expect( car.engine.cylinders ).to.eql( data.engine.cylinders );
    expect( car.engine.nominalDisplacement ).to.eql( data.engine.displacement );
    expect( car.engine.bhp ).to.eql( data.engine.output.power );
    expect( car.engine.torque ).to.eql( data.engine.output.torque );
  });

  it('Should bind properties even if values parse to false (except null and undefined)', () => {

    const car = ModelFactory.car;
    const data = { model: 'BMW M3', year: 1988, engine: { cylinders: 0, displacement: undefined,
                                                          output: { power: null, torque: 177 } } };

    const binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement',
                                       'engine.output.power', 'engine.output.torque');

    binder.bind(car, data);

    expect( car.model ).to.eql( data.model );
    expect( car.year ).to.eql( data.year );
    expect( car.engine.cylinders ).to.eql( 0 );
    expect( car.engine.cylinders ).to.eql( 0 );
    expect( car.engine.output.power ).to.eql( 0 );
  });

  it('Should not break when missing some properties on object to extends', () => {
    const car = ModelFactory.car;
    const data = { };
    const binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement',
                                       'engine.output.power', 'engine.output.torque');

    binder.bind(car, data);

    expect(car.model).to.eql( '' );
    expect(car.year).to.eql( 0 );
    expect(car.engine.cylinders).to.eql( 0 );
    expect(car.engine.output.torque).to.eql( 0 );
  });

  it('Should not break when the object to extends is null', () => {
    const car = ModelFactory.car;
    const binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement',
                                       'engine.output.power', 'engine.output.torque');

    binder.bind(car);

    expect(car.model).to.eql( '' );
    expect(car.year).to.eql( 0 );
    expect(car.engine.cylinders).to.eql( 0 );
    expect(car.engine.output.torque).to.eql( 0 );
  });

  it('Should bind all models properties with wildcard', () => {
    const car = ModelFactory.car;
    const data = { model: 'BMW M3', year: 1988, color: 'red', engine: { cylinders: 4,
                                                                        displacement: 2303,
                                                                        output: {
                                                                          power: 197,
                                                                          torque: 177 } } };
    const binder = BinderFactory.build('*');

    binder.bind(car, data);

    expect( car.model ).to.eql( data.model );
    expect( car.year ).to.eql( data.year );
    expect( car.engine.cylinders ).to.eql( data.engine.cylinders );
    expect( car.engine.output.torque ).to.eql( data.engine.output.torque );
    expect(car.color).to.eql( undefined );
  });

  it('Should create all property tree', () => {
    const car = {};
    const data = { model: 'BMW M3', year: 1988, engine: { cylinders: 4, displacement: 2303,
                                                          output: { power: 197, torque: 177 } } };
    const binder = BinderFactory.build('model', 'year', 'engine.cylinders', 'engine.displacement',
                                       'engine.output.power', 'engine.output.torque');

    binder.bind(car, data);

    expect( car.model ).to.eql( data.model );
    expect( car.year ).to.eql( data.year );
    expect( car.engine.cylinders ).to.eql( data.engine.cylinders );
    expect( car.engine.output.torque ).to.eql( data.engine.output.torque );
  });
});
