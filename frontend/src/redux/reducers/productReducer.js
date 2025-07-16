import {
  GET_PRODUCTS,
  PRODUCTS_ERROR,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT_BY_ID_SUCCESS,
  GET_PRODUCT_BY_ID_FAIL,
} from '../actions/types';

const initialState = {
  products: [],
  product: null,
  loading: true,
  error: null,
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };

    case ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
        loading: false,
      };

    case GET_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        product: action.payload,
        loading: false,
        error: null,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),

        product:
          state.product && state.product._id === action.payload
            ? null
            : state.product,
        loading: false,
      };

    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        product:
          state.product && state.product._id === action.payload._id
            ? action.payload
            : state.product,
        loading: false,
      };

    case PRODUCTS_ERROR:
    case GET_PRODUCT_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
        product: null,
      };
    default:
      return state;
  }
}
