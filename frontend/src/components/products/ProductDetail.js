import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../redux/actions/productActions';
import { addToCart } from '../../redux/actions/cartActions';
import Spinner from '../layout/Spinner';
import { toast } from 'react-toastify';

const ProductDetail = ({
  getProductById,
  addToCart,
  products: { product, loading, error },
  isAuthenticated,
  user,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductById(id);
  }, [getProductById, id]);

  const onAddToCartClick = () => {
    if (isAuthenticated && product) {
      addToCart(product._id, 1);
    } else {
      toast.info('Debes iniciar sesión para añadir productos al carrito');
      navigate('/login');
    }
  };

  if (loading || !product) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Error: {error.msg || 'Producto no encontrado.'}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate('/products')}
      >
        <i className="fas fa-arrow-left me-2"></i> Volver a Productos
      </button>
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            className="img-fluid rounded shadow-sm"
            alt={product.name}
            style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
          />
          {product.stock === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '0%',
                left: '0%',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                pointerEvents: 'none',
              }}
            >
              AGOTADO
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted mb-2">Categoría: {product.category}</p>
          <p className="lead">{product.description}</p>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-4">
            {product.stock > 0 ? (
              <h3 className="mb-0 text-primary">${product.price.toFixed(2)}</h3>
            ) : (
              <h3 className="mb-0 text-danger">Agotado</h3>
            )}
            <span
              className={`badge ${
                product.stock > 0 ? 'bg-success' : 'bg-danger'
              } p-2`}
            >
              Stock: {product.stock}
            </span>
          </div>

          {isAuthenticated &&
            user &&
            user.role === 'customer' &&
            product.stock > 0 && (
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={onAddToCartClick}
              >
                <i className="fas fa-cart-plus me-2"></i> Añadir al Carrito
              </button>
            )}

          {isAuthenticated && user && user.role === 'admin' && (
            <div className="mt-3">
              <button
                className="btn btn-info w-100 mb-2"
                onClick={() => navigate(`/products/edit/${product._id}`)}
              >
                <i className="fas fa-edit me-2"></i> Editar Producto
              </button>
              <button
                className="btn btn-danger w-100"
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Estás seguro de que quieres eliminar este producto?'
                    )
                  ) {
                  }
                }}
              >
                <i className="fas fa-trash me-2"></i> Eliminar Producto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getProductById, addToCart })(
  ProductDetail
);
