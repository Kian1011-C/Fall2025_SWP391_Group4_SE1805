import React from 'react';
import { useApp } from '../../context/AppContext';
import { showToast } from '../../assets/js/helpers/helpers';

const RegisterModal = () => {
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal } = useApp();

  return (
    <div className="modal" style={{ display: showRegisterModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Đăng ký tài khoản</h3>
          <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          showToast('Đăng ký thành công! Vui lòng đăng nhập.');
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" required />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" required />
            </div>
          </div>
          <div className="form-group">
            <label>Loại tài khoản</label>
            <select required>
              <option value="driver">Người dùng (Driver)</option>
              <option value="staff">Nhân viên (Staff)</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowRegisterModal(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary">Đăng ký</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;


