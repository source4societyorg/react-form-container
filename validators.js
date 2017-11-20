const validators = {
  required: (value) => (typeof value !== 'undefined' && value !== null && value !== ''),
  email: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value),

};

export default validators;
