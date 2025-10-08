// Admin Stations Management - Refactored
import React from 'react';
import useStationStore from '../../../assets/js/store/stationSlice';

const AdminStations = () => {
  const { stations, isLoading, createStation, updateStation, deleteStation } = useStationStore();
  
  const [showModal, setShowModal] = React.useState(false);
  const [editingStation, setEditingStation] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '', address: '', phone: '', manager: '', totalSlots: 20
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStation) {
      await updateStation(editingStation.id, formData);
    } else {
      await createStation(formData);
    }
    setShowModal(false);
    setFormData({ name: '', address: '', phone: '', manager: '', totalSlots: 20 });
    setEditingStation(null);
  };

  const openEditModal = (station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      phone: station.phone,
      manager: station.manager,
      totalSlots: station.totalSlots
    });
    setShowModal(true);
  };

  if (isLoading) return <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>🏢 Quản lý trạm (Admin)</h2>
        <button
          onClick={() => { setShowModal(true); setEditingStation(null); setFormData({ name: '', address: '', phone: '', manager: '', totalSlots: 20 }); }}
          style={{ padding: '12px 24px', background: '#19c37d', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
        >
          + Thêm trạm
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {stations?.map(station => (
          <div key={station.id} style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>{station.name}</h3>
            <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '8px' }}>📍 {station.address}</div>
            <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '8px' }}>👤 {station.manager}</div>
            <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '8px' }}>📞 {station.phone}</div>
            <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '16px' }}>
              🔋 Slots: {station.availableBatteries || 0}/{station.totalSlots}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => openEditModal(station)}
                style={{ flex: 1, padding: '8px', background: '#4F8CFF', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
              >
                Sửa
              </button>
              <button
                onClick={() => { if(window.confirm('Xóa?')) deleteStation(station.id); }}
                style={{ flex: 1, padding: '8px', background: '#ff4757', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'rgba(26,32,44,0.95)', borderRadius: '12px', padding: '30px', width: '500px', maxWidth: '90vw' }}>
            <h3>{editingStation ? 'Sửa trạm' : 'Thêm trạm mới'}</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="Tên trạm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff' }} required />
              <input placeholder="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff' }} required />
              <input placeholder="Quản lý" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff' }} required />
              <input placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff' }} required />
              <input type="number" placeholder="Số slots" value={formData.totalSlots} onChange={e => setFormData({...formData, totalSlots: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '10px', marginBottom: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff' }} required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#19c37d', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                  {editingStation ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;

