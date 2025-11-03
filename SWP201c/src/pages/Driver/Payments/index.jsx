// src/pages/Driver/Payments/index.jsx
import React, { useState, useEffect } from 'react';
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
    // Dựa trên các giá trị status từ DB của bạn (ví dụ file SQL)
    switch (status?.toLowerCase()) {
        case 'success':
        case 'completed':
            return { text: 'Thành công', background: '#ecfdf5', color: '#16a34a' }; // Green
        case 'failed':
        case 'refund':
            return { text: 'Thất bại', background: '#fef2f2', color: '#dc2626' }; // Red
        case 'pending':
        case 'initiated':
            return { text: 'Đang chờ', background: '#fffbeb', color: '#f59e0b' }; // Yellow
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
    // const [currentInvoice, setCurrentInvoice] = useState(null); // (Sẽ dùng cho Bước 1 thanh toán)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        if (!currentUser?.userId) {
            setLoading(false);
            setError("Vui lòng đăng nhập để xem lịch sử thanh toán.");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Lấy lịch sử thanh toán
                // Tạm thời dùng mock data vì backend chưa có API này
                // TODO: Khi backend có API /api/payments/user/:userId/history thì uncomment dòng dưới
                // const historyResult = await paymentService.getPaymentHistory(currentUser.userId);
                
                // Mock data tạm thời
                const historyResult = {
                    success: true,
                    data: [] // Sẽ hiển thị "Chưa có lịch sử thanh toán"
                };
                
                if (historyResult.success) {
                    setPaymentHistory(historyResult.data || []);
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

            {/* --- PHẦN HÓA ĐƠN HIỆN TẠI (Bạn sẽ làm ở đây) --- */}
            <div style={{ marginBottom: '24px' }}>
                <div className="invoice-card" style={{ background: '#1f2937', padding: '24px', borderRadius: '16px', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', margin: '0 0 10px' }}>
                        💳 Thanh toán hóa đơn tháng
                    </h3>
                    <p style={{ color: '#d1d5db', margin: '0 0 20px' }}>
                        Nhập thông tin hợp đồng để xem và thanh toán hóa đơn tháng qua VNPay
                    </p>
                    {/* (Hiển thị số tiền hóa đơn thật ở đây) */}
                    <button 
                        className="invoice-button" 
                        onClick={handleGoToCheckout} 
                        style={{ 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            maxWidth: '250px',
                            transition: 'all 0.3s ease'
                        }} 
                    >
                        Thanh toán hóa đơn tháng
                    </button>
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