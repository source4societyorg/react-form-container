import { fromJS, Map as ImmutableMap } from 'immutable';

import {
  FORM_INITIALIZED,
  CHANGE_FIELD,
  SUBMITTED_FORM,
  SUBMIT_FORM,
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
      if (typeof action.fieldData !== 'undefined') {
        updatedFormValues = {};
        updatedFormValues[action.id] = {};
        action.fieldData.get('data').keySeq().forEach((field) => {
          updatedFormValues[action.id][field] = { value: action.fieldData.getIn(['views', field, 'value'], ''), isValid: action.fieldData.getIn(['views', field, 'isValid'], true), validationMessage: '', checked: action.fieldData.getIn(['views', field, 'checked'], false) };
        });

        return state
            .set('formValues', fromJS(updatedFormValues))
            .set('isValid', initialState.isValid);
      }
      return state;
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
