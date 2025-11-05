import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import paymentService from '/src/assets/js/services/paymentService.js';

const DetailRow = ({ label, value }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '8px',
    padding: '6px 0',
    borderBottom: '1px dashed #e2e8f0'
  }}>
    <div style={{ color: '#64748b' }}>{label}</div>
    <div style={{ textAlign: 'right', color: '#0f172a', fontWeight: '500' }}>
      {value || '-'}
    </div>
  </div>
);

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [queryDateStr, setQueryDateStr] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setIsLoading(true);
        const result = await paymentService.verifyVNPayReturn(searchParams);
        
        if (result.success && result.payment) {
          const paymentData = result.payment;
          const parsedPayment = {
            status: paymentData.status || 'failed',
            transactionRef: paymentData.txnRef || searchParams.get('vnp_TxnRef') || 'N/A',
            amount: paymentData.amount || (searchParams.get('vnp_Amount') ? Number(searchParams.get('vnp_Amount')) / 100 : 0),
            currency: 'VND',
            vnpPayDate: paymentData.vnpPayDate || new Date(),
            vnpResponseCode: paymentData.responseCode || searchParams.get('vnp_ResponseCode') || 'N/A',
            vnpTransactionStatus: paymentData.vnpTransactionStatus || searchParams.get('vnp_TransactionStatus'),
            vnpBankCode: searchParams.get('vnp_BankCode') || 'N/A',
            vnpBankTranNo: searchParams.get('vnp_BankTranNo') || 'N/A',
            vnpCardType: searchParams.get('vnp_CardType') || 'N/A',
            vnpTransactionNo: searchParams.get('vnp_TransactionNo') || 'N/A',
            vnpOrderInfo: searchParams.get('vnp_OrderInfo') || 'Thanh toán hóa đơn',
            vnpCreateDate: searchParams.get('vnp_TransactionDate') || ''
          };
          setPayment(parsedPayment);
          
          const createDate = searchParams.get('vnp_TransactionDate') || searchParams.get('vnp_CreateDate') || parsedPayment.vnpCreateDate;
          if (createDate && createDate.match(/\d{14}/)) {
            setQueryDateStr(createDate);
          } else {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            setQueryDateStr(`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`);
          }
        } else {
          setPayment({
            status: 'failed',
            transactionRef: searchParams.get('vnp_TxnRef') || 'N/A',
            amount: searchParams.get('vnp_Amount') ? Number(searchParams.get('vnp_Amount')) / 100 : 0,
            currency: 'VND',
            vnpResponseCode: searchParams.get('vnp_ResponseCode') || 'N/A',
            vnpBankCode: searchParams.get('vnp_BankCode') || 'N/A'
          });
        }
      } catch (error) {
        console.error('Verify payment error:', error);
        setPayment({ status: 'failed', transactionRef: 'N/A', amount: 0, currency: 'VND' });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleQueryDR = async () => {
    if (!payment?.transactionRef || !queryDateStr) {
      alert('Không có đủ thông tin để đối soát giao dịch');
      return;
    }

    try {
      const result = await paymentService.queryVNPayTransaction(payment.transactionRef, queryDateStr);
      if (result.success) {
        alert(`Đối soát thành công!\n\nMã phản hồi: ${result.data.vnp_ResponseCode}\nTrạng thái: ${result.data.vnp_TransactionStatus}\nĐã thanh toán: ${result.data.paid ? 'Có' : 'Không'}`);
      } else {
        alert(`Đối soát thất bại: ${result.message}`);
      }
    } catch (error) {
      alert(`Lỗi khi đối soát: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #1f2937 0%, #111827 100%)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:'16px'}}>⏳</div>
          <div style={{color:'white',fontSize:'1.2rem'}}>Đang xác thực giao dịch...</div>
        </div>
      </div>
    );
  }

  const isSuccess = payment?.status?.toLowerCase() === 'success';

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #1f2937 0%, #111827 100%)',padding:'24px',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:'680px',width:'100%',background:'#ffffff',borderRadius:'16px',boxShadow:'0 10px 30px rgba(2,6,23,.06)',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'20px 24px',borderBottom:'1px solid #e2e8f0',background:'linear-gradient(180deg, #eaf3ff, #ffffff 60%)',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',flex:1}}>
            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'#0b74e5',display:'grid',placeItems:'center',color:'#fff',fontWeight:'700'}}>VN</div>
            <div>
              <div style={{fontWeight:800,lineHeight:1}}>Thanh toán VNPay</div>
              <div style={{color:'#475569',fontSize:'0.85rem'}}>Mã GD: {payment?.transactionRef || 'N/A'}</div>
            </div>
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 10px',borderRadius:'999px',fontSize:'14px',fontWeight:'600',background:isSuccess?'#ecfdf5':'#fef2f2',color:isSuccess?'#16a34a':'#dc2626',border:isSuccess?'1px solid #86efac':'1px solid #fecaca'}}>
            {isSuccess ? (
              <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ) : (
              <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/></svg>
            )}
            <span>{isSuccess ? 'Thành công' : 'Thất bại'}</span>
          </div>
        </div>
        <div style={{padding:'24px'}}>
          <div style={{display:'grid',gridTemplateColumns:window.innerWidth>720?'1.2fr .8fr':'1fr',gap:'20px'}}>
            <div style={{border:'1px solid #e2e8f0',borderRadius:'12px',padding:'16px',background:'#fff'}}>
              <h2 style={{fontSize:'18px',fontWeight:'700',margin:'0 0 12px'}}>Tổng quan</h2>
              <div style={{fontSize:'28px',fontWeight:'800',color:'#0b74e5',margin:'4px 0 2px'}}>
                {new Intl.NumberFormat('vi-VN').format(payment?.amount||0)} VND
              </div>
              <div style={{color:'#475569',fontSize:'14px'}}>
                <span style={{fontSize:'12px',background:'#eef2ff',color:'#3730a3',border:'1px solid #c7d2fe',borderRadius:'999px',padding:'3px 8px'}}>{payment?.currency||'VND'}</span>
                {payment?.vnpPayDate && (<span style={{marginLeft:'8px'}}>• Lúc {new Date(payment.vnpPayDate).toLocaleString('vi-VN')}</span>)}
              </div>
              {!isSuccess && (
                <p style={{marginTop:'12px',fontSize:'14px',color:'#dc2626',background:'#fef2f2',padding:'8px',borderRadius:'6px'}}>
                  Giao dịch thất bại hoặc chưa được xác nhận. Vui lòng thử lại.
                </p>
              )}
              {isSuccess && (
                <p style={{marginTop:'12px',fontSize:'14px',color:'#16a34a',background:'#f0fdf4',padding:'8px',borderRadius:'6px'}}>
                  ✓ Thanh toán thành công! Cảm ơn bạn.
                </p>
              )}
            </div>
            <div style={{border:'1px solid #e2e8f0',borderRadius:'12px',padding:'16px',background:'#fff'}}>
              <h2 style={{fontSize:'18px',fontWeight:'700',margin:'0 0 12px'}}>Chi tiết</h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'8px',fontSize:'15px'}}>
                <DetailRow label="Mã phản hồi" value={payment?.vnpResponseCode} />
                <DetailRow label="Mã ngân hàng" value={payment?.vnpBankCode} />
                <DetailRow label="Số GD NH" value={payment?.vnpBankTranNo} />
                <DetailRow label="Loại thẻ" value={payment?.vnpCardType} />
                <DetailRow label="Mã GD VNPay" value={payment?.vnpTransactionNo} />
              </div>
            </div>
          </div>
          <div style={{marginTop:'16px',fontSize:'14px',color:'#64748b'}}>
            * Thông tin dựa trên dữ liệu từ VNPay.
          </div>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'12px',justifyContent:'flex-end',padding:'16px 24px',borderTop:'1px solid #e2e8f0',background:'#fafbff'}}>
          <button 
            onClick={() => navigate('/driver/dashboard')} 
            style={{
              appearance:'none',
              border:'1px solid #e2e8f0',
              background:'#fff',
              color:'#0f172a',
              padding:'10px 20px',
              borderRadius:'10px',
              fontWeight:'600',
              cursor:'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.target.style.background = '#fff'}
          >
            🏠 Quay về trang chủ
          </button>
          <button 
            onClick={() => navigate('/driver/payments')} 
            style={{
              appearance:'none',
              background:'#0b74e5',
              color:'#fff',
              border:'1px solid #0a66cc',
              padding:'10px 20px',
              borderRadius:'10px',
              fontWeight:'600',
              cursor:'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#0a66cc'}
            onMouseLeave={(e) => e.target.style.background = '#0b74e5'}
          >
            📋 Lịch sử thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
