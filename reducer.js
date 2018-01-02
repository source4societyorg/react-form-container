import { fromJS, Map as ImmutableMap } from 'immutable';

import {
  FORM_INITIALIZED,
  CHANGE_FIELD,
  SUBMITTED_FORM,
  SUBMIT_FORM,
  VALIDATION_ERRORS,
  CLEAR_FORM,
} from './constants';

const initialState = fromJS({
  formValues: {},
  isValid: false,
  submitDisabled: false,
});

function formReducer(state = initialState, action) {
  let updatedFormValues = null;

  switch (action.type) {
    case FORM_INITIALIZED:
    case CLEAR_FORM:
      if (typeof action.fieldData !== 'undefined') {
        updatedFormValues = {};
        updatedFormValues[action.id] = {};
        action.fieldData.get('data').keySeq().forEach((field) => {    
          if (action.fieldData.getIn(['data', field, 'widget'], 'text') !== 'divider') { 
            updatedFormValues[action.id][field] = { value: action.fieldData.getIn(['views', field, 'value'], ''), isValid: action.fieldData.getIn(['views', field, 'isValid'], true), validationMessage: '', checked: action.fieldData.getIn(['views', field, 'checked'], false) };
          }
        });
        return state
            .set('formValues', fromJS(updatedFormValues))
            .set('isValid', initialState.isValid);
      }
      return state;
    case VALIDATION_ERRORS:
      updatedFormValues = action.formValues;
      if(typeof action.errors !== 'undefined') {
        for( let field in action.errors ) {
          if(typeof action.errors[field] === 'object' && typeof action.errors[field].errors !== 'undefined') {
            let invalidMessage = '';
            for( let i = 0; i < action.errors[field].errors.length; i++) {
              invalidMessage += action.errors[field].errors[i] + ' ';
            }
            if(invalidMessage.length > 0 && typeof updatedFormValues[action.formTitle][field] !== 'undefined') {
              updatedFormValues[action.formTitle][field].isValid = false;
              updatedFormValues[action.formTitle][field].validationMessage = invalidMessage;
            }
          }
        }
      }
     
      return state
        .set('isValid', false)
        .set('formValues', fromJS(updatedFormValues))
    case SUBMIT_FORM:
      return state
        .set('submitDisabled', true)
    case CHANGE_FIELD:
      return state
        .setIn(['formValues', action.id, action.property], ImmutableMap({ value: action.value, isValid: true, validationMessage: '', checked: action.checked }))
        .set('isValid', initialState.isValid);
    case SUBMITTED_FORM:
      return state
        .set('formValues', action.formValues)
        .set('isValid', action.isValid)
        .set('submitDisabled', false)
    default:
      return state;
  }
}

export default formReducer;
