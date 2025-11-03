import React, { useState, useEffect } from 'react';
import contractService from '../../../../assets/js/services/contractService';

const CreateContractModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        userId: '',
        vehicleId: '',
        planId: '',
        startDate: '',
        endDate: '',
        signedPlace: 'Hà Nội'
    });
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchPlans();
            // Set default dates
            const today = new Date();
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            
            setFormData(prev => ({
                ...prev,
                startDate: today.toISOString().split('T')[0],
                endDate: nextMonth.toISOString().split('T')[0]
            }));
        }
    }, [isOpen]);

    const fetchPlans = async () => {
        try {
            const response = await contractService.getPlans();
            if (response.success) {
                setPlans(response.data);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Validate
            if (!formData.userId || !formData.vehicleId || !formData.planId || !formData.startDate || !formData.endDate) {
                throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
            }

            const response = await contractService.createContract({
                userId: formData.userId,
                vehicleId: parseInt(formData.vehicleId),
                planId: parseInt(formData.planId),
                startDate: formData.startDate,
                endDate: formData.endDate,
                signedPlace: formData.signedPlace || 'Hà Nội'
            });

            if (response.success) {
                alert('Tạo hợp đồng thành công!');
                onSuccess();
                resetForm();
            } else {
                throw new Error(response.message || 'Tạo hợp đồng thất bại');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            userId: '',
            vehicleId: '',
            planId: '',
            startDate: '',
            endDate: '',
            signedPlace: 'Hà Nội'
        });
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto'
        }} onClick={onClose}>
            <div style={{
                background: '#1f2937',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                border: '1px solid #374151',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #374151'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>Tạo Hợp đồng Mới</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '14px' }}>
                        Điền thông tin để tạo hợp đồng thuê pin cho khách hàng
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{
                    padding: '20px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {error && (
                        <div style={{
                            background: '#991b1b',
                            color: '#fca5a5',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                            User ID <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            placeholder="Nhập User ID của khách hàng"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#374151',
                                color: 'white',
                                border: '1px solid #4b5563',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                            Vehicle ID <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            placeholder="Nhập ID của xe"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#374151',
                                color: 'white',
                                border: '1px solid #4b5563',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                            Gói dịch vụ <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                            name="planId"
                            value={formData.planId}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#374151',
                                color: 'white',
                                border: '1px solid #4b5563',
                                borderRadius: '8px'
                            }}
                        >
                            <option value="">-- Chọn gói dịch vụ --</option>
                            {plans.map(plan => (
                                <option key={plan.planId} value={plan.planId}>
                                    {plan.planName} - {plan.basePrice?.toLocaleString('vi-VN')}đ/tháng
                                    {plan.isUnlimited ? ' (Không giới hạn)' : ` (${plan.baseDistance} km)`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                                Ngày bắt đầu <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#374151',
                                    color: 'white',
                                    border: '1px solid #4b5563',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                                Ngày kết thúc <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#374151',
                                    color: 'white',
                                    border: '1px solid #4b5563',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                            Nơi ký hợp đồng
                        </label>
                        <input
                            type="text"
                            name="signedPlace"
                            value={formData.signedPlace}
                            onChange={handleChange}
                            placeholder="Nhập nơi ký hợp đồng"
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#374151',
                                color: 'white',
                                border: '1px solid #4b5563',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div style={{
                        background: '#374151',
                        padding: '15px',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>
                            <strong>Lưu ý:</strong> Hệ thống sẽ tự động kiểm tra:
                        </p>
                        <ul style={{ margin: '10px 0 0 20px', fontSize: '13px', color: '#9ca3af' }}>
                            <li>User ID phải tồn tại và đã kích hoạt</li>
                            <li>Vehicle ID phải thuộc về User</li>
                            <li>Không được trùng với hợp đồng active khác</li>
                            <li>Ngày kết thúc phải sau ngày bắt đầu</li>
                        </ul>
                    </div>
                </form>

                {/* Footer */}
                <div style={{
                    padding: '20px',
                    background: '#111827',
                    borderTop: '1px solid #374151',
                    borderRadius: '0 0 16px 16px',
                    display: 'flex',
                    gap: '10px'
                }}>
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        style={{
                            flex: 1,
                            background: '#374151',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            background: isLoading ? '#4b5563' : '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isLoading ? 'Đang tạo...' : 'Tạo Hợp đồng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateContractModal;
