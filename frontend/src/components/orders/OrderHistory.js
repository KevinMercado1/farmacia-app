import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getMyOrders } from '../../redux/actions/orderActions';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

const OrderHistory = ({
  getMyOrders,
  orders: { orders, loading, error },
  isAuthenticated,
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      getMyOrders();
    }
  }, [isAuthenticated, getMyOrders]);

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning text-center mt-5" role="alert">
        Por favor, <Link to="/login">inicia sesión</Link> para ver tu historial
        de pedidos.
      </div>
    );
  }

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

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Mi Historial de Pedidos</h1>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Aún no tienes pedidos. ¡Explora nuestros{' '}
          <Link to="/products">productos</Link> para empezar!
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Pedido #{order._id.substring(0, 8)}...
                  </h5>
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
                </div>
                <div className="card-body">
                  <p>
                    <strong>Fecha:</strong>{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Artículos:</strong>
                  </p>
                  <ul className="list-group list-group-flush mb-3">
                    {order.items.map((item) => (
                      <li
                        key={item._id}
                        className="list-group-item d-flex justify-content-between align-items-center py-2"
                      >
                        <span>
                          {item.product
                            ? item.product.name
                            : 'Producto Eliminado'}{' '}
                          x {item.quantity}
                        </span>
                        <span>${item.priceAtOrder.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-0">
                    <strong>Dirección de Envío:</strong>
                  </p>
                  <address className="small text-muted mb-0">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    , {order.shippingAddress.state} {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </address>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  orders: state.orders,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getMyOrders })(OrderHistory);
