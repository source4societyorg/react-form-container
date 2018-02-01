import utilities from '@source4society/scepter-utility-lib';
export const mapValuesToRecord = (values, fieldData) => {
  const record = {};
  Object.keys(values).each((property) => {
    const fieldType = fieldData.getIn(['data', property, 'widget'], 'text');
    if (utilities.isNotEmpty(values[property])) {
      if (fieldType === 'checkbox') {
        record[property] = values[property].checked;
      } else if (utilities.isNotEmpty(values[property].value)) {
        record[property] = values[property].value;
      }
    }
  });
  return record;
};
