# VNPay Payment Integration - Driver Payment Feature

## 📋 Tổng quan

Hệ thống thanh toán VNPay đã được tích hợp hoàn chỉnh cho Driver, cho phép thanh toán hóa đơn tháng tự động qua cổng thanh toán VNPay.

## 🚀 Tính năng chính

### 1. **Thanh toán hóa đơn tháng tự động**
- Tự động tính toán hóa đơn dựa trên:
  - Quãng đường đã đi trong tháng
  - Gói hợp đồng (base distance, base price)
  - Phí vượt quá (overage rate theo tier)
- Tạo link thanh toán VNPay tự động
- Chuyển hướng sang trang thanh toán VNPay

### 2. **Xác thực thanh toán**
- Xác thực chữ ký (vnp_SecureHash) từ VNPay
- Lưu thông tin giao dịch vào database
- Hiển thị kết quả thanh toán chi tiết

### 3. **Đối soát giao dịch (QueryDR)**
- Cho phép đối soát giao dịch với VNPay
- Xác minh trạng thái giao dịch thực tế
- Hiển thị thông tin chi tiết từ VNPay

## 📁 Cấu trúc file

```
Frontend (React):
├── src/
│   ├── pages/Driver/Payments/
│   │   ├── index.jsx                          # Trang chính - danh sách payments
│   │   ├── MonthlyBilling.jsx                 # Trang thanh toán hóa đơn tháng
│   │   └── components/
│   │       └── PaymentResult.jsx              # Trang kết quả thanh toán
│   ├── assets/js/
│   │   ├── config/api.js                      # Cấu hình API endpoints
│   │   └── services/paymentService.js         # Service xử lý payment API calls
│   └── routes/DriverRoutes.jsx                # Route configuration

Backend (Spring Boot): (KHÔNG ĐƯỢC CHỈNH SỬA)
├── src/main/java/hsf302/fa25/s3/
│   ├── controller/
│   │   ├── PaymentController.java             # REST API endpoints
│   │   └── PaymentPageController.java         # HTML page controller
│   ├── service/PaymentService.java            # Business logic
│   ├── dao/PaymentDao.java                    # Database operations
│   ├── config/VNPayConfig.java                # VNPay configuration
│   └── model/Payment.java                     # Payment entity
└── src/main/resources/
    └── templates/payment_result.html          # Thymeleaf template (Optional)
```

## 🔧 API Endpoints

### 1. **POST `/payment/create`**
Tạo URL thanh toán VNPay cho một giao dịch đơn giản

**Parameters:**
- `userId` (required): ID người dùng
- `contractId` (optional): ID hợp đồng
- `amount` (required): Số tiền thanh toán (VND)

**Response:**
```json
{
  "success": true,
  "payUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
}
```

### 2. **GET `/payment/pay-monthly`**
Tính toán và tạo URL thanh toán cho hóa đơn tháng (tự động)

**Parameters:**
- `userId` (required): ID người dùng
- `contractId` (required): ID hợp đồng
- `year` (required): Năm (YYYY)
- `month` (required): Tháng (1-12)

**Response:**
```json
{
  "success": true,
  "payUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "contractId": 1,
  "month": "2025-01",
  "totalKm": 350.5,
  "baseDistance": 300,
  "basePrice": 500000,
  "ratePerKmApplied": 2000,
  "overageKm": 50.5,
  "overageCharge": 101000,
  "totalAmount": 601000
}
```

### 3. **GET `/payment/vnpay-return-json`**
Xử lý kết quả trả về từ VNPay (JSON response)

**Parameters:** (VNPay query parameters)
- `vnp_TxnRef`: Mã giao dịch
- `vnp_ResponseCode`: Mã phản hồi
- `vnp_TransactionStatus`: Trạng thái giao dịch
- `vnp_SecureHash`: Chữ ký xác thực
- ... (các tham số khác từ VNPay)

**Response:**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "txnRef": "PAY1730345678123456",
  "status": "success",
  "responseCode": "00"
}
```

### 4. **GET `/payment/querydr`**
Đối soát giao dịch với VNPay

**Parameters:**
- `txnRef` (required): Mã giao dịch
- `transactionDate` (required): Ngày giao dịch (yyyyMMddHHmmss)

**Response:**
```json
{
  "httpStatus": 200,
  "vnp_ResponseCode": "00",
  "vnp_TransactionStatus": "00",
  "paid": true
}
```

## 💻 Hướng dẫn sử dụng (Frontend)

### 1. **Thanh toán hóa đơn tháng**

```javascript
import paymentService from '/src/assets/js/services/paymentService.js';

// Gọi API thanh toán hóa đơn tháng
const result = await paymentService.payMonthlyBillVNPay(
  userId,      // ID người dùng (string)
  contractId,  // ID hợp đồng (number)
  year,        // Năm (number, e.g., 2025)
  month        // Tháng (number, 1-12)
);

if (result.success && result.payUrl) {
  // Hiển thị thông tin hóa đơn (optional)
  console.log('Bill Info:', result.billInfo);
  
  // Chuyển hướng đến VNPay
  window.location.href = result.payUrl;
}
```

### 2. **Xử lý kết quả thanh toán**

Component `PaymentResult.jsx` tự động:
- Lấy query parameters từ URL (VNPay return)
- Gọi API `/payment/vnpay-return-json` để xác thực
- Hiển thị kết quả thanh toán
- Cho phép đối soát (QueryDR)

```javascript
// Trong PaymentResult.jsx
const verifyPayment = async () => {
  const result = await paymentService.verifyVNPayReturn(searchParams);
  if (result.success) {
    setPayment(result.payment);
  }
};
```

### 3. **Đối soát giao dịch**

```javascript
const result = await paymentService.queryVNPayTransaction(
  transactionRef,   // Mã giao dịch
  transactionDate   // Ngày GD (yyyyMMddHHmmss)
);

if (result.success) {
  console.log('Transaction verified:', result.data.paid);
}
```

## 🔑 Service Methods

### `paymentService.js`

```javascript
// 1. Tạo payment URL đơn giản
createVNPayPayment(userId, contractId, amount)

// 2. Thanh toán hóa đơn tháng (auto calculate)
payMonthlyBillVNPay(userId, contractId, year, month)

// 3. Xác thực kết quả VNPay
verifyVNPayReturn(queryParams)

// 4. Đối soát giao dịch
queryVNPayTransaction(txnRef, transactionDate)

// 5. Lấy lịch sử thanh toán
getPaymentHistory(userId)
```

## 🎯 Luồng hoạt động

### 1. **Thanh toán hóa đơn tháng**

```
Driver → MonthlyBilling Page
  ↓
Nhập thông tin (contractId, year, month)
  ↓
Click "Thanh toán qua VNPay"
  ↓
API: GET /payment/pay-monthly
  ↓
Backend tính toán hóa đơn (SQL Proc: usp_CalcMonthlyBill_ByTier)
  ↓
Backend tạo Payment pending trong DB
  ↓
Backend tạo VNPay URL (với vnp_SecureHash)
  ↓
Redirect đến VNPay
  ↓
Driver thanh toán trên VNPay
  ↓
VNPay redirect về: /driver/payments/result?vnp_TxnRef=...&vnp_ResponseCode=...
  ↓
PaymentResult Page
  ↓
API: GET /payment/vnpay-return-json
  ↓
Backend xác thực vnp_SecureHash
  ↓
Backend cập nhật Payment status trong DB
  ↓
Nếu thành công → Cập nhật Contract status = 'expired'
  ↓
Hiển thị kết quả
```

### 2. **Đối soát (QueryDR)**

```
PaymentResult Page → Click "Đối soát"
  ↓
API: GET /payment/querydr?txnRef=...&transactionDate=...
  ↓
Backend tạo JSON request với vnp_SecureHash
  ↓
POST đến VNPay API: https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
  ↓
VNPay trả về JSON response
  ↓
Parse và hiển thị kết quả
```

## 🔒 Bảo mật

### Backend (VNPayConfig.java)
- **HMAC SHA512**: Mã hóa chữ ký với `vnp_HashSecret`
- **URL Encoding**: Encode tất cả parameters trước khi ký
- **Validate Signature**: Kiểm tra `vnp_SecureHash` khi nhận return/IPN

### Frontend
- **HTTPS Only**: Chỉ hoạt động trên HTTPS
- **No Secret Exposure**: Không lưu `vnp_HashSecret` ở client
- **Verify Return**: Luôn gọi API backend để xác thực kết quả

## 📊 Database Schema

### Bảng `Payments`

```sql
CREATE TABLE Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id NVARCHAR(450) NOT NULL,
    contract_id INT NULL,
    amount DECIMAL(18,2) NOT NULL,
    method NVARCHAR(50) NOT NULL CHECK (method IN ('card', 'cash', 'bank_transfer', 'QR')),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'refund', 'in_progress')),
    currency NVARCHAR(10) DEFAULT 'VND',
    transaction_ref NVARCHAR(100) UNIQUE,
    
    -- VNPay specific fields
    vnp_amount BIGINT NULL,
    vnp_response_code NVARCHAR(10),
    vnp_transaction_no NVARCHAR(100),
    vnp_bank_code NVARCHAR(50),
    vnp_bank_tran_no NVARCHAR(100),
    vnp_card_type NVARCHAR(50),
    vnp_pay_date DATETIME,
    vnp_order_info NVARCHAR(MAX),
    vnp_transaction_status NVARCHAR(10),
    
    -- Audit fields
    ipn_verified BIT DEFAULT 0,
    return_raw NVARCHAR(MAX),
    ipn_raw NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES AspNetUsers(Id),
    FOREIGN KEY (contract_id) REFERENCES Contracts(contract_id)
);
```

## ⚙️ Configuration

### Backend `application.properties`

```properties
# VNPay Configuration
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.hash-secret=YOUR_HASH_SECRET
vnpay.pay-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:5173/driver/payments/result
vnpay.api-url=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### Frontend `api.js`

```javascript
PAYMENTS: {
  CREATE: '/payment/create',
  PAY_MONTHLY: '/payment/pay-monthly',
  VNPAY_RETURN: '/payment/vnpay-return',
  VNPAY_RETURN_JSON: '/payment/vnpay-return-json',
  QUERYDR: '/payment/querydr',
  // ...
}
```

## 🧪 Testing

### 1. **Test thanh toán hóa đơn tháng**

```
URL: http://localhost:5173/driver/payments/monthly-billing

Steps:
1. Nhập Contract ID (e.g., 1)
2. Chọn Year (e.g., 2025)
3. Chọn Month (e.g., 1)
4. Click "Thanh toán qua VNPay"
5. Kiểm tra bill info hiển thị
6. Verify redirect đến VNPay sandbox
```

### 2. **Test VNPay Sandbox**

Sử dụng thẻ test của VNPay:
- **Thẻ thành công**: 9704 0000 0000 0018
- **Thẻ thất bại**: 9704 0000 0000 0026
- **Tên**: NGUYEN VAN A
- **Ngày**: 07/15
- **OTP**: 123456

### 3. **Test kết quả thanh toán**

```
Sau khi thanh toán trên VNPay:
1. Verify redirect về /driver/payments/result
2. Kiểm tra hiển thị thông tin giao dịch
3. Test nút "Đối soát (QueryDR)"
4. Verify database đã cập nhật Payment status
5. Verify Contract status = 'expired' (nếu thành công)
```

## 📝 Notes

1. **Return URL vs IPN**: Hiện tại chỉ dùng Return URL (QueryDR), không dùng IPN
2. **Contract Status**: Sau khi thanh toán thành công, contract sẽ được set `status = 'expired'`
3. **Amount Format**: VNPay yêu cầu amount * 100 (không có dấu phẩy/chấm)
4. **Date Format**: Sử dụng `yyyyMMddHHmmss` cho tất cả date fields
5. **Encoding**: PHẢI encode cả key và value khi build query string và hash data

## 🐛 Troubleshooting

### Lỗi "Invalid Signature"
- Kiểm tra `vnp_HashSecret` trong `application.properties`
- Verify URL encoding đúng (dùng UTF-8)
- Kiểm tra sort order của parameters (phải sort theo key tăng dần)

### Lỗi "Transaction not found"
- Kiểm tra `transaction_ref` có được lưu trong DB không
- Verify format của `transactionDate` (yyyyMMddHHmmss)

### Contract không được cập nhật
- Kiểm tra `vnp_ResponseCode` = "00" và `vnp_TransactionStatus` = "00"
- Verify logic trong `PaymentService.handleReturn()`

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. Backend logs (console output)
2. Browser console (Network tab)
3. VNPay sandbox logs
4. Database records (Payments table)

---

**Lưu ý**: Đây là hệ thống sử dụng VNPay SANDBOX, không phải production. Không sử dụng thẻ thật!
