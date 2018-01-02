import React from 'react';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { initializeValues, changeField, submitForm } from './actions';
import Form from '../../components/Form';
import Field from '../../components/Form/Field';
import {
    makeSelectSubmitDisabled,
    makeSelectFormValues,
    makeSelectIsValid,
} from './selectors';
import { fromJS }  from 'immutable';

export class FormContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    if (typeof this.props.fieldData !== 'undefined' && this.props.id !== '') {   
      this.props.initializeValues(this.props.id, this.props.fieldData);
    }
  }

  componentWillReceiveProps(nextProps) {   
    if (typeof nextProps.fieldData !== 'undefined' && !nextProps.fieldData.equals(this.props.fieldData) && nextProps.id !== '') {    
      this.props.initializeValues(nextProps.id, nextProps.fieldData);
    }
  }

  prepareOptions(field) {
    let options = [];
    if (typeof field.get('options') !== 'undefined') {
      return field.get('options')
    } else if (typeof field.get('enum_titles') !== 'undefined') {
      field.get('enum_titles').map((titles, index) => {
        options.push({value: field.get('enum').get(index), label: titles});
      });
      return fromJS(options);
    } else {
      return ImmutableMap({})
    }
    field[1].get('options', ImmutableMap({}))
  }

  renderFields() {
    let fields = [];
    let fieldPointer = null;
    if (typeof this.props.fieldData !== 'undefined' && typeof this.props.fieldData.get('data') !== 'undefined') {      
      for(let index = 0; index <= this.props.fieldData.get('data').size; index++) {
        for(let field of this.props.fieldData.get('data').entries()) {
          if(field[1].get('propertyOrder', 0) === index) {
            fields.push(
              <Field
                key={field[0]}
                id={field[0]}
                fieldData={field[1]}
                labelText={index === 0 ? null : this.props.labels[index-1]}
                fieldType={field[1].get('widget', 'text')}
                onChange={(evt) => this.props.onChangeFieldValue(evt, field[0])}
                value={this.props.formValues.getIn([this.props.id, field[0], 'value'], '')}
                isValid={this.props.formValues.getIn([this.props.id, field[0], 'isValid'])}
                validationMessage={this.props.formValues.getIn([this.props. id, field[0], 'validationMessage'])}
                layout={field[1].get('layout', 'vertical')}
                options={this.prepareOptions(field[1])}
                hideLabel={field[1].get('hideLabel', false)}
                checked={this.props.formValues.getIn([this.props.id, field[0], 'checked'], field[1].get('checked', false))}
                text={field[1].get('text')}
                formLayout={this.props.formLayout}
                defaultOption={field[1].get('default_option', undefined)}
              >
                  {field[1].get('children', null)}
              </Field>     
            );
          }
        }
      }
    }
    return fields;
  }

  renderSubmit() {
    if (typeof this.props.submitLabel !== 'undefined') {
      return <button className={'submit ' + (this.props.submitDisabled ? 'disabled' : '')} disabled={this.props.submitDisabled} onClick={(evt) => this.props.onSubmit(evt, this.props.formValues, this.props.id, this.props.callbackAction, this.props.fieldData)}>{this.props.submitLabel}</button>;
    }

    return null;
  }

  render() {
    return (
      <Form id={this.props.id} onSubmit={(evt) => this.props.onSubmit(evt, this.props.formValues, this.props.id, this.props.callbackAction, this.props.fieldData)} formLayout={this.props.formLayout}>
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
};

FormContainer.defaultProps = {
  id: '',
  endpoint: '',
  submitLabel: null,
  labels: [],
  validation: [],
  formLayout: 'vertical',
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  initializeValues: (id, fieldData) => dispatch(initializeValues(id, fieldData)),
  onChangeFieldValue: (evt, field) => dispatch(changeField(ownProps.id, field, evt.target.value, evt.target.checked, evt.target)),
  onSubmit: (evt, formValues, id, callbackAction, fieldData) => { evt.preventDefault(); return dispatch(submitForm(formValues, ownProps.validation, id, callbackAction, fieldData)); },
});

const mapStateToProps = createStructuredSelector({
  formValues: makeSelectFormValues(),
  isValid: makeSelectIsValid(),
  submitDisabled: makeSelectSubmitDisabled(),
});

const withReducer = injectReducer({ key: 'form', reducer });
const withSaga = injectSaga({ key: 'form', saga });
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(FormContainer);    
