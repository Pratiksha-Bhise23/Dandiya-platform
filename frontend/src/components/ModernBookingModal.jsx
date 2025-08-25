
import React, { useState } from "react";
import logo11 from "../assets/logo11.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ModernBookingModal = () => {
  // Removed isOpen state, always show booking form
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  const [ticketData, setTicketData] = useState({
    booking_date: "",
    pass_type: "couple",
    num_tickets: 1,
  });
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendURL = "http://localhost:5000";

  const handleTicketSubmit = async () => {
    if (!ticketData.booking_date || !ticketData.num_tickets) {
      alert("Please select date and number of tickets");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/booking`, {
        booking_date: ticketData.booking_date,
        num_tickets: ticketData.num_tickets,
        pass_type: ticketData.pass_type, // include pass_type here
      });
      if (res.data.success) {
        setBookingId(res.data.booking.id);
        setStep(2);
      } else {
        alert("Failed to create booking");
      }
    } catch (err) {
      console.error(err);
      alert("API error: couldn't create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async () => {
    if (!userData.name || !userData.email || !userData.phone) {
      alert("Please fill all user details");
      return;
    }
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else if (!userData.email.endsWith("@gmail.com")) {
      setEmailError("Only @gmail.com email addresses are allowed");
      return;
    } else {
      setEmailError("");
    }
    if (!/^\d{10}$/.test(userData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    } else {
      setPhoneError("");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/user`, {
        booking_id: bookingId,
        ...userData,
      });
      if (res.data.success) {
        setStep(3);
      } else {
        alert("Failed to add user details");
      }
    } catch (err) {
      console.error(err);
      alert("API error: couldn't add user details");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const ok = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!ok) return alert("Failed to load Razorpay SDK");

    setLoading(true);
    try {
      const amount = ticketData.pass_type === "couple" ? ticketData.num_tickets * 400 : ticketData.num_tickets * 200;
      const orderRes = await axios.post(`${backendURL}/api/payment`, {
        booking_id: bookingId,
        amount,
      });
      const { order } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        // name: <span style='background: linear-gradient(90deg, #e11d48, #f59e42); -webkit-background-clip: text; color: transparent; font-weight: bold;'>Malang Ras Dandiya 2025</span>,
        name:"Malang Ras Dandiya 2025",
        description: `Booking for ${ticketData.num_tickets} ${ticketData.pass_type} ticket(s)`,
        image: window.location.origin + '/assets/logo11.png',
        prefill: { name: userData.name, email: userData.email, contact: userData.phone },
        handler: async function (response) {
          try {
            const confirmRes = await axios.post(`${backendURL}/api/payment/confirm`, {
              booking_id: bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (confirmRes.data.success) {
              setStep(4);
            } else {
              alert("Payment confirmed but failed at backend");
            }
          } catch (err) {
            console.error(err);
            alert("Error confirming payment");
          }
        },
        theme: { color: "#e11d48" }, // Use your brand's main color (pinkish-red from logo)
        // Note: Razorpay does not support gradient, so use the main color from your logo
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating payment order");
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setBookingId(null);
    setTicketData({ booking_date: "", pass_type: "couple", num_tickets: 1 });
    setUserData({ name: "", email: "", phone: "" });
    setIsOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* <div className="rounded-2xl shadow-xl w-full p-6 overflow-y-auto"> */}
        <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-center text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Book Your Dandiya Pass</h2> */}
        </div>

        {/* Book your ticket */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-auto">
              <h3 className="text-center text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Book Your Ticket</h3>
              <div className="space-y-5 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Event Date</label>
                  <input
                    type="date"
                    value={ticketData.booking_date}
                    onChange={(e) => setTicketData({ ...ticketData, booking_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Pass Type</label>
                  <select
                    value={ticketData.pass_type}
                    onChange={(e) => setTicketData({ ...ticketData, pass_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  >
                    <option value="couple">Couple Pass (₹400)</option>
                    <option value="group">Group of Girls (₹200)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Number of Tickets</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTicketData({ ...ticketData, num_tickets: Math.max(1, ticketData.num_tickets - 1) })}
                      className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-xl">{ticketData.num_tickets}</span>
                    <button
                      onClick={() => setTicketData({ ...ticketData, num_tickets: ticketData.num_tickets + 1 })}
                      className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleTicketSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-2 rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-orange-500 transition duration-300"
                >
                  {loading ? "Processing..." : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* personal details */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-auto">
              <h3 className="text-center text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Personal Details</h3>
               {/* <h3 className="text-lg text-center  font-bold mb-2 text-gray-800">Personal Details</h3> */}
              <div className="space-y-5 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={e => {
                      setUserData({ ...userData, email: e.target.value });
                      setEmailError("");
                    }}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none ${emailError ? 'border-red-500' : ''}`}
                  />
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={userData.phone}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setUserData({ ...userData, phone: val });
                      if (val.length === 10) {
                        setPhoneError("");
                      }
                    }}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none ${phoneError ? 'border-red-500' : ''}`}
                  />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg bg-white hover:bg-gray-100 font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={handleUserSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white py-2 rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-orange-500 transition duration-300"
                >
                  {loading ? "Processing..." : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-auto">
             
              <h3 className="text-lg text-center  font-bold mb-2 text-gray-800">Order Summary</h3>
              <div className="bg-blue-50 rounded-xl p-5 mb-4">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="text-gray-600 font-medium">Event:</div>
                  <div className="text-right font-semibold text-gray-800">Malang Ras Dandiya 2025</div>
                  <div className="text-gray-600 font-medium">Date:</div>
                  <div className="text-right font-semibold text-gray-800">{ticketData.booking_date}</div>
                  <div className="text-gray-600 font-medium">Pass Type:</div>
                  <div className="text-right font-semibold text-gray-800">{ticketData.pass_type === 'couple' ? 'Couple Pass' : 'Group of Girls'}</div>
                  <div className="text-gray-600 font-medium">Tickets:</div>
                  <div className="text-right font-semibold text-gray-800">{ticketData.num_tickets}</div>
                  <div className="text-gray-600 font-medium">Price per ticket:</div>
                  <div className="text-right font-semibold text-gray-800">₹{ticketData.pass_type === 'couple' ? 400 : 200}</div>
                  <div className="col-span-2 border-t border-gray-200 my-2"></div>
                  <div className="text-lg font-bold text-gray-700">Total:</div>
                  <div className="text-lg font-extrabold text-right text-gray-900">₹{(ticketData.pass_type === 'couple' ? 400 : 200) * ticketData.num_tickets}</div>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="font-semibold text-gray-700 mb-1">Contact Details:</h5>
                <div className="text-sm text-gray-700">
                  <div>{userData.name}</div>
                  <div>{userData.phone}</div>
                  <div>{userData.email}</div>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg bg-white hover:bg-gray-100 font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white py-2 rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-orange-500 transition duration-300"
                >
                  {loading ? "Processing..." : `Pay Now`}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* booking confirmation */}
          {/* {step === 4 && (
<div className="text-center space-y-6">
<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
<span className="text-3xl">✅</span>
</div>
<h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
<p className="text-gray-600">Your tickets have been sent to your email.</p>
<button onClick={resetBooking} className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition duration-300" >
Book Again
</button>
</div>
)} */}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2.5 2.5L16 9"/></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-green-600 mb-1 flex items-center gap-2">Booking Confirmed! <span>🎉</span></h2>
              <p className="text-green-700 text-lg mb-2">Your tickets have been sent to your email!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {/* Booking Details */}
              <div className="bg-white rounded-xl shadow p-5 flex-1 min-w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg text-gray-800">Booking Details</span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">Confirmed</span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div><span className="font-medium">Booking ID:</span> <span className="font-mono">NF{bookingId || 'XXXX'}</span></div>
                  <div><span className="font-medium">Payment Status:</span> <span className="text-green-600 font-semibold">Paid</span></div>
                  <div><span className="font-medium">Total Amount:</span> <span className="text-pink-600 font-bold text-lg">₹{(ticketData.pass_type === 'couple' ? 400 : 200) * ticketData.num_tickets}</span></div>
                </div>
              </div>
              {/* Your Tickets */}
              <div className="bg-white rounded-xl shadow p-5 flex-1 min-w-[280px]">
                <span className="font-bold text-lg text-gray-800 block mb-2">Your Tickets</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-pink-50 rounded px-3 py-2">
                    <span className="font-medium text-gray-700">{ticketData.pass_type === 'couple' ? 'Couple Pass' : 'Group of Girls'}</span>
                    <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-1 rounded">₹{ticketData.pass_type === 'couple' ? 400 : 200} each</span>
                  </div>
                  <div className="flex items-center justify-between bg-pink-50 rounded px-3 py-2">
                    <span className="font-medium text-gray-700">Tickets</span>
                    <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-1 rounded">{ticketData.num_tickets}</span>
                  </div>
                </div>
              </div>
              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow p-5 flex-1 min-w-[280px]">
                <span className="font-bold text-lg text-gray-800 block mb-2">Customer Information</span>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex items-center gap-2"><span className="bg-pink-100 text-pink-600 rounded-full px-2 py-1 font-bold">P</span> {userData.name}</div>
                  <div className="flex items-center gap-2"><span className="material-icons text-base text-gray-400">email</span> {userData.email}</div>
                  <div className="flex items-center gap-2"><span className="material-icons text-base text-gray-400">phone</span> {userData.phone}</div>
                </div>
              </div>
              {/* Event Info */}
              <div className="bg-white rounded-xl shadow p-5 flex-1 min-w-[280px]">
                <span className="font-bold text-lg text-gray-800 block mb-2">Event Information</span>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex items-center gap-2"><span className="material-icons text-purple-400">event</span> 4 August 2025</div>
                  <div className="flex items-center gap-2"><span className="material-icons text-orange-400">schedule</span> 7:00 PM onwards</div>
                  <div className="flex items-center gap-2"><span className="material-icons text-green-400">location_on</span> Mumbai, Maharashtra</div>
                </div>
              </div>
            </div>
            {/* Next Steps */}
            <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
                <span className="font-bold text-lg text-gray-800 block mb-2">Next Steps</span>
                <button className="w-full max-w-xs bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-2 rounded-lg mb-3 shadow hover:from-pink-600 hover:to-orange-500 transition">Download E-Ticket</button>
                <div className="flex gap-2 w-full max-w-xs">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold">Share</button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold">Home</button>
                </div>
              </div> */}
              <div className="bg-blue-50 rounded-xl shadow p-5">
                <span className="font-bold text-lg text-blue-700 block mb-2">Important Reminders</span>
                <ul className="list-disc pl-5 text-sm text-blue-900 space-y-1">
                  <li>Carry a valid photo ID and this e-ticket to the venue</li>
                  <li>Gates open at 4:30 PM on event day</li>
                  <li>Traditional attire is encouraged for the best experience</li>
                  <li>Check your email for detailed event information</li>
                </ul>
              </div>
            </div>
            <button onClick={resetBooking} className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition duration-300" >
Book Again
</button>
          </div>
        )}



      {/* </div> */}
    </div>
  );
};

export default ModernBookingModal;