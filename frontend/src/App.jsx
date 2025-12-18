import Navbar from "./components/Navbar/Navbar";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import AboutImageSection from "./components/AboutImageSection/AboutImageSection";
import WhyChooseICTCImage from "./components/WhyChooseICTC/WhyChooseICTC";
import CancersWeTreat from "./components/CancersWeTreat/CancersWeTreat";
import MeetOurExperts from "./components/MeetOurExperts/MeetOurExperts";
import ServicesatICTC from "./components/ServicesatICTC/ServicesatICTC";
import NewsFromExperts from "./components/NewsFromExperts/NewsFromExperts";
import BookAppointment from "./components/BookAppointment/BookAppointment";
import OurNetworkOfCare from "./components/OurNetworkOfCare/OurNetworkOfCare";
import RequestCallback from "./components/RequestCallback/RequestCallback";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <AboutImageSection />
      <WhyChooseICTCImage/>
      <CancersWeTreat/>
      <MeetOurExperts/>
      <ServicesatICTC/>
      <NewsFromExperts/>
      <BookAppointment/>
      <OurNetworkOfCare/>
      <RequestCallback/>
      <Footer/>
    </>
  );
}

export default App;
