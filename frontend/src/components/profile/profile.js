import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getProfile } from '../../redux/actions/authActions';
import Spinner from '../layout/Spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = ({
  getProfile,
  auth: { user, loading, isAuthenticated, profileError },
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getProfile();
    } else {
      navigate('/login');
    }
  }, [getProfile, isAuthenticated, navigate]);

  if (!isAuthenticated || loading || !user) {
    return <Spinner />;
  }

  if (profileError) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Error: {profileError.msg || 'No se pudo cargar el perfil.'}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Mi Perfil</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Información del Usuario</h5>
          <hr />
          <p className="card-text">
            <strong>Nombre:</strong> {user.name}
          </p>
          <p className="card-text">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="card-text">
            <strong>Rol:</strong>{' '}
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}{' '}
          </p>

          <button
            className="btn btn-primary mt-3"
            onClick={() =>
              toast.info(
                'Funcionalidad de edición de perfil no implementada aún.'
              )
            }
          >
            Editar Perfil
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-3">Mis Pedidos</h3>
        <p>Historial de pedidos se mostrará aquí pronto...</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfile })(Profile);
