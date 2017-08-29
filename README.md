# Object Binder
*Bind a preset list of allowed props from one object to another*

This works as an extends function, but allows to preset what properties will be replaced and, when dealing with nested object, **do not replace the whole object**, just the selected properties. It also can map some property to be bound to another path.

I created this mainly to bind `req.body` in to models on POST/PUT requests.

### 1. Install & configure

```bash
$ npm install --save object_binder
```

### 2. Create a Binder instance
```js
const BinderFactory = require( 'object_binder' );
const binder = BinderFactory.build( 'someprop', 'some.deep.property', { 'some.prop': 'to.place.on.another.prop' } );
```

### 3. Now can extends one object in another

```js
const binder = BinderFactory.build( 'engine.output.torque', 'engine.output.power', 'engine.displacement', { 'engine.output.power': 'engine.bhp' } );
const model = { model: 'BMW M3', year: 1988, engine: { cylinders: 4 } };
const params = { engine: { output: { power: 197, torque: 177 }, displacement: 2303 } };

binder.bind(model, params);

// model will be:
// {
//   model: 'BMW M3',
//   year: 1988,
//   engine: {
//     bhp : 197,
//     cylinders: 4,
//     displacement: 2303,
//     output: {
//       power: 197,
//       torque: 177
//     }
//   }
// }
```
### The is also a wilcard, meaning all props hould be bind.

```js
const binder = BinderFactory.build( '*' );
const model = { model: 'BMW M3', year: 1988, engine: { cylinders: 4 } };
const params = { model: 'BMW M5', year: 1989, engine: { cylinders: 6, output: { power: 315, torque: 360 }, displacement: 3535 } };

binder.bind( model, params );

// model will be:
// {
//   model: 'BMW M5',
//   year: 1989,
//   engine: {
//     cylinders: 6
//   }
// }
```
