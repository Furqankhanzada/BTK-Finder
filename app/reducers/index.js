import { combineReducers } from 'redux';
import ApplicationReducer from './application';

export default combineReducers({
  application: ApplicationReducer,
});
