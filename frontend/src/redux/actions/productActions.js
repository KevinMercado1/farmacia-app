import axios from 'axios';
import { toast } from 'react-toastify';
import {
  PRODUCTS_ERROR,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID_SUCCESS,
  GET_PRODUCT_BY_ID_FAIL,
} from './types';

export const getProducts =
  (search = '', category = '', stockStatus = 'inStock') =>
  async (dispatch) => {
    try {
      let url = '/api/products';
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (stockStatus && stockStatus !== 'all')
        params.append('stockStatus', stockStatus);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: PRODUCTS_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });

      const errorMessage =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : 'Error al cargar los productos.';
      toast.error(errorMessage);
    }
  };

export const getProductById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/products/${id}`);
    dispatch({
      type: GET_PRODUCT_BY_ID_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_PRODUCT_BY_ID_FAIL,
      payload: {
        msg: err.response?.data?.msg || err.message,
        status: err.response?.status,
      },
    });
    toast.error(
      err.response?.data?.msg || 'Error al cargar el detalle del producto.'
    );
  }
};

export const addProduct = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/products', formData);
    dispatch({
      type: ADD_PRODUCT,
      payload: res.data,
    });
    toast.success('Producto añadido correctamente.');
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al añadir el producto.';
    toast.error(errorMessage);
  }
};

export const updateProduct = (id, formData) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/products/${id}`, formData);
    dispatch({
      type: UPDATE_PRODUCT,
      payload: res.data,
    });
    toast.success('Producto actualizado correctamente.');
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al actualizar el producto.';
    toast.error(errorMessage);
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/products/${id}`);
    dispatch({
      type: DELETE_PRODUCT,
      payload: id,
    });
    toast.info('Producto eliminado.');
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errorMessage =
      err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Error al eliminar el producto.';
    toast.error(errorMessage);
  }
};
