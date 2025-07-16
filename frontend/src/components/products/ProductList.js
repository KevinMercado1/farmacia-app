import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getProducts, deleteProduct } from '../../redux/actions/productActions';
import { addToCart } from '../../redux/actions/cartActions';
import Spinner from '../layout/Spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductList = ({
  getProducts,
  deleteProduct,
  addToCart,
  products: { products, loading, error },
  isAuthenticated,
  user,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [stockStatusFilter, setStockStatusFilter] = useState('inStock');

  useEffect(() => {
    getProducts(searchQuery, categoryFilter, stockStatusFilter);
  }, [getProducts, searchQuery, categoryFilter, stockStatusFilter]);

  const onDeleteClick = (id) => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar este producto?')
    ) {
      deleteProduct(id);
    }
  };

  const onAddToCartClick = (productId) => {
    if (isAuthenticated) {
      addToCart(productId, 1);
    } else {
      toast.info('Debes iniciar sesión para añadir productos al carrito.');
      navigate('/login');
    }
  };

  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  if (loading) {
    return <Spinner />;
  }

  if (error && error.msg) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Error: {error.msg}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Nuestros Productos</h1>

      <div className="row mb-4 align-items-center">
        <div className="col-md-5 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2 mb-md-0">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las Categorías</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-2 mb-md-0">
          {isAuthenticated && user && user.role === 'admin' ? (
            <select
              className="form-select"
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="inStock">En Stock</option>
              <option value="outOfStock">Agotados</option>
            </select>
          ) : (
            <select className="form-select" value="inStock" disabled>
              <option value="inStock">En Stock</option>
            </select>
          )}
        </div>
        <div className="col-md-2 text-md-end">
          {isAuthenticated && user && user.role === 'admin' && (
            <button
              className="btn btn-success w-100"
              onClick={() => navigate('/products/add')}
            >
              Añadir Nuevo Producto
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {products.length === 0 ? (
          <p className="text-center">
            No hay productos disponibles que coincidan con tu búsqueda/filtro.
          </p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <Link
                  to={`/products/${product._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={
                        product.imageUrl || 'https://via.placeholder.com/150'
                      }
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    {product.stock === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          pointerEvents: 'none',
                        }}
                      >
                        AGOTADO
                      </div>
                    )}
                  </div>
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.category}</p>
                  <p className="card-text">
                    {product.description.substring(0, 70)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    {product.stock > 0 ? (
                      <>
                        <h4 className="mb-0 text-primary">
                          ${product.price.toFixed(2)}
                        </h4>
                        {isAuthenticated && user && user.role === 'admin' ? (
                          <div>
                            <button
                              className="btn btn-sm btn-outline-info me-2"
                              onClick={() =>
                                navigate(`/products/edit/${product._id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDeleteClick(product._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        ) : (
                          isAuthenticated &&
                          user &&
                          user.role === 'customer' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => onAddToCartClick(product._id)}
                            >
                              Añadir al Carrito
                            </button>
                          )
                        )}
                      </>
                    ) : (
                      <>
                        <h4 className="mb-0 text-danger">Agotado</h4>
                        {isAuthenticated && user && user.role === 'admin' && (
                          <div>
                            <button
                              className="btn btn-sm btn-outline-info me-2"
                              onClick={() =>
                                navigate(`/products/edit/${product._id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDeleteClick(product._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-sm">Stock: {product.stock}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getProducts,
  deleteProduct,
  addToCart,
})(ProductList);
