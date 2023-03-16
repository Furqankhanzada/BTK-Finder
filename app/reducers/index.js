import { combineReducers } from 'redux';
import CategoryReducer from './category';
import BusinessReducer from './business';
import ApplicationReducer from './application';
import favorites from './favorites';

export default combineReducers({
  categories: CategoryReducer,
  application: ApplicationReducer,
  businesses: BusinessReducer,
  favorites,
});
