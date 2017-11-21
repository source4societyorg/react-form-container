import { fromJS, Map as ImmutableMap } from 'immutable';

import {
  FORM_INITIALIZED,
  CHANGE_FIELD,
  SUBMIT_FORM,
} from './constants';

import validators from './validators';

const initialState = fromJS({
  formValues: {},
  isValid: false,
});

function formReducer(state = initialState, action) {
  let isValid = null;
  let updatedState = null;
  let updatedFormValues = null;

  switch (action.type) {
    case FORM_INITIALIZED:
      if (typeof action.fieldData !== 'undefined') {
        updatedFormValues = {};
        updatedFormValues[action.id] = {};

        action.fieldData.get('data').keySeq().forEach((field) => {
          updatedFormValues[action.id][field] = { value: action.fieldData.getIn(['view', field], ''), isValid: true, validationMessage: '' };
        });

        return state
            .set('formValues', fromJS(updatedFormValues))
            .set('isValid', initialState.isValid);
      }

      return state;
    case CHANGE_FIELD:
      return state
        .setIn(['formValues', action.id, action.property], ImmutableMap({ value: action.value, isValid: true, validationMessage: '' }))
        .set('isValid', initialState.isValid);
    case SUBMIT_FORM:
      isValid = true;
      updatedState = state;
      updatedState.getIn(['formValues', action.id]).keySeq().forEach((field, fieldIndex) => {
        let validationMessage = '';
        const validatorConfig = action.validation[fieldIndex] || [];
        for (let configIndex = 0; configIndex < validatorConfig.length; configIndex += 1) {
          const value = updatedState.getIn(['formValues', action.id, field, 'value'], '');
          const isFieldValid = validators[validatorConfig[configIndex].validationType](value);
          validationMessage += isFieldValid ? '' : `${validatorConfig[configIndex].invalidMessage}. `;
          updatedState = updatedState.setIn(['formValues', action.id, field], ImmutableMap({ value, isValid: isFieldValid, validationMessage }));
          if (!isFieldValid) {
            isValid = false;
          }
        }
      });
      return updatedState.set('isValid', isValid);
    default:
      return state;
  }
}

export default formReducer;
