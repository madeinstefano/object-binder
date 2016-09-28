module.exports = {
  get car() {
    return { 
      model: '', 
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
}
