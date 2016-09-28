/**
* Binder Factory
*/

function getDeepValue(obj, path) {
  return path.split('.').reduce( (ref, key) => ref[key], obj);
}

function setDeepValue(obj, path, value) {
  var ref = obj;
  path.split('.').forEach( (key, i, a) => {
    if (a.length > i + 1) {
      ref = ref[key];
    } else {
      ref[key] = value || ref[key];
    }
  });
}

module.exports = {
  
  /**
  * @param {...string} - All bindable fields to this binder
  * @return {{bind: function}} - A new binder object
  */
  build() {
    
    var fields = [...arguments];
    
    return {
      
      /**
      * @param {Object} obj1 - object tor receive the values
      * @param {Object} obj1 - object to get the values, according to the fields
      */
      bind(obj1, obj2) {
        
        fields.forEach( field => setDeepValue(obj1, field, getDeepValue(obj2, field) ) );
        
      }
    }
  }
}
