# ⚡ EV Battery Swap System - Frontend

> Hệ thống quản lý đổi pin xe điện thông minh với React + Vite + Zustand

## 🎯 Tổng Quan

Ứng dụng web quản lý hệ thống đổi pin cho xe điện, hỗ trợ 3 vai trò:
- **Driver** - Tài xế xe điện
- **Staff** - Nhân viên trạm
- **Admin** - Quản trị viên

## ✨ Tính Năng Chính

### 👤 Driver (Tài Xế)
- 🔋 Đổi pin nhanh chóng
- 🗺️ Tìm trạm gần nhất
- 🚗 Quản lý phương tiện
- 💳 Thanh toán & lịch sử
- 📊 Dashboard cá nhân
- 📝 Quản lý hợp đồng
- 🎫 Gói dịch vụ

### 👨‍💼 Staff (Nhân Viên)
- 🏢 Quản lý trạm
- ✅ Xác nhận đổi pin
- 📦 Quản lý kho pin
- 📊 Báo cáo hoạt động
- 🔧 Xử lý sự cố
- 💼 Quản lý giao dịch

### 👑 Admin (Quản Trị)
- 👥 Quản lý người dùng
- 🏢 Quản lý trạm
- 🔋 Quản lý pin
- 📊 Báo cáo tổng quan
- 💰 Quản lý doanh thu
- ⚙️ Cấu hình hệ thống

## 🏗️ Kiến Trúc

### Tech Stack
- **Frontend:** React 18 + Vite
- **State Management:** Zustand
- **Routing:** React Router v6
- **Styling:** CSS3 + Custom CSS
- **Maps:** Leaflet
- **HTTP Client:** Fetch API
- **Backend:** Spring Boot (Java)
- **Database:** SQL Server

### Cấu Trúc Dự Án

```
SWP222/
├── src/
│   ├── assets/
│   │   ├── css/                    # Styles
│   │   └── js/
│   │       ├── config/             # API config
│   │       ├── services/           # 10 API services
│   │       ├── store/              # 10 Zustand stores
│   │       ├── hooks/              # Custom hooks
│   │       └── utils/              # Utilities
│   ├── components/                 # React components
│   ├── pages/                      # Page components
│   ├── layouts/                    # Layout components
│   ├── context/                    # React contexts
│   └── routes/                     # Route configs
├── public/
└── Documentation files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm hoặc yarn
- Backend API running (Spring Boot)

### Installation

```bash
# Clone repository
git clone [repository-url]

# Navigate to frontend
cd SWP222

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📦 State Management

Dự án sử dụng **Zustand** với 10 stores:

1. **authSlice** - Authentication
2. **stationSlice** - Stations
3. **swapSlice** - Battery Swaps
4. **vehicleSlice** - Vehicles
5. **batterySlice** - Batteries
6. **contractSlice** - Contracts
7. **paymentSlice** - Payments
8. **userSlice** - Users
9. **reportSlice** - Reports
10. **notificationSlice** - Notifications

### Usage Example

```javascript
import useStationStore from '@/assets/js/store/stationSlice';

function StationList() {
  const { stations, fetchStations } = useStationStore();
  
  useEffect(() => {
    fetchStations();
  }, []);
  
  return (
    <div>
      {stations.map(station => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
```

## 🔐 Authentication

### Demo Accounts

```javascript
// Admin
Email: admin@evswap.com
Password: admin123

// Driver
Email: minh.driver@gmail.com
Password: driver123

// Staff
Email: duc.staff@evswap.com
Password: staff123
```

## 📚 Documentation

### Main Documentation Files

1. **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
2. **[REDUX_STORE_GUIDE.md](./REDUX_STORE_GUIDE.md)** - Store documentation
3. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Project structure
4. **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Integration summary

### API Documentation
- Backend API: `../EvDrivers/API_DOCUMENTATION.md`
- Swagger: `../EvDrivers/API_SWAGGER_DOCUMENTATION.yaml`

## 🎨 UI/UX

### Design Principles
- **Responsive** - Mobile-first design
- **Intuitive** - Easy to navigate
- **Modern** - Clean and professional
- **Fast** - Optimized performance

### Color Scheme
- Primary: `#19c37d` (Green)
- Secondary: `#42a5f5` (Blue)
- Accent: `#ffa726` (Orange)
- Error: `#f44336` (Red)
- Success: `#19c37d` (Green)

## 🔧 Development

### Project Structure

```
src/
├── assets/
│   ├── css/                    # Global styles
│   └── js/
│       ├── config/
│       │   └── api.js          # API configuration
│       ├── services/           # API services (10)
│       ├── store/              # Zustand stores (10)
│       ├── hooks/              # Custom hooks
│       └── utils/              # Utility functions
├── components/
│   ├── common/                 # Shared components
│   ├── modals/                 # Modal components
│   └── ProtectedRoute.jsx      # Route protection
├── pages/
│   ├── Admin/                  # Admin pages
│   ├── Driver/                 # Driver pages
│   └── Staff/                  # Staff pages
├── layouts/                    # Layout components
├── context/                    # React contexts
└── routes/                     # Route definitions
```

### Code Style

- **ESLint** - Code linting
- **Prettier** - Code formatting
- Follow React best practices
- Use functional components
- Use hooks for state management

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature

# Create pull request
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

### Optimization Techniques
- Code splitting
- Lazy loading
- Memoization
- Debouncing
- Caching

### Performance Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: CORS Error
**Solution:** Ensure backend is running and CORS is configured

#### Issue 2: 401 Unauthorized
**Solution:** Check authentication token, try re-login

#### Issue 3: Store not updating
**Solution:** Ensure async/await is used correctly

#### Issue 4: Build fails
**Solution:** Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

### How to Contribute

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit pull request

### Code Review Process

1. Code review by team lead
2. Pass all tests
3. Meet code quality standards
4. Update documentation
5. Merge to main branch

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

### Development Team
- Frontend Developers
- Backend Developers
- UI/UX Designers
- QA Engineers

### Contact
- Email: support@evswap.com
- Website: https://evswap.com

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Basic authentication
- [x] Station management
- [x] Battery swap flow
- [x] Vehicle management
- [x] Payment system

### Phase 2 (In Progress) 🔄
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Offline support

### Phase 3 (Planned) 📋
- [ ] AI-powered recommendations
- [ ] IoT integration
- [ ] Blockchain payments
- [ ] Multi-language support

## 📊 Statistics

- **Total Lines of Code:** ~15,000+
- **Components:** 50+
- **Services:** 10
- **Stores:** 10
- **Pages:** 22+
- **Routes:** 30+

## 🎓 Learning Resources

### React
- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)

### Zustand
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript.info](https://javascript.info)

## 🙏 Acknowledgments

- React team for amazing framework
- Zustand team for simple state management
- Leaflet for maps integration
- All open source contributors

## 📞 Support

### Getting Help
1. Check documentation files
2. Search existing issues
3. Create new issue
4. Contact support team

### Useful Links
- [Documentation](./QUICK_START.md)
- [API Docs](../EvDrivers/API_DOCUMENTATION.md)
- [Issue Tracker](https://github.com/your-repo/issues)

---

**Made with ❤️ by EV Swap Team**

*Last Updated: October 9, 2025*
*Version: 1.0.0*
