import { combineReducers } from 'redux';
import AuthReducer from './auth';
import CategoryReducer from './category';
import ProfileReducer from './auth';
import BusinessReducer from './business';
import ApplicationReducer from './application';
import favorites from './favorites';

export default combineReducers({
  auth: AuthReducer,
  categories: CategoryReducer,
  profile: ProfileReducer,
  application: ApplicationReducer,
  businesses: BusinessReducer,
  favorites,
});
