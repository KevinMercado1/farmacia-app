import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  addProduct,
  updateProduct,
  getProducts,
} from '../../redux/actions/productActions';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = ({
  addProduct,
  updateProduct,
  getProducts,
  products: { products, loading },
  currentProduct = null,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: '',
  });

  // Efecto para precargar datos si estamos editando un producto
  useEffect(() => {
    if (id && products.length > 0 && !loading) {
      const productToEdit = products.find((p) => p._id === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          price: productToEdit.price,
          stock: productToEdit.stock,
          imageUrl: productToEdit.imageUrl,
          category: productToEdit.category,
        });
      }
    } else if (id && products.length === 0 && loading) {
      getProducts();
    } else if (!id) {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        category: '',
      });
    }
  }, [id, products, loading, getProducts]);

  const { name, description, price, stock, imageUrl, category } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (id) {
      updateProduct(id, formData);
    } else {
      addProduct(formData);
    }
    navigate('/products');
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8 col-lg-7">
        <div className="card shadow-lg">
          <div className="card-body p-4">
            <h1 className="text-center mb-4">
              {id ? 'Editar Producto' : 'Añadir Producto'}
            </h1>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Precio
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={price}
                    onChange={onChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={stock}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="imageUrl"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Categoría
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={category}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary">
                  {id ? 'Actualizar Producto' : 'Añadir Producto'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/products')}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
});

export default connect(mapStateToProps, {
  addProduct,
  updateProduct,
  getProducts,
})(ProductForm);
