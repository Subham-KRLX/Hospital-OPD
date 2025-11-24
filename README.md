# 🏥 Hospital OPD Management System

	⁠A revolutionary healthcare platform that combines cutting-edge AI, blockchain security, and modern web technologies to transform outpatient department management.

[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue)](https://www.mysql.com/)
[![AI Powered](https://img.shields.io/badge/AI-OpenAI%20GPT--4-orange)](https://openai.com/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Secured-purple)](https://ethereum.org/)

---

## 🌟 What Makes This Special?

While most hospital management systems are just glorified CRUD applications, we've built something that actually pushes boundaries. This isn't your typical college project - it's a production-ready healthcare platform with *45+ unique features* that solve real-world problems.

### 🚀 The "Wow" Features

*🤖 AI Medical Chatbot*  
24/7 intelligent assistant powered by OpenAI GPT-4 that helps patients with symptom assessment, appointment scheduling, and general health queries. It's like having a medical receptionist who never sleeps.

*🎙️ Voice-to-Text Prescriptions*  
Doctors can dictate prescriptions naturally - "Give paracetamol 500mg twice daily for 5 days" - and watch it automatically format into a proper prescription with drug interaction warnings. Revolutionary? We think so.

*🔐 Blockchain Medical Records*  
Your medical history isn't stored in some hackable database. It's secured on blockchain with smart contracts, giving patients full control over who accesses their data. HIPAA compliance meets Web3.

*📹 WebRTC Video Consultations*  
Crystal-clear telemedicine built right in. No third-party apps, no security concerns - just seamless doctor-patient video calls with screen sharing and session recording.

*📱 Progressive Web App*  
Install it like a native app, use it offline, get push notifications even when the browser is closed. It's 2025, and your healthcare system should work everywhere.

*⚡ Real-time Everything*  
Socket.io powers live appointment updates, instant chat, emergency alerts, and real-time doctor availability. Because waiting for page refreshes is so 2015.

---

## 🎯 Core Modules

### 1. 👤 Patient Registration & Management
•⁠  ⁠Comprehensive medical history tracking
•⁠  ⁠Emergency contact management
•⁠  ⁠Secure document storage with encryption
•⁠  ⁠Multi-device access with offline sync

### 2. 👨‍⚕️ Doctor Profiles & Slot Management
•⁠  ⁠Detailed profiles with specializations and qualifications
•⁠  ⁠Dynamic availability scheduling
•⁠  ⁠Conflict resolution for double bookings
•⁠  ⁠Smart break-time management

### 3. 📅 AI-Enhanced Appointment Scheduling
•⁠  ⁠ML-powered slot optimization
•⁠  ⁠No-show prediction algorithms
•⁠  ⁠Automated reminders via SMS, Email, WhatsApp
•⁠  ⁠Dynamic rescheduling suggestions

### 4. 💊 Voice-Activated Prescription System
•⁠  ⁠Medical terminology recognition
•⁠  ⁠Real-time drug interaction warnings
•⁠  ⁠Allergy alerts integrated with patient history
•⁠  ⁠Digital prescription generation

### 5. 🧪 Smart Lab Request Management
•⁠  ⁠Comprehensive test catalog
•⁠  ⁠Automated ordering workflows
•⁠  ⁠Result management with AI analysis
•⁠  ⁠PDF report generation

### 6. 💰 Blockchain-Secured Billing System
•⁠  ⁠Transparent invoice generation
•⁠  ⁠Multiple payment gateways
•⁠  ⁠Immutable transaction records
•⁠  ⁠Advanced financial reporting

### 7. 💬 Real-time Communication Hub
•⁠  ⁠Doctor-patient messaging
•⁠  ⁠Multi-channel notifications (Web Push, SMS, Email, WhatsApp)
•⁠  ⁠Emergency broadcast system
•⁠  ⁠In-app toast notifications

### 8. 📊 Predictive Analytics Dashboard
•⁠  ⁠Patient flow forecasting
•⁠  ⁠Resource utilization insights
•⁠  ⁠Early warning systems for overcrowding
•⁠  ⁠Performance metrics visualization

---

## 🛠️ Tech Stack

### Frontend Excellence
⁠ javascript
Next.js 14          // Server-side rendering & blazing performance
React 18            // Component architecture
TailwindCSS         // Beautiful, responsive design
Socket.io Client    // Real-time communication
React Query         // State management & caching
Framer Motion       // Smooth animations
React Hook Form     // Efficient form handling
React Speech Kit    // Voice recognition
 ⁠

### Backend Powerhouse
⁠ javascript
Node.js + Express   // RESTful API server
Prisma ORM          // Type-safe database queries
MySQL               // Reliable data storage
Socket.io           // WebSocket server
OpenAI API          // GPT-4 integration
Web Push            // Notification service
Twilio              // SMS & WhatsApp
JWT                 // Secure authentication
Bcrypt              // Password encryption
Helmet              // Security headers
 ⁠

### Revolutionary Add-ons
⁠ javascript
Blockchain          // Solidity smart contracts for medical records
WebRTC              // Peer-to-peer video consultations
Docker              // Containerization & microservices
Web3.js             // Blockchain integration
 ⁠

---

## 📁 Database Schema Highlights

⁠ prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      UserRole
  createdAt DateTime @default(now())
  patient   Patient?
  doctor    Doctor?
}

model Appointment {
  id            Int               @id @default(autoincrement())
  patientId     Int
  doctorId      Int
  scheduledAt   DateTime
  status        AppointmentStatus @default(SCHEDULED)
  aiInsights    Json?             // ML predictions & recommendations
  bookingMethod String            // voice, web, chatbot, etc.
  patient       Patient           @relation(fields: [patientId], references: [id])
  doctor        Doctor            @relation(fields: [doctorId], references: [id])
}
 ⁠

---

## 🚀 Getting Started

### Prerequisites
⁠ bash
Node.js 18+
MySQL 8.0+
Docker (optional but recommended)
 ⁠

### Installation

1.⁠ ⁠*Clone the repository*
⁠ bash
git clone https://github.com/Aashish-Jha-11/Hospital-OPD.git
cd Hospital-OPD-
 ⁠

2.⁠ ⁠*Install dependencies*
⁠ bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
 ⁠

3.⁠ ⁠*Environment setup*
⁠ bash
# Backend .env
DATABASE_URL="mysql://user:password@localhost:3306/hospital_opd"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
VAPID_PUBLIC_KEY="your-vapid-public"
VAPID_PRIVATE_KEY="your-vapid-private"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"

# Frontend .env.local
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_VAPID_KEY="your-vapid-public"
 ⁠

4.⁠ ⁠*Database setup*
⁠ bash
cd backend
npx prisma migrate dev
npx prisma db seed
 ⁠

5.⁠ ⁠*Run the application*
⁠ bash
# Using Docker (recommended)
docker-compose up

# Or manually
# Terminal 1 - Backend
cd backend && nodemon server.js

# Terminal 2 - Frontend
cd frontend && npm run dev
 ⁠

6.⁠ ⁠*Access the application*
•⁠  ⁠Frontend: ⁠ http://localhost:3000 ⁠
•⁠  ⁠Backend API: ⁠ http://localhost:3001 ⁠
•⁠  ⁠API Documentation: ⁠ http://localhost:3001/api-docs ⁠

---

## 🎨 Features Showcase

### 🔔 Multi-Channel Notifications

*Web Push Notifications* (works even when browser is closed)
⁠ javascript
// Appointment reminders, emergency alerts, test results
✅ Background notifications
✅ Action buttons (Confirm, Reschedule)
✅ Custom vibration patterns
✅ Auto-sync across devices
 ⁠

*Real-time Socket.io Updates*
⁠ javascript
// Live updates as they happen
⚡ New appointment bookings
⚡ Doctor availability changes
⚡ Emergency broadcasts
⚡ Chat messages
 ⁠

*PWA Badge Notifications*
⁠ javascript
// Visual indicators on app icon
🔴 Unread message count
🔴 Pending appointment count
 ⁠

*In-Browser Toast Notifications*
⁠ javascript
// Elegant, non-intrusive alerts
💬 Success confirmations
💬 Warning messages
💬 Info updates
 ⁠

### 🤖 AI Integration Deep Dive

*Medical Chatbot Capabilities:*
•⁠  ⁠Symptom assessment with preliminary insights
•⁠  ⁠Appointment scheduling assistance
•⁠  ⁠General health information
•⁠  ⁠Medication queries
•⁠  ⁠Always recommends professional consultation

*Voice Recognition Features:*
•⁠  ⁠Medical terminology processing
•⁠  ⁠Real-time transcription
•⁠  ⁠Context-aware interpretation
•⁠  ⁠Drug interaction checking
•⁠  ⁠Automatic dosage formatting

*Predictive Analytics:*
•⁠  ⁠Patient flow prediction
•⁠  ⁠Resource utilization forecasting
•⁠  ⁠No-show probability
•⁠  ⁠Early warning systems
•⁠  ⁠Treatment recommendation support

### 🔒 Security & Compliance

*HIPAA Compliant Features:*
•⁠  ⁠✅ AES-256-GCM encryption for patient data
•⁠  ⁠✅ Role-based access control (RBAC)
•⁠  ⁠✅ Audit logging for all data access
•⁠  ⁠✅ Secure file storage and transmission
•⁠  ⁠✅ Automatic session timeout
•⁠  ⁠✅ Two-factor authentication ready

*Blockchain Security:*
•⁠  ⁠Immutable medical record storage
•⁠  ⁠Patient-controlled access management
•⁠  ⁠Transparent audit trails
•⁠  ⁠Smart contract validation
•⁠  ⁠Decentralized architecture

---

## 📱 Progressive Web App Features

⁠ javascript
✨ Install to home screen (iOS, Android, Desktop)
✨ Offline functionality with service workers
✨ Background sync for delayed actions
✨ Push notifications even when app is closed
✨ Automatic updates
✨ Native app-like experience
 ⁠

**New:** The PWA dashboard now ships with a Notification Health Monitor (`frontend/src/components/pwa/push-diagnostics.jsx`) so developers and power users can inspect browser support, verify service workers, re-subscribe devices, and dispatch custom test payloads without leaving the app.

---

## 🎯 12-Week Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
•⁠  ⁠✅ Project architecture setup
•⁠  ⁠✅ Authentication system
•⁠  ⁠✅ Database design with Prisma
•⁠  ⁠✅ Core API development

### Phase 2: Core Backend (Weeks 3-4)
•⁠  ⁠✅ Patient management system
•⁠  ⁠✅ Doctor management & scheduling
•⁠  ⁠✅ Appointment booking logic
•⁠  ⁠✅ Prescription & lab request systems
•⁠  ⁠✅ Billing foundation

### Phase 3: Frontend Excellence (Weeks 5-6)
•⁠  ⁠✅ Authentication UI
•⁠  ⁠✅ Role-based dashboards
•⁠  ⁠✅ Appointment booking interface
•⁠  ⁠✅ Medical records display
•⁠  ⁠✅ Responsive mobile design

### Phase 4: Real-time & Modern Web (Weeks 7-8)
•⁠  ⁠✅ Socket.io integration
•⁠  ⁠✅ Web Push notifications
•⁠  ⁠✅ PWA implementation
•⁠  ⁠✅ Communication APIs (Twilio, Email)
•⁠  ⁠✅ File management system

### Phase 5: AI Revolution (Weeks 9-10)
•⁠  ⁠✅ OpenAI medical chatbot
•⁠  ⁠✅ Voice recognition system
•⁠  ⁠✅ Smart scheduling algorithms
•⁠  ⁠✅ Predictive analytics
•⁠  ⁠✅ AI-enhanced medical features

### Phase 6: Cutting-Edge Tech (Weeks 11-12)
•⁠  ⁠✅ Blockchain medical records
•⁠  ⁠✅ WebRTC video consultations
•⁠  ⁠✅ Microservices architecture
•⁠  ⁠✅ Docker containerization
•⁠  ⁠✅ Production deployment
•⁠  ⁠✅ Comprehensive documentation

---

## 🏆 What Sets This Apart

### Typical College Projects ❌
•⁠  ⁠Basic CRUD operations
•⁠  ⁠Simple HTML forms
•⁠  ⁠Manual appointment booking
•⁠  ⁠No real-time features
•⁠  ⁠Basic authentication only
•⁠  ⁠Security as an afterthought

### Our System ✅
•⁠  ⁠*AI-First Approach*: GPT-4 medical chatbot, voice prescriptions, predictive analytics
•⁠  ⁠*Blockchain Security*: Industry-leading data protection
•⁠  ⁠*Real-time Everything*: Socket.io for instant updates
•⁠  ⁠*Professional Architecture*: Microservices, Docker, scalable design
•⁠  ⁠*Modern Web Standards*: PWA, offline mode, push notifications
•⁠  ⁠*Production Ready*: HIPAA compliant, secure, optimized

---

## 📊 Success Metrics

### Essential (MVP) ✅
•⁠  ⁠Role-based authentication
•⁠  ⁠Patient/doctor management
•⁠  ⁠Appointment booking
•⁠  ⁠Prescription management
•⁠  ⁠Responsive web interface
•⁠  ⁠Real-time notifications

### Advanced (Above Average) ✅
•⁠  ⁠AI chatbot integration
•⁠  ⁠Voice-to-text functionality
•⁠  ⁠PWA with offline capabilities
•⁠  ⁠Video consultation system
•⁠  ⁠Advanced analytics dashboard
•⁠  ⁠Multi-channel notifications

### Revolutionary (Top-Tier) ✅
•⁠  ⁠Blockchain medical records
•⁠  ⁠Machine learning predictions
•⁠  ⁠Microservices architecture
•⁠  ⁠Advanced security compliance
•⁠  ⁠WebRTC telemedicine
•⁠  ⁠Smart contract integration

---

## 🚀 Deployment

### Docker Deployment (Recommended)
⁠ bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
 ⁠

### Manual Deployment
⁠ bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
 ⁠

### Cloud Platforms
•⁠  ⁠*Frontend*: Vercel, Netlify
•⁠  ⁠*Backend*: AWS EC2, DigitalOcean, Heroku
•⁠  ⁠*Database*: AWS RDS, PlanetScale
•⁠  ⁠*Blockchain*: Ethereum Testnet (Sepolia, Goerli)

---

## 📚 Learning Resources

### Week-by-Week Learning Path

*Weeks 1-2*: Next.js docs, Prisma tutorials, JWT authentication, MySQL design  
*Weeks 3-4*: Express.js best practices, RESTful API design, healthcare data modeling  
*Weeks 5-6*: React hooks, TailwindCSS, form validation, component architecture  
*Weeks 7-8*: Socket.io communication, Web Push API, PWA development, service workers  
*Weeks 9-10*: OpenAI API integration, Web Speech API, ML basics, healthcare AI  
*Weeks 11-12*: Blockchain smart contracts, WebRTC, Docker, production deployment  

---

## 🎤 Demo Strategy

### 5-Minute Demo Flow
1.⁠ ⁠*Problem Statement* (30s): Healthcare inefficiencies
2.⁠ ⁠*AI Chatbot Demo* (90s): Live medical queries with GPT-4
3.⁠ ⁠*Voice Prescription* (60s): Doctor dictation in action
4.⁠ ⁠*Video Consultation* (90s): WebRTC telemedicine showcase
5.⁠ ⁠*Security Features* (30s): Blockchain highlights

### Key Talking Points
•⁠  ⁠🎯 Microservices scalability
•⁠  ⁠🤖 AI integration with OpenAI GPT-4
•⁠  ⁠🔐 Blockchain security implementation
•⁠  ⁠📱 PWA offline healthcare access
•⁠  ⁠⚡ Real-time communication protocols
•⁠  ⁠🏥 Solving actual healthcare problems

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation:

1.⁠ ⁠Fork the repository
2.⁠ ⁠Create your feature branch (⁠ git checkout -b feature/AmazingFeature ⁠)
3.⁠ ⁠Commit your changes (⁠ git commit -m 'Add some AmazingFeature' ⁠)
4.⁠ ⁠Push to the branch (⁠ git push origin feature/AmazingFeature ⁠)
5.⁠ ⁠Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

*Aashish Jha*  
GitHub: [@Aashish-Jha-11](https://github.com/Aashish-Jha-11)

*Subham Sangwan*  
GitHub: [@Subham-KRLX](https://github.com/Subham-KRLX)

*Harikrushn*  
GitHub: [@Harikrushn9118](https://github.com/Harikrushn9118)

*Abhey Dua*  
GitHub: @[abhey8](https://github.com/abhey8)

---

## 🙏 Acknowledgments

•⁠  ⁠OpenAI for GPT-4 API
•⁠  ⁠Web3 Foundation for blockchain resources
•⁠  ⁠The amazing open-source community
•⁠  ⁠Healthcare professionals who provided domain insights

---

## 📞 Support

Having issues? Found a bug? Have suggestions?

•⁠  ⁠🐛 [Open an issue](https://github.com/Aashish-Jha-11/Hospital-OPD/issues)
•⁠  ⁠💬 [Start a discussion](https://github.com/Aashish-Jha-11/Hospital-OPD/)
•⁠  ⁠📧 Email: [your-email@example.com](mailto:your-email@example.com)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

*Built with ❤️ for the future of healthcare technology*

![Healthcare](https://img.shields.io/badge/Healthcare-Innovation-red)
![AI](https://img.shields.io/badge/AI-Powered-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Secured-purple)
![Modern](https://img.shields.io/badge/Tech-Cutting--Edge-blue)

</div>
