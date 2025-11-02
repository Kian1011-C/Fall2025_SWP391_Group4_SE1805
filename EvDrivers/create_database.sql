-- ev_battery_swap_fixed.sql
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
GO

-- 2. ServicePlans
CREATE TABLE ServicePlans (
    plan_id INT PRIMARY KEY IDENTITY(1,1),
    plan_name NVARCHAR(50) NOT NULL UNIQUE,
    base_price DECIMAL(12,2) NOT NULL,
    base_distance INT NOT NULL,
    deposit_fee DECIMAL(12,2) NOT NULL DEFAULT 400000,
    description NVARCHAR(255) NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);
GO
-- 3. Stations
CREATE TABLE Stations (
    station_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    location NVARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','maintenance'))
);
GO

-- 4. Towers
CREATE TABLE Towers (
    tower_id INT PRIMARY KEY IDENTITY(1,1),
    station_id INT NOT NULL,
    tower_number INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','maintenance')),
    CONSTRAINT FK_Towers_Stations FOREIGN KEY (station_id) REFERENCES Stations(station_id)
);
GO

-- 5. Slots
CREATE TABLE Slots (
    slot_id INT PRIMARY KEY IDENTITY(1,1),
    tower_id INT NOT NULL,
    slot_number INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('full','charging','empty','faulty')),
    CONSTRAINT FK_Slots_Towers FOREIGN KEY (tower_id) REFERENCES Towers(tower_id)
);
GO

-- 6. Batteries
CREATE TABLE Batteries (
    battery_id INT PRIMARY KEY IDENTITY(1,1),
    model NVARCHAR(50) NOT NULL,
    capacity DECIMAL(5,2) NOT NULL,
    state_of_health DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available','charging','in_use','faulty','in_stock')),
    slot_id INT NULL,
    last_maintenance_date DATETIME NULL,
    cycle_count INT DEFAULT 0,
    total_distance DECIMAL(12,2) DEFAULT 0,
    CONSTRAINT FK_Batteries_Slots FOREIGN KEY (slot_id) REFERENCES Slots(slot_id)
);
GO

-- 7. Vehicles (user exists before)
CREATE TABLE Vehicles (
    vehicle_id INT PRIMARY KEY IDENTITY(1,1),
    user_id VARCHAR(50) NOT NULL,
    plate_number VARCHAR(15) UNIQUE NOT NULL,
    model NVARCHAR(50) NOT NULL,
    vin_number VARCHAR(50) UNIQUE NOT NULL,
    battery_type NVARCHAR(50) NULL,
    compatible_battery_types NVARCHAR(MAX) NULL,
    current_battery_id INT NULL,
    current_odometer DECIMAL(12,2) DEFAULT 0,
    CONSTRAINT FK_Vehicles_Users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- 8. Contracts
CREATE TABLE Contracts (
    contract_id INT PRIMARY KEY IDENTITY(1,1),
    vehicle_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','canceled','completed')),
    contract_number NVARCHAR(50) UNIQUE NOT NULL,
    signed_date DATE DEFAULT GETDATE(),
    signed_place NVARCHAR(100) NULL,
    current_month VARCHAR(7) DEFAULT FORMAT(GETDATE(), 'yyyy-MM'),
    monthly_distance DECIMAL(12,2) DEFAULT 0,
    monthly_base_fee DECIMAL(12,2) DEFAULT 0,
    monthly_overage_distance DECIMAL(12,2) DEFAULT 0,
    monthly_overage_fee DECIMAL(12,2) DEFAULT 0,
    monthly_total_fee DECIMAL(12,2) DEFAULT 0,
    last_reset_date DATETIME DEFAULT GETDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Contracts_Vehicles FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    CONSTRAINT FK_Contracts_ServicePlans FOREIGN KEY (plan_id) REFERENCES ServicePlans(plan_id)
);
GO

-- 9. Payments
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
GO

-- 10. Swaps
-- Make many fields nullable to match DAO behaviour (auto swaps etc.)
CREATE TABLE Swaps (
    swap_id INT PRIMARY KEY IDENTITY(1,1),
    user_id VARCHAR(50) NULL,
    contract_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    station_id INT NULL,
    tower_id INT NULL,
    staff_id VARCHAR(50) NULL,
    old_battery_id INT NULL,
    new_battery_id INT NULL,
    odometer_before DECIMAL(12,2) NULL,
    odometer_after DECIMAL(12,2) NULL,
    distance_used AS (ISNULL(odometer_after, 0) - ISNULL(odometer_before, 0)),
    swap_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED','IN_PROGRESS','COMPLETED','FAILED','CANCELLED','AUTO')),
    CONSTRAINT FK_Swaps_Contracts FOREIGN KEY (contract_id) REFERENCES Contracts(contract_id),
    CONSTRAINT FK_Swaps_Vehicles FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    CONSTRAINT FK_Swaps_Stations FOREIGN KEY (station_id) REFERENCES Stations(station_id),
    CONSTRAINT FK_Swaps_Towers FOREIGN KEY (tower_id) REFERENCES Towers(tower_id),
    CONSTRAINT FK_Swaps_UsersStaff FOREIGN KEY (staff_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Swaps_OldBattery FOREIGN KEY (old_battery_id) REFERENCES Batteries(battery_id),
    CONSTRAINT FK_Swaps_NewBattery FOREIGN KEY (new_battery_id) REFERENCES Batteries(battery_id),
);
GO

ALTER TABLE Swaps
ADD CONSTRAINT CK_Swaps_Odometer CHECK (
    odometer_before IS NULL OR odometer_after IS NULL OR odometer_after >= odometer_before
);
GO

-- 11. Reports
CREATE TABLE Reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
    station_id INT NOT NULL,
    date DATE NOT NULL,
    total_swaps INT DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    issues NVARCHAR(MAX) NULL,
    CONSTRAINT FK_Reports_Stations FOREIGN KEY (station_id) REFERENCES Stations(station_id)
);
GO

-- 12. Issues / Feedback
CREATE TABLE Issues (
    issue_id INT PRIMARY KEY IDENTITY(1,1),
    user_id VARCHAR(50) NOT NULL,
    station_id INT NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Issues_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Issues_Stations FOREIGN KEY (station_id) REFERENCES Stations(station_id)
);
GO

-- 13. DistanceRateTiers
CREATE TABLE DistanceRateTiers (
    tier_id INT PRIMARY KEY IDENTITY(1,1),
    from_km INT NOT NULL,
    to_km INT NULL,
    rate_per_km DECIMAL(10,2) NOT NULL,
    description NVARCHAR(100) NULL
);
GO

-- SAMPLE DATA FIXED FOR UNICODE (N-prefix added)

-- SAMPLE DATA FIXED FOR UNICODE (N-prefix added)

INSERT INTO Users (user_id, last_name, first_name, email, phone, password, role, cccd, status) VALUES
('admin001', N'Nguyễn', N'Đức Anh', 'admin@evswap.com', '0901234567', 'admin123', 'Admin', '123456789001', 'active'),
('driver001', N'Trần', N'Văn Minh', 'minh.driver@gmail.com', '0902345678', 'driver123', N'EV Driver', '123456789002', 'active'),
('driver002', N'Lê', N'Thị Hoa', 'hoa.driver@gmail.com', '0903456789', 'driver123', N'EV Driver', '123456789003', 'active'),
('staff001', N'Phạm', N'Văn Đức', 'duc.staff@evswap.com', '0904567890', 'staff123', N'Staff', '123456789004', 'active'),
('staff002', N'Hoàng', N'Thị Mai', 'mai.staff@evswap.com', '0905678901', 'staff123', N'Staff', '123456789005', 'active');
GO

INSERT INTO ServicePlans (plan_name, base_price, base_distance, deposit_fee, description) VALUES
(N'Eco', 135000, 200, 400000, N'Nếu ≤ 200 km thì chỉ trả 135.000 VNĐ'),
(N'Cơ bản', 270000, 400, 400000, N'Nếu ≤ 400 km thì chỉ trả 270.000 VNĐ'),
(N'Plus', 405000, 600, 400000, N'Nếu ≤ 600 km thì chỉ trả 405.000 VNĐ'),
(N'Premium', 3000000, -1, 400000, N'Không giới hạn - Không áp dụng phí vượt km');
GO

INSERT INTO Stations (name, location, status) VALUES
(N'Trạm Cầu Giấy', N'Số 1 Cầu Giấy, Hà Nội', 'active'),
(N'Trạm Thanh Xuân', N'Số 5 Lê Văn Lương, Thanh Xuân, Hà Nội', 'active'),
(N'Trạm Long Biên', N'Số 10 Ngọc Thụy, Long Biên, Hà Nội', 'active'),
(N'Trạm Đống Đa', N'Số 15 Kim Liên, Đống Đa, Hà Nội', 'maintenance');
GO

INSERT INTO Towers (station_id, tower_number, status) VALUES
(1, 1, 'active'), (1, 2, 'active'),
(2, 1, 'active'), (2, 2, 'active'), (2, 3, 'active'),
(3, 1, 'active'), (3, 2, 'active'),
(4, 1, 'maintenance');
GO

-- Slots: statuses aligned with battery assignment below
-- For occupied slots where battery.status = 'available' -> slot = 'full'
-- where battery.status = 'charging' -> slot = 'charging'
-- unoccupied slots remain 'empty'
INSERT INTO Slots (tower_id, slot_number, status) VALUES
-- Tower 1 slots 1..8 (we occupy 1..5)
(1, 1, 'full'), (1, 2, 'full'), (1, 3, 'charging'), (1, 4, 'full'), (1, 5, 'charging'), (1, 6, 'empty'), (1, 7, 'empty'), (1, 8, 'empty'),
-- Tower 2 slots 9..16 (occupy 9..13)
(2, 1, 'full'), (2, 2, 'charging'), (2, 3, 'full'), (2, 4, 'full'), (2, 5, 'charging'), (2, 6, 'empty'), (2, 7, 'empty'), (2, 8, 'empty'),
-- Tower 3 slots 17..24 (occupy 17..21)
(3, 1, 'full'), (3, 2, 'charging'), (3, 3, 'full'), (3, 4, 'full'), (3, 5, 'charging'), (3, 6, 'empty'), (3, 7, 'empty'), (3, 8, 'empty'),
-- Tower 4 slots 25..32 (occupy 25..29)
(4, 1, 'full'), (4, 2, 'charging'), (4, 3, 'full'), (4, 4, 'full'), (4, 5, 'charging'), (4, 6, 'empty'), (4, 7, 'empty'), (4, 8, 'empty'),
-- Tower 5 slots 33..40 (occupy 33..37)
(5, 1, 'full'), (5, 2, 'charging'), (5, 3, 'full'), (5, 4, 'full'), (5, 5, 'charging'), (5, 6, 'empty'), (5, 7, 'empty'), (5, 8, 'empty'),
-- Tower 6 slots 41..48 (occupy 41..45)
(6, 1, 'full'), (6, 2, 'charging'), (6, 3, 'full'), (6, 4, 'full'), (6, 5, 'charging'), (6, 6, 'empty'), (6, 7, 'empty'), (6, 8, 'empty'),
-- Tower 7 slots 49..56 (occupy 49..53)
(7, 1, 'full'), (7, 2, 'charging'), (7, 3, 'full'), (7, 4, 'full'), (7, 5, 'charging'), (7, 6, 'empty'), (7, 7, 'empty'), (7, 8, 'empty');
GO

-- Populate batteries and assign to slots such that each tower keeps ~3 empty slots
-- There are 7 towers with 8 slots each (slot_id 1..56). We'll occupy slots 1-5 of each tower
-- (leave slots 6-8 per tower empty), providing ~3 empty slots per tower for swaps.
INSERT INTO Batteries (model, capacity, state_of_health, status, slot_id, cycle_count, total_distance) VALUES
-- Tower 1 (slot_id 1..8) -> occupy 1..5
('LiFePO4-60kWh', 100, 100.0, 'available', 1, 10, 500.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 2, 50, 2500.0),
('LiFePO4-60kWh', 100, 40, 'charging', 3, 80, 3900.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 4, 30, 1500.0),
('LiFePO4-60kWh', 100, 20, 'charging', 5, 120, 6000.0),
-- Tower 2 (slot_id 9..16) -> occupy 9..13
('LiFePO4-60kWh', 100, 100.0, 'available', 9, 20, 900.0),
('LiFePO4-60kWh', 100, 34, 'charging', 10, 60, 3000.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 11, 40, 2000.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 12, 150, 7500.0),
('LiFePO4-60kWh', 100, 30, 'charging', 13, 25, 1250.0),
-- Tower 3 (slot_id 17..24) -> occupy 17..21
('LiFePO4-60kWh', 100, 100.0, 'available', 17, 35, 1750.0),
('LiFePO4-60kWh', 100, 25, 'charging', 18, 110, 5500.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 19, 15, 750.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 20, 70, 3500.0),
('LiFePO4-60kWh', 100, 25, 'charging', 21, 200, 10000.0),
-- Tower 4 (slot_id 25..32) -> occupy 25..29
('LiFePO4-60kWh', 100, 100.0, 'available', 25, 18, 900.0),
('LiFePO4-60kWh', 100, 32, 'charging', 26, 40, 2000.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 27, 55, 2750.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 28, 88, 4400.0),
('LiFePO4-60kWh', 100, 10, 'charging', 29, 12, 600.0),
-- Tower 5 (slot_id 33..40) -> occupy 33..37
('LiFePO4-60kWh', 100, 100.0, 'available', 33, 45, 2250.0),
('LiFePO4-60kWh', 100, 24, 'charging', 34, 60, 3000.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 35, 28, 1400.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 36, 132, 6600.0),
('LiFePO4-60kWh', 100, 53, 'charging', 37, 77, 3850.0),
-- Tower 6 (slot_id 41..48) -> occupy 41..45
('LiFePO4-60kWh', 100, 100.0, 'available', 41, 8, 400.0),
('LiFePO4-60kWh', 100, 53, 'charging', 42, 66, 3300.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 43, 58, 2900.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 44, 140, 7000.0),
('LiFePO4-60kWh', 100, 12, 'charging', 45, 22, 1100.0),
-- Tower 7 (slot_id 49..56) -> occupy 49..53
('LiFePO4-60kWh', 100, 100.0, 'available', 49, 31, 1550.0),
('LiFePO4-60kWh', 100, 12, 'charging', 50, 47, 2350.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 51, 90, 4500.0),
('LiFePO4-60kWh', 100, 100.0, 'available', 52, 160, 8000.0),
('LiFePO4-60kWh', 100, 13, 'charging', 53, 14, 700.0),
-- Add some in_use batteries (no slot_id) representing those currently on vehicles
('LiFePO4-60kWh', 100, 91.0, 'in_use', NULL, 234, 15490.7),
('LiFePO4-60kWh', 100, 94.0, 'in_use', NULL, 198, 8785.6),
('LiFePO4-60kWh', 100, 93.0, 'in_use', NULL, 212, 12375.4),
-- Add several 'in_stock' warehouse batteries (status = 'in_stock', slot_id NULL)
('LiFePO4-60kWh', 100, 100.0, 'in_stock', NULL, 0, 0.0),
('LiFePO4-60kWh', 100, 100.0, 'in_stock', NULL, 0, 0.0),
('LiFePO4-60kWh', 100, 100.0, 'in_stock', NULL, 0, 0.0),
('LiFePO4-60kWh', 100, 100.0, 'in_stock', NULL, 0, 0.0),
('LiFePO4-60kWh', 100, 100.0, 'in_stock', NULL, 0, 0.0);
GO

INSERT INTO Vehicles (user_id, plate_number, model, vin_number, battery_type, compatible_battery_types, current_odometer) VALUES
('driver001', '30A-12345', N'VinFast VF-e34', 'VF1234567890ABCDE', 'LiFePO4-60kWh', 'LiFePO4-60kWh,LiFePO4-50kWh', 15490.7),
('driver001', '30B-6789', N'VinFast VF-8', 'VF2345678901BCDEF', 'LiFePO4-60kWh', 'LiFePO4-60kWh,LiFePO4-70kWh', 8785.6),
('driver002', '29A-11111', N'Tesla Model 3', 'TS1234567890GHIJK', 'LiFePO4-60kWh', 'LiFePO4-60kWh,LiFePO4-75kWh', 12375.4);
GO

INSERT INTO Contracts (vehicle_id, plan_id, start_date, end_date, status, contract_number, signed_place, 
                      current_month, monthly_distance, monthly_base_fee, monthly_overage_distance, monthly_overage_fee, monthly_total_fee) VALUES
(1, 2, '2024-01-01', '2024-12-31', 'active', 'CT-2024-001', N'Hà Nội', 
 '2024-10', 150.0, 270000, 0, 0, 270000),
(2, 3, '2024-02-15', '2025-02-14', 'active', 'CT-2024-002', N'Hà Nội',
 '2024-10', 780.0, 405000, 180.0, 64260, 469260),
(3, 1, '2024-03-01', '2025-02-28', 'active', 'CT-2024-003', N'Hà Nội',
 '2024-10', 320.0, 135000, 120.0, 42840, 177840);
GO

INSERT INTO Payments (user_id, contract_id, amount, method, status, currency, transaction_ref) VALUES
('driver001', 1, 500000, 'QR', 'success', 'VND', 'QR-20241001-001'),
('driver001', 2, 600000, 'Stripe', 'success', 'VND', 'ST-20241001-002'),
('driver002', 3, 550000, 'Subscription', 'success', 'VND', 'SUB-20241001-003'),
('driver001', 1, 50000, 'QR', 'success', 'VND', 'QR-20241005-004'),
('driver002', 3, 50000, 'QR', 'success', 'VND', 'QR-20241005-005');
GO

INSERT INTO Swaps (user_id, contract_id, vehicle_id, station_id, tower_id, staff_id, old_battery_id, new_battery_id, 
                  odometer_before, odometer_after, status) VALUES
('driver001', 1, 1, 1, 1, 'staff001', 20, 1, 15000, 15450.8, 'COMPLETED'),
('driver001', 2, 2, 2, 3, 'staff002', 21, 9, 8750.2, 8785.6, 'COMPLETED'),
('driver002', 3, 3, 1, 2, 'staff001', 22, 5, 11900.1, 12375.4, 'COMPLETED'),
('driver001', 1, 1, 2, 4, 'staff002', 1, 11, 15460.3, 15490.7, 'COMPLETED');
GO

INSERT INTO Reports (station_id, date, total_swaps, revenue, issues) VALUES
(1, '2024-10-05', 2, 100000, N'Không có vấn đề'),
(2, '2024-10-05', 2, 50000, N'Tower 2 có sự cố nhẹ đã khắc phục'),
(3, '2024-10-05', 0, 0, N'Không có hoạt động'),
(4, '2024-10-05', 0, 0, N'Đang bảo trì');
GO

INSERT INTO Issues (user_id, station_id, description, status) VALUES
('driver001', 2, N'Slot 4 của Tower 2 không nhận pin', 'resolved'),
('driver002', 1, N'Màn hình thông tin bị lỗi hiển thị', 'in_progress'),
('driver001', 3, N'Khu vực đỗ xe quá chật', 'open');
GO

INSERT INTO DistanceRateTiers (from_km, to_km, rate_per_km, description) VALUES
(0, 2000, 357, N'Từ giới hạn cơ sở đến 2.000 km'),
(2001, 4000, 346, N'Từ 2.001 km – 4.000 km'),
(4001, 6000, 335, N'Từ 4.001 km – 6.000 km'),
(6001, NULL, 313, N'Trên 6.000 km');
GO

-- Update Vehicles with current batteries
UPDATE Vehicles SET current_battery_id = 20 WHERE vehicle_id = 1;
UPDATE Vehicles SET current_battery_id = 21 WHERE vehicle_id = 2;
UPDATE Vehicles SET current_battery_id = 22 WHERE vehicle_id = 3;
GO

-- Add FK constraint for Vehicles.current_battery_id -> Batteries (now that Batteries table and data exist)
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Vehicles_CurrentBattery')
BEGIN
    ALTER TABLE Vehicles ADD CONSTRAINT FK_Vehicles_CurrentBattery
        FOREIGN KEY (current_battery_id) REFERENCES Batteries(battery_id);
END
GO

-- Function: Chọn bậc giá theo tổng km tháng (không lũy tiến)
CREATE OR ALTER FUNCTION dbo.ufn_rate_for_total_km (@total_km INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @rate DECIMAL(10,2);
    SELECT TOP (1) @rate = rate_per_km
    FROM DistanceRateTiers
    WHERE @total_km BETWEEN from_km AND ISNULL(to_km, 2147483647)
    ORDER BY from_km ASC;
    RETURN ISNULL(@rate, 0);
END
GO

-- Procedure: Tính tiền tháng theo bậc giá
CREATE OR ALTER PROCEDURE dbo.usp_CalcMonthlyBill_ByTier
    @contract_id INT, 
    @year INT, 
    @month INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @first DATE = DATEFROMPARTS(@year, @month, 1);
    DECLARE @next DATE = DATEADD(MONTH, 1, @first);
    DECLARE @yyyymm VARCHAR(7) = CONVERT(CHAR(7), @first, 126);

    -- Get base plan info
    DECLARE @base_price DECIMAL(12,2), @base_distance INT;
    SELECT @base_price = sp.base_price, @base_distance = sp.base_distance
    FROM Contracts c 
    JOIN ServicePlans sp ON c.plan_id = sp.plan_id
    WHERE c.contract_id = @contract_id;

    -- Calculate total distance from swaps
    DECLARE @total_km DECIMAL(12,2) = (
        SELECT ISNULL(SUM(distance_used), 0)
        FROM Swaps
        WHERE contract_id = @contract_id
          AND status = 'COMPLETED'
          AND swap_date >= @first 
          AND swap_date < @next
    );

    -- Calculate overage
    DECLARE @over_km DECIMAL(12,2) = CASE 
        WHEN @base_distance = -1 THEN 0
        WHEN @total_km > @base_distance THEN @total_km - @base_distance 
        ELSE 0 
    END;

    -- Get rate based on total km
    DECLARE @rate DECIMAL(10,2) = dbo.ufn_rate_for_total_km(CAST(@total_km AS INT));
    
    -- Calculate fees
    DECLARE @over_fee DECIMAL(12,2) = @over_km * @rate;
    DECLARE @total_fee DECIMAL(12,2) = @base_price + @over_fee;

    -- Update contract
    UPDATE Contracts 
    SET current_month = @yyyymm,
        monthly_distance = @total_km,
        monthly_overage_distance = @over_km,
        monthly_overage_fee = @over_fee,
        monthly_total_fee = @total_fee,
        updated_at = GETDATE()
    WHERE contract_id = @contract_id;

    -- Return summary
    SELECT 
        @contract_id AS contract_id,
        @yyyymm AS month,
        @total_km AS total_km,
        @base_distance AS base_distance,
        @base_price AS base_price,
        @rate AS rate_per_km_applied,
        @over_km AS overage_km,
        @over_fee AS overage_fee,
        @total_fee AS total_fee;
END
GO


-- Hàm chọn bậc theo TỔNG KM THÁNG (không lũy tiến)
CREATE OR ALTER FUNCTION dbo.ufn_rate_for_total_km (@total_km INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @rate DECIMAL(10,2);
    SELECT TOP (1) @rate = rate_per_km
    FROM DistanceRateTiers
    WHERE @total_km BETWEEN from_km AND ISNULL(to_km, 2147483647)
    ORDER BY from_km ASC;
    RETURN ISNULL(@rate, 0);
END
GO

-- Proc tính tiền theo bậc
CREATE OR ALTER PROCEDURE dbo.usp_CalcMonthlyBill_ByTier
    @contract_id INT, @year INT, @month INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @first DATE = DATEFROMPARTS(@year,@month,1);
    DECLARE @next  DATE = DATEADD(MONTH,1,@first);
    DECLARE @yyyymm VARCHAR(7) = CONVERT(CHAR(7),@first,126);

    DECLARE @base_price DECIMAL(12,2), @base_distance INT;
    SELECT @base_price=sp.base_price,@base_distance=sp.base_distance
    FROM Contracts c JOIN ServicePlans sp ON c.plan_id=sp.plan_id
    WHERE c.contract_id=@contract_id;

    DECLARE @total_km DECIMAL(12,2) = (
        SELECT ISNULL(SUM(distance_used),0)
        FROM Swaps
        WHERE contract_id=@contract_id
          AND status='COMPLETED'
          AND swap_date>=@first AND swap_date<@next
    );

    DECLARE @over_km DECIMAL(12,2)=CASE WHEN @base_distance=-1 THEN 0
                                        WHEN @total_km>@base_distance THEN @total_km-@base_distance ELSE 0 END;
    DECLARE @rate DECIMAL(10,2)=dbo.ufn_rate_for_total_km(CAST(@total_km AS INT));
    DECLARE @over_fee DECIMAL(12,2)=@over_km*@rate;
    DECLARE @total_fee DECIMAL(12,2)=@base_price+@over_fee;

    UPDATE Contracts SET
        current_month=@yyyymm,
        monthly_distance=@total_km,
        monthly_overage_distance=@over_km,
        monthly_overage_fee=@over_fee,
        monthly_total_fee=@total_fee,
        updated_at=GETDATE()
    WHERE contract_id=@contract_id;

    SELECT @contract_id contract_id,@yyyymm month,@total_km total_km,
           @base_distance base_distance,@base_price base_price,@rate rate_per_km_applied,
           @over_km overage_km,@over_fee overage_fee,@total_fee total_fee;
END
GO
