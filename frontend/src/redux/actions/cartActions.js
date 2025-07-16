import axios from 'axios';
import { toast } from 'react-toastify';
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
} from './types';

export const getCart = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/cart');
    dispatch({
      type: GET_CART_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_CART_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addToCart = (productId, quantity) => async (dispatch) => {
  try {
    const res = await axios.post('/api/cart', { productId, quantity });
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: res.data,
    });
    toast.success(
      `${
        res.data.items.find((item) => item.product._id === productId).product
          .name
      } añadido al carrito!`
    );
  } catch (err) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al añadir producto al carrito';
    toast.error(errorMessage);
  }
};

export const removeProductFromCart = (productId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/cart/${productId}`);
    dispatch({
      type: REMOVE_FROM_CART_SUCCESS,
      payload: res.data,
    });
    toast.info('Producto eliminado del carrito.');
  } catch (err) {
    dispatch({
      type: REMOVE_FROM_CART_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al eliminar producto del carrito';
    toast.error(errorMessage);
  }
};

export const updateCartItemQuantity =
  (productId, quantity) => async (dispatch) => {
    try {
      const res = await axios.post('/api/cart', { productId, quantity });
      dispatch({
        type: UPDATE_CART_ITEM_SUCCESS,
        payload: res.data,
      });
      toast.success('Cantidad del producto actualizada.');
    } catch (err) {
      dispatch({
        type: UPDATE_CART_ITEM_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
      const errorMessage =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : 'Error al actualizar la cantidad.';
      toast.error(errorMessage);
    }
  };

export const clearCart = () => async (dispatch) => {
  try {
    await axios.delete('/api/cart');
    dispatch({
      type: CLEAR_CART_SUCCESS,
    });
    toast.info('Carrito vaciado.');
  } catch (err) {
    dispatch({
      type: CLEAR_CART_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al vaciar el carrito.';
    toast.error(errorMessage);
  }
};
