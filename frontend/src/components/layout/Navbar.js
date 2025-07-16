import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { getCart } from '../../redux/actions/cartActions';

const Navbar = ({
  auth: { isAuthenticated, loading, user },
  logout,
  getCart,
  cart: { cart },
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  const cartItemCount =
    cart && cart.items
      ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
      : 0;

  const authLinks = (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link className="nav-link" to="/products">
          Productos
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/cart">
          <i className="fas fa-shopping-cart"></i> Carrito
          {cartItemCount > 0 && (
            <span className="badge bg-danger ms-1">{cartItemCount}</span>
          )}
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/orders">
          Mis Pedidos
        </Link>
      </li>
      {user && user.role === 'admin' && (
        <li className="nav-item">
          <Link className="nav-link" to="/admin/orders">
            Gestionar Pedidos
          </Link>
        </li>
      )}
      <li className="nav-item">
        <Link className="nav-link" to="/profile">
          <i className="fas fa-user-circle"></i> Mi Perfil
        </Link>
      </li>

      <li className="nav-item">
        <a onClick={logout} href="#!" className="nav-link">
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link className="nav-link" to="/products">
          Productos
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Registro
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Iniciar Sesión
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          FarmaciaApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart,
});

export default connect(mapStateToProps, { logout, getCart })(Navbar);
