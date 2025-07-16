import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAIL,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL,
} from './types';

export const getMyOrders = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/orders');
    dispatch({
      type: GET_ORDERS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ORDERS_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getAllOrders = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/orders/all');
    dispatch({
      type: GET_ALL_ORDERS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ALL_ORDERS_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const createOrder = (shippingAddress) => async (dispatch) => {
  try {
    const res = await axios.post('/api/orders', { shippingAddress });
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: res.data,
    });
    toast.success('¡Pedido realizado con éxito!');
  } catch (err) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: {
        msg: err.response.data.msg || err.response.statusText,
        status: err.response.status,
      },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al crear el pedido.';
    toast.error(errorMessage);
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/orders/${orderId}/status`, { status });
    dispatch({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: res.data,
    });
    toast.success(
      `Estado del pedido ${orderId.substring(0, 6)}... actualizado a ${status}!`
    );
  } catch (err) {
    dispatch({
      type: UPDATE_ORDER_STATUS_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al actualizar el estado del pedido.';
    toast.error(errorMessage);
  }
};
