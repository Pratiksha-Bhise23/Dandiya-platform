// import React, { useState } from "react";
// import ModernBookingModal from "./components/ModernBookingModal";
// import ModernQRScanner from "./components/ModernQRScanner";

// function App() {
//   const [activeTab, setActiveTab] = useState("booking");

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation */}
//       <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">M</span>
//               </div>
//               <div>
//                 <h1 className="font-bold text-gray-800 text-lg">Malang Ras Dandiya</h1>
//                 <p className="text-xs text-gray-500">Event Management</p>
//               </div>
//             </div>

//             {/* Navigation Tabs */}
//             <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
//               <button
//                 onClick={() => setActiveTab("booking")}
//                 className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
//                   activeTab === "booking"
//                     ? "bg-white text-orange-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <span className="flex items-center gap-2">
//                   🎟️ Book Tickets
//                 </span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("scanner")}
//                 className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
//                   activeTab === "scanner"
//                     ? "bg-white text-blue-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <span className="flex items-center gap-2">
//                   📱 QR Scanner
//                 </span>
//               </button>
//             </div>

//             {/* Status Indicator */}
//             <div className="flex items-center space-x-2">
//               {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> */}
//               {/* <span className="text-sm text-gray-600">Live</span> */}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="relative">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/30 to-yellow-50/30"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(251,146,60,0.1),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        
//         {/* Content */}
//         <div className="relative">
//           {activeTab === "booking" ? <ModernBookingModal /> : <ModernQRScanner />}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t bg-white mt-12">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div>
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold">M</span>
//                 </div>
//                 <span className="font-bold text-gray-800">Malang Ras Dandiya 2025</span>
//               </div>
//               <p className="text-gray-600 text-sm">
//                 Chh.Sambhaji Nagar Biggest Navratri carnival with live Dandiya, Garba, music, and cultural celebrations.
//               </p>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-3">Event Details</h3>
//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <span>📅</span>
//                   <span>22-30 September 2025</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span>⏰</span>
//                   <span>5:00 PM onwards</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span>📍</span>
//                   <span>Chh. Sambhaji Nagar</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span>💰</span>
//                   <span>Starting from ₹200</span>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-3">Features</h3>
//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <span>🎵</span>
//                   <span>Live DJ & Dhol</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span>💃</span>
//                   <span>Dandiya & Garba</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span>🎁</span>
//                   <span>Exciting Prizes</span>
//                 </div>
//                 {/* <div className="flex items-center gap-2">
//                   <span>🍽️</span>
//                   <span>Food Court</span>
//                 </div> */}
//               </div>
//             </div>
//           </div>
          
//           <hr className="my-6" />
          
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-gray-500 text-sm">
//               © 2025 Malang Ras Dandiya. All rights reserved.
//             </p>
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               <span>Powered by Malang Ras Dandiya</span>
//               <span>•</span>
//               <span>Secure Payments</span>
//               <span>•</span>
//               <span>Digital Tickets</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;




import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ModernBookingModal from "./components/ModernBookingModal";
import ModernQRScanner from "./components/ModernQRScanner";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/30 to-yellow-50/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(251,146,60,0.1),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="relative">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/booking" element={<ModernBookingModal />} />
              <Route path="/scanner" element={<ModernQRScanner />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;