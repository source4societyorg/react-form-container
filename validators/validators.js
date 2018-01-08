const validators = {
  required: (value) => (typeof value !== 'undefined' && value !== null && value !== ''),
  email: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value),
  integer: (value) => /^\-?(0|[1-9]\d*)$/.test(value),
  decimal: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  nonegative: (value) => parseInt(value) >= 0,
  website: (value) => /^(http|https):\/\/[^ "]+$/.test(value),
  pdf: (value) => /\.pdf$/.test(value),
  matchField: (value, value2) => value === value2,
  phone: (value) => /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
};

export default validators;
