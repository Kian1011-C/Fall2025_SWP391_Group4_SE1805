import React from 'react';

const SwapInProgress = ({ swapDetails, isSubmitting, onConfirmSwap, onCancel }) => {
    if (!swapDetails) return null;

    return (
        <div style={styles.container}>
            <div style={styles.badge}>✅ GIAO DỊCH #{swapDetails.swapId}</div>
            <h2 style={styles.title}>Đã tìm thấy pin!</h2>
            <p style={styles.text}>Yêu cầu nhân viên đến vị trí sau để lấy pin mới:</p>
            
            <div style={styles.infoBox}>
                <div style={styles.infoRow}>
                    <span style={styles.label}>Tháp số:</span>
                    <span style={styles.value}>#{swapDetails.towerNumber}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.label}>Hộc (Slot) số:</span>
                    <span style={styles.value}>#{swapDetails.slotNumber}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.label}>Mã Pin Mới:</span>
                    <span style={styles.value}>BAT-{swapDetails.newBatteryId}</span>
                </div>
            </div>

            <p style={styles.text}>Sau khi hoàn tất đổi pin vật lý cho khách hàng, hãy bấm "Xác nhận".</p>

            <div style={styles.buttonGroup}>
                <button onClick={onCancel} style={styles.buttonSecondary}>
                    Hủy
                </button>
                <button onClick={onConfirmSwap} disabled={isSubmitting} style={styles.buttonPrimary}>
                    {isSubmitting ? 'Đang xác nhận...' : 'Xác nhận Hoàn thành'}
                </button>
            </div>
        </div>
    );
};

// CSS
const styles = {
    container: { background: '#1e293b', padding: '30px', borderRadius: '16px', maxWidth: '500px', margin: 'auto', textAlign: 'center' },
    title: { marginTop: 0, color: 'white', fontSize: '24px' },
    text: { color: '#cbd5e1', fontSize: '16px', lineHeight: 1.5 },
    badge: { background: '#166534', color: '#86efac', padding: '8px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '20px', fontWeight: 'bold' },
    infoBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '20px', margin: '25px 0', textAlign: 'left' },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155' },
    label: { color: '#94a3b8' },
    value: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
    buttonGroup: { display: 'flex', gap: '15px', marginTop: '25px' },
    buttonPrimary: { flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
    buttonSecondary: { flex: 1, padding: '12px', background: '#475569', color: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }
};

export default SwapInProgress;