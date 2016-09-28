/**
* Binder Factory
*/

function getDeepValue(obj, path) {
  return path.reduce( (ref, key) => ref && ref[key] ? ref[key] : null, obj);
}

function setDeepValue(obj, path, value) {
  var ref = obj;
  if (value === null || value === undefined) {
    return;
  }
  path.forEach( (key, i, a) => {
    if (a.length > i + 1) {
      ref = ref[key];
    } else {
      ref[key] = value;
    }
  });
}

module.exports = {
  
  /**
  * @param {...string} - All bindable fields to this binder
  * @return {{bind: function}} - A new binder object
  */
  build() {
    
    var paths = [...arguments].map( v => v.split('.') );
    
    return {
      
      /**
      * @param {Object} obj1 - object tor receive the values
      * @param {Object} obj1 - object to get the values, according to the fields
      */
      bind(obj1, obj2) {
        paths.forEach( path => {
          setDeepValue(obj1, path, getDeepValue(obj2, path) );
        });
        
      }
    }
  }
}
