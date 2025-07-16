import {
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAIL,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  LOGOUT,
} from '../actions/types';

const initialState = {
  orders: [],
  loading: true,
  error: null,
};

export default function orderReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [payload, ...state.orders],
        loading: false,
        error: null,
      };
    case GET_ORDERS_SUCCESS:
    case GET_ALL_ORDERS_SUCCESS:
      return {
        ...state,
        orders: payload,
        loading: false,
        error: null,
      };
    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === payload._id ? payload : order
        ),
        loading: false,
        error: null,
      };
    case CREATE_ORDER_FAIL:
    case GET_ORDERS_FAIL:
    case GET_ALL_ORDERS_FAIL:
    case UPDATE_ORDER_STATUS_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        orders: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}
