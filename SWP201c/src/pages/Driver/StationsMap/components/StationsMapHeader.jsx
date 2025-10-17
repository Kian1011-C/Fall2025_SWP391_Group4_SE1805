// Driver/StationsMap/components/StationsMapHeader.jsx
// Header section for stations map page

const StationsMapHeader = () => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h1 style={{ 
        color: '#FFFFFF', 
        margin: '0 0 10px 0',
        fontSize: '2rem'
      }}>
        🗺️ Bản đồ trạm
      </h1>
      <p style={{ color: '#E0E0E0', margin: 0 }}>
        Tìm trạm gần bạn và đặt chỗ
      </p>
    </div>
  );
};

export default StationsMapHeader;
