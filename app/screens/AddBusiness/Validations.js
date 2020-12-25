import * as Yup from 'yup';

const generalScheme = Yup.object().shape({
  name: Yup.string().label('Name').required('Please enter name'),
  description: Yup.string()
    .label('Description')
    .typeError('Please enter description'),
  email: Yup.string()
    .label('Email')
    .email('please enter a valid email')
    .typeError('Please enter a registered email'),
  telephone: Yup.string()
    .matches(
      /^((\+92)|(0092)|(021))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{12}$|^\d{4}-\d{7}$/,
      'Phone number is not valid',
    )
    .required('Please enter phone number'),
  website: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    )
    .typeError('Please enter website url'),
  category: Yup.string().label('Category').required('Please select a category'),
  tags: Yup.string().label('Tags').typeError('Please enter tags'),
  established: Yup.date().typeError('Please select established date'),
});
export const generalFormValidation = generalScheme;

const addressScheme = Yup.object().shape({
  address: Yup.string().label('Address').required('Please enter address'),
});
export const addressSFormValidation = addressScheme;
