import { fromJS, Map as immutableMap } from 'immutable';
import utilities from '@source4society/scepter-utility-lib';
import { namespacedReducerHandler } from '@source4society/scepter-reducer-lib';

import {
  FORM_INITIALIZED,
  CHANGE_FIELD,
  SUBMITTED_FORM,
  SUBMIT_FORM,
  VALIDATION_ERRORS,
  CLEAR_FORM,
  FETCHED_FORM_DATA,
} from './constants';

const initialState = fromJS({
  formValues: {},
  isValid: false,
  submitDisabled: false,
});


const initializeFormReducer = (state = initialState, action, reducerKey) => {
  return namespacedReducerHandler(state, action, reducerKey, (state, action, reducerKey) => {   
    let updatedFormValues = {}
    if (utilities.isNotEmpty(action.fieldData.get('data'))) {    
      updatedFormValues[action.id] = {};
      action.fieldData.get('data').keySeq().forEach((field) => {    
        if (action.fieldData.getIn(['data', field, 'widget'], 'text') !== 'divider') { 
          updatedFormValues[action.id][field] = { value: action.fieldData.getIn(['views', field, 'value'], ''), isValid: action.fieldData.getIn(['views', field, 'isValid'], true), validationMessage: '', checked: action.fieldData.getIn(['views', field, 'checked'], false), data: action.fieldData.getIn(['views', field, 'data']) }
        }
      });

      return state
        .set('formValues', fromJS(updatedFormValues))
        .set('isValid', initialState.isValid);
    }
    return state;
  })
}

const validationErrorsReducer = (state = initialState, action, reducerKey) => {
  return namespacedReducerHandler(state, action, reducerKey, (state, action, reducerKey) => {    
    updatedFormValues = action.formValues;
    if(utilities.isNotEmpty(action.errors)) {
      for( let field in action.errors ) {
        if(utilities.notEmptyIn(action.errors, [field, 'errors'])) {
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
  })
}

const submitFormReducer = (state = initialState, action, reducerKey) => {
  return namespacedReducerHandler(state, action, reducerKey, (state, action, reducerKey) => {    
    return state
      .set('forceSubmit', false)
      .set('submitDisabled', true)
  })
}

const changeFieldReducer = (state = initialState, action, reducerKey) => {
  return namespacedReducerHandler(state, action, reducerKey, (state, action, reducerKey) => {  
    let value = action.value
    if(action.fieldData.get('convert_boolean', false)) {
      value = utilities.ifTrueElseDefault(action.value === 'true', true, utilities.ifTrueElseDefault(action.value === 'false', false, action.value))
    } 

    return state
      .setIn(
        ['formValues', action.id, action.property], 
        immutableMap({ value: value, isValid: true, validationMessage: '', checked: action.checked, data: action.target })
      )
      .set('isValid', initialState.isValid);
  })
}

const submittedFormReducer = (state = initialState, action, reducerKey) => {
  return namespacedReducerHandler(state, action, reducerKey, (state, action, reducerKey) => {    
    return state
      .set('formValues', action.formValues)
      .set('isValid', action.isValid)
      .set('submitDisabled', false)
  })
}

const formReducer = (reducerKey) => (state = initialState, action) => {
  let updatedFormValues = null; 
  switch (action.type) {
    case FORM_INITIALIZED:
    case CLEAR_FORM:
      return initializeFormReducer(state, action, reducerKey)
    case VALIDATION_ERRORS:
      return validationErrorsReducer(state, action, reducerKey)
    case SUBMIT_FORM:
      return submitFormReducer(state, action, reducerKey)
    case SUBMITTED_FORM:
      return submittedFormReducer(state, action, reducerKey)
    case CHANGE_FIELD:
      return changeFieldReducer(state, action, reducerKey)
    default:
      return state;
  }
}

export default formReducer;
