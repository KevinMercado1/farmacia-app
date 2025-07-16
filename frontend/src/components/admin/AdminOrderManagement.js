import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  getAllOrders,
  updateOrderStatus,
} from '../../redux/actions/orderActions';
import Spinner from '../layout/Spinner';
import { useNavigate } from 'react-router-dom';

const AdminOrderManagement = ({
  getAllOrders,
  updateOrderStatus,
  orders: { orders, loading, error },
  isAuthenticated,
  user,
}) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'admin')) {
      navigate('/login');
    } else {
      getAllOrders();
    }
  }, [isAuthenticated, user, navigate, getAllOrders]);

  const handleStatusChange = (orderId, newStatus) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres cambiar el estado de este pedido a "${newStatus}"?`
      )
    ) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Error al cargar los pedidos: {error.msg || 'Error desconocido'}
      </div>
    );
  }

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Gestión de Pedidos (Admin)</h1>

      <div className="mb-3">
        <label htmlFor="filterStatus" className="form-label">
          Filtrar por Estado:
        </label>
        <select
          className="form-select w-auto"
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="processing">En Procesamiento</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No hay pedidos{' '}
          {filterStatus !== 'all' ? `con estado "${filterStatus}"` : ''}{' '}
          disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Pedido</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>
                    {order.user ? order.user.username : 'Usuario Desconocido'}
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        order.status === 'pending'
                          ? 'warning'
                          : order.status === 'processing'
                          ? 'info'
                          : order.status === 'shipped'
                          ? 'primary'
                          : order.status === 'delivered'
                          ? 'success'
                          : 'danger'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pendiente</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  orders: state.orders,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getAllOrders, updateOrderStatus })(
  AdminOrderManagement
);
