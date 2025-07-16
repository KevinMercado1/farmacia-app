import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getCart,
  removeProductFromCart,
  updateCartItemQuantity,
  clearCart,
} from '../../redux/actions/cartActions';
import Spinner from '../layout/Spinner';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({
  getCart,
  removeProductFromCart,
  updateCartItemQuantity,
  clearCart,
  cart: { cart, loading, error },
  isAuthenticated,
  user,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning text-center mt-5" role="alert">
        Por favor, <Link to="/login">inicia sesión</Link> para ver tu carrito.
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const onRemoveClick = (productId) => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar este producto del carrito?'
      )
    ) {
      removeProductFromCart(productId);
    }
  };

  const onUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveClick(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const onClearCartClick = () => {
    if (
      window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')
    ) {
      clearCart();
    }
  };

  const onCheckoutClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Tu Carrito de Compras</h1>
      {cart.items.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Tu carrito está vacío.{' '}
          <Link to="/products">¡Explora nuestros productos!</Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col" className="text-center">
                    Cantidad
                  </th>
                  <th scope="col" className="text-end">
                    Precio Unitario
                  </th>
                  <th scope="col" className="text-end">
                    Subtotal
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            item.product.imageUrl ||
                            'https://via.placeholder.com/50'
                          }
                          alt={item.product.name}
                          className="img-thumbnail me-3"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <strong>{item.product.name}</strong>
                          <br />
                          <small className="text-muted">
                            {item.product.category}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>
                      {item.quantity > item.product.stock && (
                        <div className="text-danger small mt-1">
                          Solo quedan {item.product.stock} en stock.
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      ${item.product.price.toFixed(2)}
                    </td>
                    <td className="text-end">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onRemoveClick(item.product._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
            <h4>
              Total:{' '}
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </h4>
            <div>
              <button
                className="btn btn-outline-danger me-2"
                onClick={onClearCartClick}
              >
                Vaciar Carrito
              </button>
              <button
                className="btn btn-primary"
                onClick={onCheckoutClick}
                disabled={cart.items.length === 0}
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getCart,
  removeProductFromCart,
  updateCartItemQuantity,
  clearCart,
})(Cart);
