import { combineReducers } from 'redux';
import AuthReducer from './auth';
import CategoryReducer from './category';
import ProfileReducer from './profile';
import ApplicationReducer from './application';

export default combineReducers({
  auth: AuthReducer,
  categories: CategoryReducer,
  profile: ProfileReducer,
  application: ApplicationReducer,
});
