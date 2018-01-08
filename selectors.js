/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectForm = (key = 'form') => (state) => state.get(key)

const makeSelectFormValues = (formIdentifier) => createSelector(
  selectForm(formIdentifier),
  (formState) => formState.get('formValues')
);

const makeSelectIsValid = (formIdentifier) => createSelector(
  selectForm(formIdentifier),
  (formState) => formState.get('isValid')
);

const makeSelectSubmitDisabled = (formIdentifier) => createSelector(
  selectForm(formIdentifier),
  (formState) => formState.get('submitDisabled')
);

export {
    selectForm,
    makeSelectFormValues,
    makeSelectIsValid,
    makeSelectSubmitDisabled,
};
