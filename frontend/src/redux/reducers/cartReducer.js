import {
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  GET_CART_SUCCESS,
  GET_CART_FAIL,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAIL,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAIL,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAIL,
  LOGOUT,
} from '../actions/types';

const initialState = {
  cart: {
    items: [],
  },
  loading: true,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CART_SUCCESS:
    case ADD_TO_CART_SUCCESS:
    case REMOVE_FROM_CART_SUCCESS:
    case UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        cart: payload,
        loading: false,
        error: null,
      };
    case CLEAR_CART_SUCCESS:
    case LOGOUT:
      return {
        ...state,
        cart: { items: [] },
        loading: false,
        error: null,
      };
    case GET_CART_FAIL:
    case ADD_TO_CART_FAIL:
    case REMOVE_FROM_CART_FAIL:
    case UPDATE_CART_ITEM_FAIL:
    case CLEAR_CART_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default cartReducer;
