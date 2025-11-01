USE master;
GO
IF DB_ID('ev_battery_swap') IS NOT NULL
BEGIN
    ALTER DATABASE ev_battery_swap SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ev_battery_swap;
END
GO

CREATE DATABASE ev_battery_swap;
GO
USE ev_battery_swap;
GO

-- 1. Users
CREATE TABLE Users (
                       user_id VARCHAR(50) PRIMARY KEY,
                       last_name NVARCHAR(50) NOT NULL,
                       first_name NVARCHAR(50) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       phone VARCHAR(20) UNIQUE NOT NULL,
                       password NVARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('EV Driver','Staff','Admin')),
                       cccd VARCHAR(20) UNIQUE NULL,
                       status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
                       created_at DATETIME DEFAULT GETDATE(),
                       updated_at DATETIME DEFAULT GETDATE(),
                       otp_code NVARCHAR(10),
                       otp_expire DATETIME,
                       is_email_verified BIT DEFAULT 0,
                       reset_token NVARCHAR(100),
                       reset_expire DATETIME
);

-- 2. Vehicles (mỗi user có nhiều xe)
CREATE TABLE Vehicles (
    vehicle_id INT PRIMARY KEY IDENTITY(1,1),
    user_id VARCHAR(50) NOT NULL,
    plate_number VARCHAR(15) UNIQUE NOT NULL,
    model NVARCHAR(50) NOT NULL,
    vin_number VARCHAR(50) UNIQUE NOT NULL,
    battery_type NVARCHAR(50) NOT NULL, -- loại pin chính
    compatible_battery_types NVARCHAR(MAX) NULL, -- danh sách loại pin tương thích
    current_battery_id INT NULL, -- Pin hiện tại đang gắn vào xe
    current_odometer DECIMAL(12,2) DEFAULT 0, -- Số km hiện tại của xe
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 3. Service Plans (Gói thuê pin)
CREATE TABLE ServicePlans (
    plan_id INT PRIMARY KEY IDENTITY(1,1),
    plan_name NVARCHAR(50) NOT NULL UNIQUE, -- 'Eco', 'Cơ bản', 'Plus', 'Premium'
    base_price DECIMAL(12,2) NOT NULL, -- Giá cơ sở (VNĐ/tháng)
    base_distance INT NOT NULL, -- Quãng đường cơ sở (km), -1 cho unlimited
    deposit_fee DECIMAL(12,2) NOT NULL DEFAULT 400000, -- Phí đặt cọc pin
    description NVARCHAR(255) NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

-- 4. Distance Rate Tiers (Bậc thang phí vượt km)
CREATE TABLE DistanceRateTiers (
    tier_id INT PRIMARY KEY IDENTITY(1,1),
    from_km INT NOT NULL, -- Từ km
    to_km INT NULL, -- Đến km (NULL = unlimited)
    rate_per_km DECIMAL(10,2) NOT NULL, -- VNĐ/km
    description NVARCHAR(100) NULL
);

-- 5. Contracts (hợp đồng cho từng xe với thông tin usage tháng hiện tại)
CREATE TABLE Contracts (
    contract_id INT PRIMARY KEY IDENTITY(1,1),
    vehicle_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','canceled')),
    contract_number NVARCHAR(50) UNIQUE NOT NULL,
    signed_date DATE DEFAULT GETDATE(),
    signed_place NVARCHAR(100) NULL,
    -- Thông tin usage tháng hiện tại
    current_month VARCHAR(7) DEFAULT FORMAT(GETDATE(), 'yyyy-MM'), -- Tháng hiện tại 'YYYY-MM'
    monthly_distance DECIMAL(12,2) DEFAULT 0, -- Tổng quãng đường tháng hiện tại (km)
    monthly_base_fee DECIMAL(12,2) DEFAULT 0, -- Phí cơ sở tháng hiện tại
    monthly_overage_distance DECIMAL(12,2) DEFAULT 0, -- Quãng đường vượt mức tháng hiện tại
    monthly_overage_fee DECIMAL(12,2) DEFAULT 0, -- Phí vượt tháng hiện tại
    monthly_total_fee DECIMAL(12,2) DEFAULT 0, -- Tổng phí tháng hiện tại
    last_reset_date DATETIME DEFAULT GETDATE(), -- Lần cuối reset usage (đầu mỗi tháng)
    created_at DATETIME DEFAULT GETDATE(),
    ALTER TABLE Contracts ADD updated_at DATETIME NULL,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    FOREIGN KEY (plan_id) REFERENCES ServicePlans(plan_id)
);

-- 6. Stations
CREATE TABLE Stations (
    station_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    location NVARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','maintenance'))
);

-- 7. Towers (mỗi trạm có nhiều trụ)
CREATE TABLE Towers (
    tower_id INT PRIMARY KEY IDENTITY(1,1),
    station_id INT NOT NULL,
    tower_number INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','maintenance')),
    FOREIGN KEY (station_id) REFERENCES Stations(station_id)
);

-- 8. Slots (mỗi trụ có nhiều slot chứa pin)
CREATE TABLE Slots (
    slot_id INT PRIMARY KEY IDENTITY(1,1),
    tower_id INT NOT NULL,
    slot_number INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('full','charging','empty')),
    FOREIGN KEY (tower_id) REFERENCES Towers(tower_id)
);

-- 9. Batteries
CREATE TABLE Batteries (
    battery_id INT PRIMARY KEY IDENTITY(1,1),
    model NVARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    state_of_health DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available','charging','in_use','faulty')),
    slot_id INT NULL,
    last_maintenance_date DATETIME NULL,
    cycle_count INT DEFAULT 0,
    total_distance DECIMAL(12,2) DEFAULT 0, -- Tổng quãng đường pin đã đi (km)
    FOREIGN KEY (slot_id) REFERENCES Slots(slot_id)
);

-- 10. Payments
CREATE TABLE Payments (
                          payment_id INT IDENTITY(1,1) PRIMARY KEY,
                          user_id VARCHAR(50) NOT NULL,
                          contract_id INT NULL,
                          amount DECIMAL(10,2) NOT NULL,
                          method VARCHAR(20) NOT NULL CHECK (method IN ('QR', 'Stripe', 'Paypal', 'Subscription')),
                          status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'refund', 'in_progress')),
                          currency VARCHAR(10) NOT NULL DEFAULT 'VND',
                          transaction_ref NVARCHAR(100) NOT NULL,
                          created_at DATETIME DEFAULT GETDATE(),

    -- VNPay fields
                          vnp_amount BIGINT NULL,
                          vnp_response_code VARCHAR(4) NULL,
                          vnp_transaction_no NVARCHAR(50) NULL,
                          vnp_bank_code NVARCHAR(50) NULL,
                          vnp_bank_tran_no NVARCHAR(100) NULL,
                          vnp_card_type NVARCHAR(50) NULL,
                          vnp_pay_date DATETIME NULL,
                          vnp_order_info NVARCHAR(255) NULL,
                          vnp_transaction_status VARCHAR(4) NULL,

    -- Extra logging
                          ipn_verified BIT DEFAULT 0,
                          return_raw NVARCHAR(MAX) NULL,
                          ipn_raw NVARCHAR(MAX) NULL,

    -- Foreign keys
                          CONSTRAINT FK_Payments_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
                          CONSTRAINT FK_Payments_Contracts FOREIGN KEY (contract_id) REFERENCES Contracts(contract_id)
);

-- 11. Swaps
CREATE TABLE Swaps (
    swap_id INT PRIMARY KEY IDENTITY(1,1),
    user_id VARCHAR(50) NOT NULL, -- FK đến Users.user_id (driver)
    contract_id INT NOT NULL,
    vehicle_id INT NULL,
    station_id INT NOT NULL,
    tower_id INT NOT NULL,
    staff_id VARCHAR(50) NULL, -- FK đến Users.user_id (staff); allow NULL for automatic/system swaps
    old_battery_id INT NULL,
    new_battery_id INT NULL,
    odometer_before DECIMAL(12,2) NULL,
    odometer_after DECIMAL(12,2) NULL,
    distance_used AS (ISNULL(odometer_after, 0) - ISNULL(odometer_before, 0)),
    swap_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'INITIATED'
        CHECK (status IN ('INITIATED','IN_PROGRESS','COMPLETED','FAILED','CANCELLED')),
    payment_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (contract_id) REFERENCES Contracts(contract_id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    FOREIGN KEY (station_id) REFERENCES Stations(station_id),
    FOREIGN KEY (tower_id) REFERENCES Towers(tower_id),
    FOREIGN KEY (staff_id) REFERENCES Users(user_id),
    FOREIGN KEY (old_battery_id) REFERENCES Batteries(battery_id),
    FOREIGN KEY (new_battery_id) REFERENCES Batteries(battery_id),
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id),
    CHECK (odometer_after >= odometer_before)
);

-- 12. Reports
CREATE TABLE Reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
    station_id INT NOT NULL,
    date DATE NOT NULL,
    total_swaps INT DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    issues NVARCHAR(MAX) NULL,
    FOREIGN KEY (station_id) REFERENCES Stations(station_id)
);

-- 13. Issues / Feedback
CREATE TABLE Issues (
    issue_id INT PRIMARY KEY IDENTITY(1,1),
    user_id VARCHAR(50) NOT NULL,
    station_id INT NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (station_id) REFERENCES Stations(station_id)
);

INSERT INTO Users (user_id, last_name, first_name,email, phone, password, role, cccd, status) VALUES
('admin001', 'Nguyen', 'Duc Anh', 'admin@evswap.com', '0901234567', 'admin123', 'Admin', '123456789001', 'active'),
('driver001', 'Tran', 'Van Minh', 'minh.driver@gmail.com', '0902345678', 'driver123', 'EV Driver', '123456789002', 'active'),
('driver002', 'Le', 'Thi Hoa', 'hoa.driver@gmail.com', '0903456789', 'driver123', 'EV Driver', '123456789003', 'active'),
('staff001', 'Pham', 'Van Duc', 'duc.staff@evswap.com', '0904567890', 'staff123', 'Staff', '123456789004', 'active'),
('staff002', 'Hoang', 'Thi Mai', 'mai.staff@evswap.com', '0905678901', 'staff123', 'Staff', '123456789005', 'active');

-- Insert Service Plans
INSERT INTO ServicePlans (plan_name, base_price, base_distance, deposit_fee, description) VALUES
('Eco', 135000, 200, 400000, 'Nếu ≤ 200 km thì chỉ trả 135.000 VNĐ'),
('Cơ bản', 270000, 400, 400000, 'Nếu ≤ 400 km thì chỉ trả 270.000 VNĐ'),
('Plus', 405000, 600, 400000, 'Nếu ≤ 600 km thì chỉ trả 405.000 VNĐ'),
('Premium', 3000000, -1, 400000, 'Không giới hạn - Không áp dụng phí vượt km');

-- Insert Distance Rate Tiers (Bậc thang phí vượt km)
INSERT INTO DistanceRateTiers (from_km, to_km, rate_per_km, description) VALUES
(0, 2000, 357, 'Từ giới hạn cơ sở đến 2.000 km'),
(2001, 4000, 346, 'Từ 2.001 km – 4.000 km'),
(4001, 6000, 335, 'Từ 4.001 km – 6.000 km'),
(6001, NULL, 313, 'Trên 6.000 km');

-- Insert Stations
INSERT INTO Stations (name, location, status) VALUES
('Trạm Cầu Giấy', 'Số 1 Cầu Giấy, Hà Nội', 'active'),
('Trạm Thanh Xuân', 'Số 5 Lê Văn Lương, Thanh Xuân, Hà Nội', 'active'),
('Trạm Long Biên', 'Số 10 Ngọc Thụy, Long Biên, Hà Nội', 'active'),
('Trạm Đống Đa', 'Số 15 Kim Liên, Đống Đa, Hà Nội', 'maintenance');

-- Insert Towers
INSERT INTO Towers (station_id, tower_number, status) VALUES
(1, 1, 'active'), (1, 2, 'active'),
(2, 1, 'active'), (2, 2, 'active'), (2, 3, 'active'),
(3, 1, 'active'), (3, 2, 'active'),
(4, 1, 'maintenance');

-- Insert Slots
INSERT INTO Slots (tower_id, slot_number, status) VALUES
-- Station 1 - Tower 1
(1, 1, 'full'), (1, 2, 'charging'), (1, 3, 'empty'), (1, 4, 'full'),
-- Station 1 - Tower 2
(2, 1, 'full'), (2, 2, 'full'), (2, 3, 'charging'), (2, 4, 'empty'),
-- Station 2 - Tower 1
(3, 1, 'full'), (3, 2, 'empty'), (3, 3, 'full'), (3, 4, 'charging'),
-- Station 2 - Tower 2
(4, 1, 'full'), (4, 2, 'full'), (4, 3, 'full'), (4, 4, 'empty'),
-- Station 2 - Tower 3
(5, 1, 'charging'), (5, 2, 'full'), (5, 3, 'empty'), (5, 4, 'full'),
-- Station 3 - Tower 1
(6, 1, 'full'), (6, 2, 'full'), (6, 3, 'charging'), (6, 4, 'empty'),
-- Station 3 - Tower 2
(7, 1, 'empty'), (7, 2, 'full'), (7, 3, 'full'), (7, 4, 'charging');

-- Insert Batteries
INSERT INTO Batteries (model, capacity, state_of_health, status, slot_id, cycle_count, total_distance) VALUES
-- Batteries in slots marked as 'full'
('LiFePO4-60kWh', 60, 98.5, 'available', 1, 45, 2250.0),
('LiFePO4-60kWh', 60, 96.2, 'available', 4, 78, 3900.0),
('LiFePO4-60kWh', 60, 99.1, 'available', 5, 32, 1600.0),
('LiFePO4-60kWh', 60, 94.8, 'available', 6, 156, 7800.0),
('LiFePO4-60kWh', 60, 97.3, 'available', 9, 67, 3350.0),
('LiFePO4-60kWh', 60, 95.6, 'available', 11, 89, 4450.0),
('LiFePO4-60kWh', 60, 98.9, 'available', 13, 23, 1150.0),
('LiFePO4-60kWh', 60, 96.7, 'available', 14, 112, 5600.0),
('LiFePO4-60kWh', 60, 97.8, 'available', 15, 56, 2800.0),
('LiFePO4-60kWh', 60, 94.2, 'available', 18, 134, 6700.0),
('LiFePO4-60kWh', 60, 99.3, 'available', 19, 18, 900.0),
('LiFePO4-60kWh', 60, 96.1, 'available', 22, 91, 4550.0),
('LiFePO4-60kWh', 60, 98.0, 'available', 23, 67, 3350.0),
-- Batteries charging
('LiFePO4-60kWh', 60, 92.1, 'charging', 2, 189, 9450.0),
('LiFePO4-60kWh', 60, 95.4, 'charging', 7, 78, 3900.0),
('LiFePO4-60kWh', 60, 97.2, 'charging', 12, 45, 2250.0),
('LiFePO4-60kWh', 60, 93.8, 'charging', 17, 167, 8350.0),
('LiFePO4-60kWh', 60, 96.9, 'charging', 21, 89, 4450.0),
('LiFePO4-60kWh', 60, 94.5, 'charging', 24, 123, 6150.0),
-- Batteries in use (currently in vehicles)
('LiFePO4-60kWh', 60, 88.7, 'in_use', NULL, 234, 15490.7),
('LiFePO4-60kWh', 60, 91.2, 'in_use', NULL, 198, 8785.6),
('LiFePO4-60kWh', 60, 89.8, 'in_use', NULL, 212, 12375.4);

-- Insert Vehicles (chưa gắn pin, sẽ update sau khi có battery data)
INSERT INTO Vehicles (user_id, plate_number, model, vin_number, battery_type, compatible_battery_types, current_odometer) VALUES
('driver001', '30A-12345', 'VinFast VF-e34', 'VF1234567890ABCDE', 'LiFePO4-60kWh', 'LiFePO4-60kWh,LiFePO4-50kWh', 15490.7),
('driver001', '30B-67890', 'VinFast VF-8', 'VF2345678901BCDEF', 'LiFePO4-60kWh', 'LiFePO4-60kWh,LiFePO4-70kWh', 8785.6),
('driver002', '29A-11111', 'Tesla Model 3', 'TS1234567890GHIJK', 'LiFePO4-60kWh', 'LiFePO4-60kWh,LiFePO4-75kWh', 12375.4);

-- Insert Contracts với usage data tháng 10/2024
INSERT INTO Contracts (vehicle_id, plan_id, start_date, end_date, status, contract_number, signed_place,
                      current_month, monthly_distance, monthly_base_fee, monthly_overage_distance, monthly_overage_fee, monthly_total_fee) VALUES
(1, 2, '2024-01-01', '2024-12-31', 'active', 'CT-2024-001', 'Hà Nội',
 '2024-10', 150.0, 270000, 0, 0, 270000), -- Gói Cơ bản: 150km < 400km
(2, 3, '2024-02-15', '2025-02-14', 'active', 'CT-2024-002', 'Hà Nội',
 '2024-10', 780.0, 405000, 180.0, 64260, 469260), -- Gói Plus: 780km > 600km, vượt 180km * 357 = 64.260
(3, 1, '2024-03-01', '2025-02-28', 'active', 'CT-2024-003', 'Hà Nội',
 '2024-10', 320.0, 135000, 120.0, 42840, 177840); -- Gói Eco: 320km > 200km, vượt 120km * 357 = 42.840

-- Insert Payments
INSERT INTO Payments (user_id, contract_id, amount, method, status, currency, transaction_ref) VALUES
('driver001', 1, 500000, 'QR', 'success', 'VND', 'QR-20241001-001'),
('driver001', 2, 600000, 'Stripe', 'success', 'VND', 'ST-20241001-002'),
('driver002', 3, 550000, 'Subscription', 'success', 'VND', 'SUB-20241001-003'),
('driver001', 1, 50000, 'QR', 'success', 'VND', 'QR-20241005-004'),
('driver002', 3, 50000, 'QR', 'success', 'VND', 'QR-20241005-005');

-- Insert Swaps
INSERT INTO Swaps (user_id, contract_id, vehicle_id, station_id, tower_id, staff_id, old_battery_id, new_battery_id,
                  odometer_before, odometer_after, status, payment_id) VALUES
('driver001', 1, 1, 1, 1, 'staff001', 20, 1, 15420.5, 15450.8, 'COMPLETED', 4),
('driver001', 2, 2, 2, 3, 'staff002', 21, 9, 8750.2, 8785.6, 'COMPLETED', NULL),
('driver002', 3, 3, 1, 2, 'staff001', 22, 5, 12340.1, 12375.4, 'COMPLETED', 5),
('driver001', 1, 1, 2, 4, 'staff002', 1, 11, 15460.3, 15490.7, 'COMPLETED', NULL);

-- Insert Reports
INSERT INTO Reports (station_id, date, total_swaps, revenue, issues) VALUES
(1, '2024-10-05', 2, 100000, 'Không có vấn đề'),
(2, '2024-10-05', 2, 50000, 'Tower 2 có sự cố nhẹ đã khắc phục'),
(3, '2024-10-05', 0, 0, 'Không có hoạt động'),
(4, '2024-10-05', 0, 0, 'Đang bảo trì');

-- Insert Issues
INSERT INTO Issues (user_id, station_id, description, status) VALUES
('driver001', 2, 'Slot 4 của Tower 2 không nhận pin', 'resolved'),
('driver002', 1, 'Màn hình thông tin bị lỗi hiển thị', 'in_progress'),
('driver001', 3, 'Khu vực đỗ xe quá chật', 'open');

-- Update vehicles với pin hiện tại (batteries in_use)
UPDATE Vehicles SET current_battery_id = 20 WHERE vehicle_id = 1; -- driver001 xe 1
UPDATE Vehicles SET current_battery_id = 21 WHERE vehicle_id = 2; -- driver001 xe 2
UPDATE Vehicles SET current_battery_id = 22 WHERE vehicle_id = 3; -- driver002 xe 1

-- Add FK constraint cho Vehicles -> Batteries (sau khi đã có data)
ALTER TABLE Vehicles ADD CONSTRAINT FK_Vehicles_CurrentBattery
    FOREIGN KEY (current_battery_id) REFERENCES Batteries(battery_id);

USE ev_battery_swap;
GO
ALTER TABLE Vehicles
ALTER COLUMN battery_type NVARCHAR(50) NULL;
Thế là đủ cho DAO hiện tại (hàm insert đã set battery_type = NULL