import utilities from '@source4society/scepter-utility-lib';
import { Map as immutableMap } from 'immutable';

const setFieldDataValuesFunction = (formData, fieldData) => {
  let updatedFieldData = Object.assign({}, fieldData);
  for (const field of fieldData.get('data')) {
    const valueData = formData[field[0]];
    if (utilities.isEmpty(valueData)) {
      continue;
    }
    const checkedData = utilities.ifTrueElseDefault(
      field[1].get('widget') === 'checkbox',
      formData[field[0]],
      utilities.ifTrueElseDefault(
        utilities.isNotEmpty(fieldData.get('views')) && utilities.isNotEmpty(fieldData.getIn(['views', field[0]])),
        fieldData.getIn(['views', field[0], 'value']),
        false
      )
    );
    updatedFieldData = updatedFieldData.setIn(['views', field[0]], immutableMap({ value: valueData, isValid: true, checked: checkedData }));
  }

  return updatedFieldData;
};

const fetchedDataReducerFunction = (state, fieldData, formData, reducerKey, injectedSetFieldDataValues) => {
  const setFieldDataValues = utilities.valueOrDefault(injectedSetFieldDataValues, namespacedReducerHandlerFunction);
  const updatedFieldData = setFieldDataValues(formData, fieldData);
  return state
    .set(reducerKey, updatedFieldData);
};

module.exports.setFieldDataValues = setFieldDataValuesFunction;
module.exports.fetchedDataReducer = fetchedDataReducerFunction;
