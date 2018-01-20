import { call, put, takeLatest } from 'redux-saga/effects';
import { SUBMIT_FORM, SUBMITTED_FORM } from './constants';
import { formSubmitted } from './actions';
import validators from './validators/validators';
import { fromJS, Map as ImmutableMap } from 'immutable';



export const validateFormData = (reducerKey) => (function* validateFormDataFunction(action) { 
  let clonedFormValues = action.formValues;
  let isValid = true; 

  if(action.reducerKey !== reducerKey) {
    return
  }

  action.formValues.get(action.id, {}).keySeq().forEach((field, fieldIndex) => {
    if (action.fieldData.getIn(['data', field, 'widget'], 'text') !== 'divider') {
      let validationMessage = '';
      const propertyOrder = action.fieldData.getIn(['data',field,'propertyOrder'], 0);
      if(propertyOrder > 0) {
        const validatorConfig = action.validation[propertyOrder-1] || [];     
        let areAllValidatorsValid = true; 
        for (let configIndex = 0; configIndex < validatorConfig.length; configIndex += 1) {
          const value = clonedFormValues.getIn([action.id, field, 'value'], '');
          let value2;
          if(validatorConfig[configIndex].validationType === 'matchField') {
            value2 = clonedFormValues.getIn([action.id, validatorConfig[configIndex].fieldName, 'value'], '')
          } 
          const isFieldValid = validators[validatorConfig[configIndex].validationType](value, value2);
          validationMessage += isFieldValid ? '' : `${validatorConfig[configIndex].invalidMessage}. `;
          if (!isFieldValid) {
            isValid = false;
            areAllValidatorsValid = false
          }
          clonedFormValues = clonedFormValues.setIn([action.id, field], ImmutableMap({ value, isValid: areAllValidatorsValid, validationMessage }));          
        } 
      }             
    }
  });  

  yield put(formSubmitted(isValid, clonedFormValues, action.reducerKey));
  if( typeof action.callbackAction !== 'undefined') {
     yield put(action.callbackAction(isValid, clonedFormValues, action.reducerKey));
  }
})

export default function* validateData(props) {
  yield takeLatest(SUBMIT_FORM, validateFormData(props.reducerKey || 'form'));
}

