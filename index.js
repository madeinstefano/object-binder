/**
* Binder Factory
*/

/**
 * Given an object and a path, get its value
 * @param {Object} obj
 * @param {Array<String>} path Array of nested prop names
 * @return {Object|Primitive} any value found on that path
 */
function getDeepValue( obj, path ) {
  return path.reduce( ( ref, key ) => {
    if ( ref && Object.keys( ref ).includes( key ) ) {
      return ref[key];
    }
    return null;
  }, obj );
}

/**
 * Paths can be input as a string
 * eg: "route.to.some.prop"
 * Or a object
 * { "route.to.some.prop": "route.to.where.this.value.goes" }
 * This fn normalizes this as a object:
 * {
 *  read: ['route', 'to', 'some', 'prop'],
 *  write: ['route', 'to', 'where', 'this', 'value', 'goes']
 * }
 */
function normalizeConfigPaths( paths ) {
  return paths.map( path => {
    const pathConfig = {};
    if ( path.constructor.name === 'Object' ) {
      pathConfig.read = Object.keys( path )[0].split( '.' );
      pathConfig.write = Object.values( path )[0].split( '.' );
    } else {
      pathConfig.read = path.split( '.' );
      pathConfig.write = path.split( '.' );
    }
    return pathConfig;
  } );
}

/**
 * Return all paths from given object
 * @param {Object} obj
 * @return {Array<Object>} Arrayh with paths, each path have a read and write location
 */
function getPathsFromObject( obj ) {
  const paths = [];
  if ( !obj || obj.constructor.name !== 'Object' ) {
    return paths;
  }

  Object.keys( obj ).forEach( key => {
    const sub = getPathsFromObject( obj[key] );
    if ( sub.length > 0 ) {
      sub.map( v => [ key ].concat( v.read ).join( '.' ) ).forEach( v => paths.push( v ) );
    } else {
      paths.push( key );
    }
  } );

  return paths.map( path => ( {
    read: path.split( '.' ),
    write: path.split( '.' )
  } ) );
}

/**
 * Set the value on a object from a given path
 * @param {Object} obj
 * @param {Array<String>} path Array of nested prop names
 */
function setDeepValue( obj, path, value ) {
  let ref = obj;
  if ( value === null || value === undefined ) {
    return;
  }
  path.forEach( ( key, i, a ) => {
    if ( a.length > i + 1 ) { // not last
      if ( ref[key] === undefined ) {
        Object.defineProperty( ref, key, { value: { }, enumerable: true } );
      }
      ref = ref[key];
    } else {
      ref[key] = value;
    }
  } );
}

module.exports = {

  /**
  * @param {...string} - All bindable fields to this binder
  * @return {{bind: function}} - A new binder object
  */
  build( ...args ) {
    const all = args[0] === '*';
    const configPaths = !all ? normalizeConfigPaths( args ) : [];

    return {

      /**
      * @param {Object} obj1 - object tor receive the values
      * @param {Object} obj1 - object to get the values, according to the fields
      */
      bind( obj1, obj2 ) {
        const pathsToBind = all ? getPathsFromObject( obj1 ) : configPaths;

        pathsToBind.forEach( path => {
          setDeepValue( obj1, path.write, getDeepValue( obj2, path.read ) );
        } );

        return obj1;
      }
    };
  }
};
