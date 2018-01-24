import utilities from '@source4society/scepter-utility-lib';
import { fromJS, Map as ImmutableMap } from 'immutable';
export const mapValuesToRecord = (values, fieldData) => {
  let record = {}
  Object.keys(values).map((property) => {
    const fieldType = fieldData.getIn(['data', property, 'widget'], 'text')
    if (utilities.isNotEmpty(values[property])) {
      if (fieldType === 'checkbox') {
        record[property] = values[property].checked
      } else if (utilities.isNotEmpty(values[property].value)) {
        record[property] = values[property].value
      }
    }
  });
  return record
}


