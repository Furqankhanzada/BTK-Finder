import { combineReducers } from 'redux';
import AuthReducer from './auth';
import CategoryReducer from './category';
import ApplicationReducer from './application';

export default combineReducers({
  auth: AuthReducer,
  categories: CategoryReducer,
  application: ApplicationReducer,
});
