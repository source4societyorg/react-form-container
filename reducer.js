import { fromJS, Map as ImmutableMap } from 'immutable';

import {
  FORM_INITIALIZED,
  CHANGE_FIELD,
  SUBMITTED_FORM
} from './constants';

const initialState = fromJS({
  formValues: {},
  isValid: false,
});

function formReducer(state = initialState, action) {
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
    case SUBMITTED_FORM:
      return state
        .set('formValues', action.formValues)
        .set('isValid', action.isValid)
    default:
      return state;
  }
}

export default formReducer;
