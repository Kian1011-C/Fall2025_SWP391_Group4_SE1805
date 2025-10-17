// Admin/Reports/components/CustomersTab.jsx
// Customers tab with demographics and loyalty tiers

import React from 'react';
import { formatNumber, getLoyaltyTierColor } from '../utils';

export const CustomersTab = ({ data }) => {
  if (!data) return null;

  const { demographics = {}, loyaltyTiers = [] } = data;
  const { gender = {}, ageGroups = {} } = demographics;

  const genderData = [
    { label: 'Nam', value: gender.male || 0, color: '#3B82F6', icon: '👨' },
    { label: 'Nữ', value: gender.female || 0, color: '#EC4899', icon: '👩' },
    { label: 'Khác', value: gender.other || 0, color: '#8B5CF6', icon: '👤' }
  ];

  const ageData = [
    { label: '18-25', value: ageGroups['18-25'] || 0, color: '#10B981' },
    { label: '26-35', value: ageGroups['26-35'] || 0, color: '#F59E0B' },
    { label: '36-50', value: ageGroups['36-50'] || 0, color: '#EF4444' },
    { label: '50+', value: ageGroups['50+'] || 0, color: '#8B5CF6' }
  ];

  const totalCustomers = genderData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      {/* Demographics */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          👥 Thống kê khách hàng
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '25px'
        }}>
          {/* Gender Distribution */}
          <div>
            <h4 style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '15px' }}>
              Phân bố theo giới tính
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {genderData.map((item, index) => {
                const percentage = totalCustomers > 0 
                  ? Math.round((item.value / totalCustomers) * 100) 
                  : 0;
                
                return (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '15px',
                    border: `1px solid ${item.color}33`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {item.icon} {item.label}
                      </span>
                      <span style={{ color: item.color, fontWeight: '600' }}>
                        {formatNumber(item.value)} ({percentage}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Distribution */}
          <div>
            <h4 style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '15px' }}>
              Phân bố theo độ tuổi
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {ageData.map((item, index) => {
                const percentage = totalCustomers > 0 
                  ? Math.round((item.value / totalCustomers) * 100) 
                  : 0;
                
                return (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '15px',
                    border: `1px solid ${item.color}33`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {item.label} tuổi
                      </span>
                      <span style={{ color: item.color, fontWeight: '600' }}>
                        {formatNumber(item.value)} ({percentage}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Tiers */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          ⭐ Phân hạng khách hàng thân thiết
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          {loyaltyTiers.map((tier, index) => {
            const tierColor = getLoyaltyTierColor(tier.tier);
            const tierIcons = {
              'bronze': '🥉',
              'silver': '🥈',
              'gold': '🥇',
              'platinum': '💎'
            };
            
            return (
              <div key={index} style={{
                background: `linear-gradient(135deg, ${tierColor}22, ${tierColor}11)`,
                borderRadius: '16px',
                padding: '25px',
                border: `2px solid ${tierColor}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                  {tierIcons[tier.tier] || '🏆'}
                </div>
                <div style={{ 
                  color: tierColor, 
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '10px',
                  textTransform: 'uppercase'
                }}>
                  {tier.tier}
                </div>
                <div style={{ 
                  color: '#FFFFFF', 
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  marginBottom: '5px'
                }}>
                  {formatNumber(tier.count)}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.85rem' }}>
                  khách hàng
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
