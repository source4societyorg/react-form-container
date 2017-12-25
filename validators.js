const validators = {
  required: (value) => (typeof value !== 'undefined' && value !== null && value !== ''),
  email: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value),
  integer: (value) => /^\-?(0|[1-9]\d*)$/.test(value),
  decimal: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  nonegative: (value) => parseInt(value) > 0,
  website: (value) => /^(http|https):\/\/[^ "]+$/.test(value),
};

export default validators;
