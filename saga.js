import { put, takeLatest } from 'redux-saga/effects';
import validators from '@source4society/scepter-validation-lib';
import { Map as immutableMap } from 'immutable';
import utilities from '@source4society/scepter-utility-lib';
import { SUBMIT_FORM } from './constants';
import { formSubmitted } from './actions';

export const validateFormData = (reducerKey) => (function* validateFormDataFunction(action) {
  let clonedFormValues = action.formValues;
  let isValid = true;

  if (action.reducerKey !== reducerKey) {
    return;
  }

  action.formValues.get(action.id).keySeq().forEach((field) => {
    if (action.fieldData.getIn(['data', field, 'widget'], 'text') !== 'divider') {
      let validationMessage = '';
      const propertyOrder = action.fieldData.getIn(['data', field, 'propertyOrder'], 0);
      if (propertyOrder > 0) {
        const validatorConfig = utilities.valueOrDefault(action.validation[propertyOrder - 1], []);
        let areAllValidatorsValid = true;
        for (let configIndex = 0; configIndex < validatorConfig.length; configIndex += 1) {
          const value = clonedFormValues.getIn([action.id, field, 'value'], '');
          let value2;
          let isFieldValid = true;
          if (
              utilities.isNotEmpty(validatorConfig[configIndex]) &&
              (utilities.emptyAt(validatorConfig[configIndex], ['ifNotEmpty']) ||
                (validatorConfig[configIndex].ifNotEmpty && utilities.isNotEmpty(value)))
          ) {
            if (validatorConfig[configIndex].validationType === 'matchField') {
              value2 = clonedFormValues.getIn([action.id, validatorConfig[configIndex].fieldName, 'value'], '');
            } else {
              value2 = validatorConfig[configIndex].parameter;
            }
            isFieldValid = validators[validatorConfig[configIndex].validationType](value, value2);
            validationMessage += isFieldValid ? '' : `${validatorConfig[configIndex].invalidMessage}. `;
          }

          if (!isFieldValid) {
            isValid = false;
            areAllValidatorsValid = false;
          }
          clonedFormValues = clonedFormValues.setIn(
            [action.id, field],
            immutableMap({ value, isValid: areAllValidatorsValid, validationMessage })
          );
        }
      }
    }
  });

  yield put(formSubmitted(isValid, clonedFormValues, action.reducerKey, action.id));
  if (typeof action.callbackAction !== 'undefined') {
    yield put(action.callbackAction(isValid, clonedFormValues, action.reducerKey, action.id));
  }
});

export default function* validateData(props) {
  yield takeLatest(SUBMIT_FORM, validateFormData(utilities.valueOrDefault(props.reducerKey, 'form')));
}
