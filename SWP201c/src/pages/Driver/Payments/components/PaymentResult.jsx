// src/pages/Driver/Payments/PaymentResult.jsx (Ví dụ)
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// 👇 ĐÃ SỬA ĐƯỜNG DẪN IMPORT CSS THEO YÊU CẦU CỦA BẠN
import '/src/assets/payments.css';

// Giả lập API gọi backend để xác thực thông tin VNPay trả về
// (Trong thực tế, bạn sẽ gửi TẤT CẢ searchParams về BE)
const verifyPayment = (params) => {
  return new Promise(resolve => {
    // BE sẽ kiểm tra chữ ký (vnp_SecureHash)
    // Ở đây ta chỉ mô phỏng
    const isSuccess = params.get('vnp_ResponseCode') === '00';
    
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          status: isSuccess ? 'success' : 'failed',
          transactionRef: params.get('vnp_TxnRef') || 'N/A',
          amount: (Number(params.get('vnp_Amount')) / 100) || 0, // VNPay gửi amount * 100
          currency: 'VND',
          vnpPayDate: new Date(), // Giả lập ngày
          vnpResponseCode: params.get('vnp_ResponseCode') || 'N/A',
          vnpTransactionStatus: params.get('vnp_TransactionStatus') || (isSuccess ? '00' : '02'),
          vnpBankCode: params.get('vnp_BankCode') || 'NCB',
          vnpBankTranNo: params.get('vnp_BankTranNo') || 'VNP123456',
          vnpCardType: params.get('vnp_CardType') || 'QRCODE',
          vnpTransactionNo: params.get('vnp_TransactionNo') || '987654',
          vnpOrderInfo: params.get('vnp_OrderInfo') || 'Thanh toan hoa don',
          vnpCreateDate: params.get('vnp_TransactionDate') || '20251031' // (Dùng cho QueryDR)
        }
      });
    }, 1000);
  });
};


const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Khi trang load, gửi tham số URL về BE để xác thực
    verifyPayment(searchParams).then(res => {
      if (res.success) {
        setPayment(res.data);
      }
      setIsLoading(false);
    });
  }, [searchParams]);

  if (isLoading) {
    return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Đang xác thực giao dịch...</div>;
  }

  const isSuccess = payment?.status?.toLowerCase() === 'success';

  return (
    <div className="payment-wrap">
      <div className="payment-card">
        {/* Header */}
        <div className="payment-head">
          <div className="payment-brand">
            <div className="logo">VN</div>
            <div>
              <div style={{ fontWeight: 800, lineHeight: 1 }}>Thanh toán VNPay</div>
              <div className="payment-muted">Mã giao dịch: {payment?.transactionRef}</div>
            </div>
          </div>

          {/* Nhãn trạng thái */}
          <div className={`payment-status ${isSuccess ? 'success' : 'failed'}`}>
            {isSuccess ? (
              <svg className="payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
            )}
            <span>{isSuccess ? 'Thành công' : 'Thất bại / Chưa xác nhận'}</span>
          </div>
        </div>

        {/* Body */}
        <div className="payment-body">
          <div className="payment-summary">
            {/* Tổng quan */}
            <div className="payment-panel">
              <h2 className="payment-title">Tổng quan</h2>
              <div className="payment-amount">
                {new Intl.NumberFormat('vi-VN').format(payment?.amount || 0)} VND
              </div>
              <div className="payment-muted">
                <span className="payment-badge">{payment?.currency || 'VND'}</span>
                {payment?.vnpPayDate && (
                  <span> • Lúc {new Date(payment.vnpPayDate).toLocaleString('vi-VN')}</span>
                )}
              </div>
              {!isSuccess && (
                <p className="payment-note">
                  Nếu số tiền đã trừ nhưng trạng thái chưa thành công, vui lòng chờ hệ thống đối soát (QueryDR/IPN) hoặc liên hệ CSKH.
                </p>
              )}
            </div>

            {/* Chi tiết từ VNPay */}
            <div className="payment-panel">
              <h2 className="payment-title">Chi tiết giao dịch</h2>
              <div className="payment-kv">
                <div>Response code</div>
                <div>{payment?.vnpResponseCode || '-'}</div>

                <div>Transaction status</div>
                <div>{payment?.vnpTransactionStatus || '-'}</div>

                <div>Mã ngân hàng</div>
                <div>{payment?.vnpBankCode || '-'}</div>

                <div>Số giao dịch ngân hàng</div>
                <div>{payment?.vnpBankTranNo || '-'}</div>

                <div>Loại thẻ</div>
                <div>{payment?.vnpCardType || '-'}</div>

                <div>Mã giao dịch VNPAY</div>
                <div>{payment?.vnpTransactionNo || '-'}</div>

                <div>Nội dung đơn hàng</div>
                <div>{payment?.vnpOrderInfo || '-'}</div>
              </div>
            </div>
          </div>
          <div className="payment-note" style={{ marginTop: '16px' }}>
            * Mọi thông tin hiển thị dựa trên dữ liệu trả về từ VNPay và bản ghi trên hệ thống.
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="payment-foot">
          <Link className="btn" to="/driver/dashboard">Quay về Dashboard</Link>
          <Link className="btn" to="/driver/payments">Lịch sử thanh toán</Link>
          {/* Nút QueryDR - bạn sẽ cần tự implement logic này */}
          <button className="btn primary">
            Đối soát (QueryDR)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;