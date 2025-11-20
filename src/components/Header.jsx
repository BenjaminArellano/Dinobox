import React from 'react';
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <header className="dino-header text-white py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <div className="logo-container me-3">
                <div className="logo-placeholder">
                    <img src={logo} alt="Dinobox Logo" className="logo-image"
                    style={{ width: '70px', height: '150px', objectFit: 'contain' }}
                  />
                </div>
              </div>
              
              <div className="brand-text">
                <h1 className="h3 mb-1 fw-bold">Dinobox</h1>
                <p className="dino-subtitle mb-0">A un rawr de tu casa</p>
              </div>
            </div>
          </div>

          <div className="col"></div>

          <div className="col-auto">
            <div className="bg-white bg-opacity-10 px-3 py-2 rounded-pill">
              <small className="fw-semibold">Sistema de Gestión</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;