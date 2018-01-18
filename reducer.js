import { fromJS, Map as ImmutableMap } from 'immutable';
import utilities from '@source4society/scepter-utility-lib';

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


const formReducer = (reducerKey) => (state = initialState, action, props) => {
  let updatedFormValues = null; 

  switch (action.type) {
    case VALIDATION_ERRORS:
      if (reducerKey !== action.reducerKey && action.type)  {
        return state
      }

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
      if (reducerKey !== action.reducerKey && action.type)  {
        return state
      }

      return state
        .set('forceSubmit', false)
        .set('submitDisabled', true)
    case CHANGE_FIELD:
      if (reducerKey !== action.reducerKey && action.type)  {
        return state
      }

      return state
        .setIn(['formValues', action.id, action.property], ImmutableMap({ value: action.value, isValid: true, validationMessage: '', checked: action.checked, data: action.target }))
        .set('isValid', initialState.isValid);
    case SUBMITTED_FORM:
      if (reducerKey !== action.reducerKey && action.type)  {
        return state
      }

      return state
        .set('formValues', action.formValues)
        .set('isValid', action.isValid)
        .set('submitDisabled', false)

    case FORM_INITIALIZED:
    case CLEAR_FORM:
      if (reducerKey !== action.reducerKey && action.type)  {
        return state
      }

      if (typeof action.fieldData !== 'undefined') {      
        updatedFormValues = {};
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

    default:
      return state;
  }
}

export default formReducer;
