import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCart } from '../../redux/actions/cartActions';
import { createOrder } from '../../redux/actions/orderActions';
import Spinner from '../layout/Spinner';
import { useNavigate } from 'react-router-dom';

const Checkout = ({
  getCart,
  createOrder,
  cart: { cart, loading: cartLoading },
  isAuthenticated,
  user,
}) => {
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  useEffect(() => {
    if (!isAuthenticated && !cartLoading) {
      navigate('/login');
    } else if (cart && cart.items.length === 0 && !cartLoading) {
      alert(
        'Tu carrito está vacío. Por favor, añade productos antes de proceder al pago.'
      );
      navigate('/products');
    }
  }, [isAuthenticated, cart, cartLoading, navigate]);

  const { street, city, state, zip, country } = shippingAddress;

  const onChange = (e) =>
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    createOrder(shippingAddress);

    alert('¡Pedido realizado con éxito!');
    navigate('/orders');
  };

  if (!isAuthenticated || cartLoading || !cart || cart.items.length === 0) {
    return <Spinner />;
  }

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h1 className="text-center mb-4">Proceder al Pago</h1>

              <h3 className="mb-3">Resumen del Pedido</h3>
              <ul className="list-group mb-4">
                {cart.items.map((item) => (
                  <li
                    key={item.product._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.product.name} x {item.quantity}
                      <br />
                      <small className="text-muted">
                        ${item.product.price.toFixed(2)} c/u
                      </small>
                    </div>
                    <span className="fw-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between align-items-center bg-light fw-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </li>
              </ul>

              <h3 className="mb-3">Dirección de Envío</h3>
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="street" className="form-label">
                    Calle y Número
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    value={street}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={city}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label">
                      Estado/Departamento
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={state}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="zip" className="form-label">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="zip"
                      value={zip}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">
                      País
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={country}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Confirmar Pedido (${totalAmount.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/cart')}
                  >
                    Volver al Carrito
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getCart, createOrder })(Checkout);
