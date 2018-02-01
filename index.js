import utilities from '@source4society/scepter-utility-lib';
import React from 'react';
import { fromJS, Map as immutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { initializeValues, changeField, submitForm, blurField, focusField } from './actions';
import Form from '../../components/Form';
import Field from '../../components/Form/Field';
import {
    makeSelectSubmitDisabled,
    makeSelectFormValues,
    makeSelectIsValid,
} from './selectors';

export class FormContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    if (typeof this.props.fieldData !== 'undefined' && this.props.id !== '') {
      this.props.initializeValues(this.props.id, this.props.fieldData, this.props.reducerKey);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.fieldData !== 'undefined' && !nextProps.fieldData.equals(this.props.fieldData) && nextProps.id !== '') {
      this.props.initializeValues(nextProps.id, nextProps.fieldData, nextProps.reducerKey);
    }

    if (nextProps.forceSubmit === true && nextProps.forceSubmit !== this.props.forceSubmit) {
      if (!nextProps.submitDisabled) {
        this.props.onSubmit(new Event('submit form'), nextProps.formValues, nextProps.id, nextProps.callbackAction, nextProps.fieldData, nextProps.reducerKey);
      }
    }
  }

  prepareOptions(field) {
    const options = [];
    if (typeof field.get('options') !== 'undefined') {
      return field.get('options');
    } else if (typeof field.get('enum_titles') !== 'undefined') {
      field.get('enum_titles').map((titles, index) => (
        options.push({ value: field.get('enum').get(index), label: titles })
      ));
      return fromJS(options);
    }

    return immutableMap({});
  }

  renderFields() {
    const fields = [];
    if (typeof this.props.fieldData !== 'undefined' && typeof this.props.fieldData.get('data') !== 'undefined') {
      for (let index = 0; index <= this.props.fieldData.get('data').size; index += 1) {
        this.props.fieldData.get('data').forEach((field, fieldKey) => {
          if (field.get('propertyOrder', 0) === index) {
            fields.push(
              <Field
                key={field.get('propertyOrder')}
                id={fieldKey}
                fieldData={field}
                labelText={index === 0 ? null : this.props.labels[index - 1]}
                fieldType={field.get('widget', 'text')}
                onChange={(evt) => this.props.onChangeFieldValue(evt, fieldKey, this.props.reducerKey, field)}
                value={this.props.formValues.getIn([this.props.id, fieldKey, 'value'], '')}
                isValid={this.props.formValues.getIn([this.props.id, fieldKey, 'isValid'])}
                validationMessage={this.props.formValues.getIn([this.props.id, fieldKey, 'validationMessage'])}
                layout={field.get('layout', 'vertical')}
                options={this.prepareOptions(field)}
                hideLabel={field.get('hideLabel', false)}
                checked={this.props.formValues.getIn(
                  [this.props.id, fieldKey, 'checked'],
                  field.get('checked', false)
                )}
                text={field.get('text')}
                formLayout={this.props.formLayout}
                defaultOption={field.get('default_option', undefined)}
                moreProps={this.props}
                utcOffset={field.get('utcOffset', global.utcOffset)}
                onBlur={(evt) =>
                  this.props.onBlur(evt, this.props.id, this.props.reducerKey, fieldKey, this.props.formValues)
                }
                onFocus={(evt) =>
                  this.props.onFocus(evt, this.props.id, this.props.reducerKey, fieldKey, this.props.formValues)
                }
                fieldOverride={this.props.fieldOverride}
                editMode={this.props.editMode}
              >
                {field.get('children', null)}
              </Field>
            );
          }
        });
      }
    }
    return fields;
  }

  renderSubmit() {
    if (typeof this.props.submitLabel !== 'undefined') {
      return (
        <button
          className={`submit ${utilities.ifTrueElseDefault(this.props.submitDisabled, 'disabled', '')}`}
          disabled={this.props.submitDisabled}
          onClick={(evt) =>
            this.props.onSubmit(evt,
              this.props.formValues,
              this.props.id,
              this.props.callbackAction,
              this.props.fieldData,
              this.props.reducerKey
            )
          }
        >
          {this.props.submitLabel}
        </button>
      );
    }

    return null;
  }

  render() {
    return (
      <Form
        id={this.props.id}
        onSubmit={(evt) =>
          this.props.onSubmit(
            evt,
            this.props.formValues,
            this.props.id,
            this.props.callbackAction,
            this.props.fieldData
          )
        }
        formLayout={this.props.formLayout}
      >
        {this.renderFields()}
        {this.renderSubmit()}
        {this.props.children}
      </Form>
    );
  }

}

FormContainer.propTypes = {
  id: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  fieldData: PropTypes.object,
  formValues: PropTypes.object,
  submitLabel: PropTypes.string,
  initializeValues: PropTypes.func,
  onChangeFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  callbackAction: PropTypes.func,
  submitDisabled: PropTypes.bool,
  reducerKey: PropTypes.string,
  fieldOverride: PropTypes.func,
  forceSubmit: PropTypes.bool,
  formLayout: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  editMode: PropTypes.bool,
  children: PropTypes.any,
};

FormContainer.defaultProps = {
  id: '',
  endpoint: '',
  submitLabel: undefined,
  labels: [],
  validation: [],
  formLayout: 'vertical',
  forceSubmit: false,
  reducerKey: 'form',
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  initializeValues: (id, fieldData, reducerKey) =>
    dispatch(initializeValues(id, fieldData, reducerKey)),
  onChangeFieldValue: (evt, field, reducerKey, fieldData) =>
    dispatch(changeField(ownProps.id, field, evt.target.value, evt.target.checked, evt.target, reducerKey, fieldData)),
  onSubmit: (evt, formValues, id, callbackAction, fieldData, reducerKey) => {
    evt.preventDefault();
    return dispatch(submitForm(formValues, ownProps.validation, id, callbackAction, fieldData, reducerKey));
  },
  onBlur: (evt, formTitle, reducerKey, property, formValues) =>
    dispatch(blurField(evt, formTitle, reducerKey, property, formValues)),
  onFocus: (evt, formTitle, reducerKey, property, formValues) =>
    dispatch(focusField(evt, formTitle, reducerKey, property, formValues)),
});

const mapStateToProps = (state, ownProps) => (
  createStructuredSelector({
    formValues: makeSelectFormValues(ownProps.reducerKey),
    isValid: makeSelectIsValid(ownProps.reducerKey),
    submitDisabled: makeSelectSubmitDisabled(ownProps.reducerKey),
  })
);

const withReducer = injectReducer({ key: 'form', reducer, isNamespaced: true });
const withSaga = injectSaga({ key: 'form', saga });
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(FormContainer);
