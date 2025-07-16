import { combineReducers } from 'redux';
import auth from './authReducer';
import products from './productReducer';
import cart from './cartReducer';
import orders from './orderReducer';
export default combineReducers({
  auth,
  products,
  cart,
  orders,
});
