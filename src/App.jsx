import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingView from './views/LandingView';
import TripBuilderView from './views/TripBuilderView';
import ProcessingView from './views/ProcessingView';
import DashboardView from './views/DashboardView';
import HotelDetailsView from './views/HotelDetailsView';
import PaymentView from './views/PaymentView';
import ConfirmationView from './views/ConfirmationView';
import MyTripView from './views/MyTripView';
import LiveTripView from './views/LiveTripView';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [tripParams, setTripParams] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleStartPlanning = () => {
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuildTrip = (params) => {
    setTripParams(params);
    setCurrentView('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentView('hotel-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (booking) => {
    setBookingDetails(booking);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F9FAFB] font-sans antialiased flex flex-col">
      {/* Sleek Top Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Full-Width Viewport */}
      <main className={`flex-1 w-full ${currentView === 'landing' ? 'pt-36' : 'pt-24'}`}>
          {currentView === 'landing' && (
            <LandingView onStartPlanning={handleStartPlanning} />
          )}

          {currentView === 'builder' && (
            <TripBuilderView onBuildTrip={handleBuildTrip} />
          )}

          {currentView === 'processing' && (
            <ProcessingView
              tripParams={tripParams}
              onComplete={handleProcessingComplete}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              tripParams={tripParams}
              onSelectHotel={handleSelectHotel}
            />
          )}

          {currentView === 'hotel-details' && (
            <HotelDetailsView
              hotel={selectedHotel}
              onProceedToPayment={handleProceedToPayment}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'payment' && (
            <PaymentView
              bookingData={selectedHotel}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setCurrentView('hotel-details')}
            />
          )}

          {currentView === 'confirmation' && (
            <ConfirmationView
              bookingDetails={bookingDetails}
              onViewMyTrip={() => setCurrentView('my-trips')}
            />
          )}

          {currentView === 'my-trips' && (
            <MyTripView onStartLiveMode={() => setCurrentView('live-trip')} />
          )}

          {currentView === 'live-trip' && (
            <LiveTripView onExitLive={() => setCurrentView('my-trips')} />
          )}
        </main>
    </div>
  );
}
