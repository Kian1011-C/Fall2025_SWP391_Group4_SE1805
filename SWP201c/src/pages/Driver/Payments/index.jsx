// src/pages/Driver/Payments/index.jsx
import React, { useState, useEffect } from 'react';
import '/src/assets/css/payment.css';
import { useNavigate } from 'react-router-dom';
// ❗️ Đảm bảo bạn import file CSS (nếu cần, ví dụ file CSS chung của dashboard)
// import './Payment.css'; // (Hoặc import file CSS của riêng bạn)

// Import các component con
import PaymentHistorySection from './components/PaymentHistorySection';

// Import service và context
import paymentService from '/src/assets/js/services/paymentService.js'; // ❗️ Đảm bảo đường dẫn này đúng
import { useAuth } from '/src/context/AuthContext.jsx'; // 👈 Lấy AuthContext (để lấy userId)

// ==========================================================
// ✨ CÁC HÀM HELPER (Nên chuyển vào file utils) ✨
// ==========================================================
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Định dạng ngày giờ chuẩn Việt Nam
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        console.error("Lỗi format ngày:", e);
        return dateString; // Trả về nguyên bản nếu lỗi
    }
};

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0 VND';
    // Format tiền tệ VND
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusStyle = (status) => {
    // ✅ Dựa trên các giá trị status từ Backend (PaymentController & PaymentDao)
    switch (status?.toLowerCase()) {
        case 'success':
        case 'completed':
            return { text: 'Thành công', background: '#ecfdf5', color: '#16a34a' }; // Green
        case 'failed':
        case 'refund':
            return { text: 'Thất bại', background: '#fef2f2', color: '#dc2626' }; // Red
        case 'in_progress':
        case 'pending':
        case 'initiated':
            return { text: 'Chưa thanh toán', background: '#fffbeb', color: '#f59e0b' }; // Yellow
        default:
            return { text: status || 'Không rõ', background: '#f1f5f9', color: '#475569' }; // Gray
    }
};
// ==========================================================
// ✨ KẾT THÚC HELPER ✨
// ==========================================================


// Component Trang Thanh Toán Chính
const DriverPayments = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Lấy thông tin user (để lấy userId)

    // State
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [pendingInvoices, setPendingInvoices] = useState([]); // ✅ Hóa đơn chưa thanh toán (in_progress)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        console.log('🚀 [Driver Payments] Component mounted');
        console.log('👤 [Driver Payments] Current User:', currentUser);
        
        // ✅ Fix: Dùng currentUser.id hoặc currentUser.userId
        const userId = currentUser?.userId || currentUser?.id;
        
        if (!userId) {
            console.error('❌ [Driver Payments] No userId found!');
            setLoading(false);
            setError("Vui lòng đăng nhập để xem lịch sử thanh toán.");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('🔍 [Driver Payments] Fetching payments for userId:', userId);
                
                // ✅ Lấy danh sách thanh toán từ backend (đã có payment_url)
                const historyResult = await paymentService.getUserPayments(userId);
                
                console.log('📦 [Driver Payments] API Response:', historyResult);
                
                if (historyResult.success) {
                    const allPayments = historyResult.data || [];
                    
                    console.log('✅ [Driver Payments] Total payments:', allPayments.length);
                    console.log('📋 [Driver Payments] All payments:', allPayments);
                    
                    // ✅ Tách hóa đơn chưa thanh toán (in_progress) và lịch sử
                    const pending = allPayments.filter(p => {
                        const isPending = p.status?.toLowerCase() === 'in_progress';
                        console.log(`🔍 Payment ${p.paymentId}: status="${p.status}" → isPending=${isPending}`);
                        return isPending;
                    });
                    const history = allPayments.filter(p => p.status?.toLowerCase() !== 'in_progress');
                    
                    console.log('⏳ [Driver Payments] Pending invoices:', pending.length, pending);
                    console.log('✔️ [Driver Payments] Completed payments:', history.length);
                    
                    setPendingInvoices(pending);
                    setPaymentHistory(history);
                } else {
                    throw new Error(historyResult.message || "Lỗi tải lịch sử thanh toán.");
                }

                // (Optional: Lấy hóa đơn hiện tại nếu có)
                // const invoiceResult = await paymentService.getCurrentBill(currentUser.userId);
                // if (invoiceResult.success) {
                //    setCurrentInvoice(invoiceResult.data);
                // }

            } catch (err) {
                console.error("Error fetching payment data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]); // Chạy lại nếu user thay đổi

    // Hàm xử lý khi nhấn "Xem chi tiết" (truyền xuống PaymentCard)
    const handleViewDetails = (payment) => {
        console.log("Xem chi tiết thanh toán:", payment);
        // (Optional: Navigate đến trang chi tiết hoặc mở Modal)
        // navigate(`/driver/payments/${payment.payment_id}`);
    };

    // Hàm xử lý khi nhấn nút "Thanh toán" (cho hóa đơn hiện tại)
    const handleGoToCheckout = () => {
        // Điều hướng đến trang thanh toán hóa đơn tháng
        navigate('/driver/payments/monthly-billing');
    };

    if (loading) {
        return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu thanh toán...</div>;
    }

    return (
        // Sử dụng class CSS chung của layout (ví dụ)
        <div className="driver-dashboard" style={{ padding: '24px' }}>
            {/* Tiêu đề trang */}
            <h1 style={{ color: 'white', marginBottom: '24px', fontSize: '1.875rem', fontWeight: '700' }}>
                Thanh toán
            </h1>

            {/* --- PHẦN HÓA ĐƠN CẦN THANH TOÁN --- */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                    background: '#1f2937', 
                    padding: '24px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                }}>
                    <h3 style={{ 
                        color: 'white', 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        margin: '0 0 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        💳 Hóa đơn cần thanh toán
                    </h3>

                    {pendingInvoices.length === 0 ? (
                        // ✅ Hiển thị khi chưa có hóa đơn
                        <div style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            border: '2px dashed rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                            <h4 style={{ 
                                color: '#d1d5db', 
                                fontSize: '1.125rem', 
                                fontWeight: '600',
                                margin: '0 0 8px' 
                            }}>
                                Chưa có hóa đơn cần thanh toán
                            </h4>
                            <p style={{ 
                                color: '#9ca3af', 
                                fontSize: '0.95rem',
                                margin: 0 
                            }}>
                                Khi Admin xuất hóa đơn, hóa đơn sẽ hiển thị tại đây
                            </p>
                        </div>
                    ) : (
                        // ✅ Hiển thị danh sách hóa đơn chưa thanh toán
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {pendingInvoices.map((invoice) => (
                                <div 
                                    key={invoice.paymentId}
                                    style={{
                                        padding: '20px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                    }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: '15px'
                                    }}>
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <div style={{ 
                                                color: '#FFFFFF', 
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                marginBottom: '8px'
                                            }}>
                                                {invoice.vnpOrderInfo || 'Thanh toán hợp đồng'}
                                            </div>
                                            <div style={{ 
                                                color: '#d1d5db',
                                                fontSize: '0.9rem',
                                                marginBottom: '5px'
                                            }}>
                                                🕒 Ngày tạo: {formatDate(invoice.createdAt)}
                                            </div>
                                            <div style={{ 
                                                color: '#d1d5db',
                                                fontSize: '0.85rem'
                                            }}>
                                                📄 Mã GD: {invoice.transactionRef}
                                            </div>
                                        </div>
                                        
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ 
                                                color: '#60a5fa',
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                marginBottom: '12px'
                                            }}>
                                                {formatCurrency(invoice.amount)}
                                            </div>
                                            
                                            <button
                                                onClick={() => {
                                                    if (invoice.paymentUrl) {
                                                        window.location.href = invoice.paymentUrl;
                                                    }
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 20px',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                                                }}
                                            >
                                                💳 Thanh toán ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- PHẦN LỊCH SỬ THANH TOÁN (Component bạn đã gửi) --- */}
            <PaymentHistorySection
                paymentHistory={paymentHistory}
                error={error} // Truyền lỗi xuống
                onViewDetails={handleViewDetails}
                // Truyền các hàm helper
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getStatusStyle={getStatusStyle}
            />
        </div>
    );
};

export default DriverPayments;