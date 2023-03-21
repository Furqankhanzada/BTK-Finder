import { combineReducers } from 'redux';
import BusinessReducer from './business';
import ApplicationReducer from './application';

export default combineReducers({
  application: ApplicationReducer,
  businesses: BusinessReducer,
});
