import { Routes, Route } from "react-router-dom";
import "./index.css";

/* COMMON Comp*/
import Navbar from "./components/Home/Navbar/Navbar";
import Footer from "./components/Home/Footer/Footer";

/* HOME */
import HeroCarousel from "./components/Home/HeroCarousel/HeroCarousel";
import AboutImageSection from "./components/Home/AboutImageSection/AboutImageSection";
import WhyChooseICTCImage from "./components/Home/WhyChooseICTC/WhyChooseICTC";
import CancersWeTreat from "./components/Home/CancersWeTreat/CancersWeTreat";
import MeetOurExperts from "./components/Home/MeetOurExperts/MeetOurExperts";
import ServicesatICTC from "./components/Home/ServicesatICTC/ServicesatICTC";
import NewsFromExperts from "./components/Home/NewsFromExperts/NewsFromExperts";
import BookAppointment from "./components/Home/BookAppointment/BookAppointment";
import RequestCallback from "./components/Home/RequestCallback/RequestCallback";

/* OUR CENTERS */
import CenterBreadcrumb from "./components/OurCenters/CenterBreadcrumb/CenterBreadcrumb";
import OurCenterHero from "./components/OurCenters/OurCenterHero/OurCenterHero";
import CenterDescription from "./components/OurCenters/CenterAbout/CenterDescription";
import ExpertsAtICTC from "./components/OurCenters/ExpertsAtICTC/ExpertsAtICTC";
import OurNetworkOfCare from "./components/Home/OurNetworkOfCare/OurNetworkOfCare";
import BookAppointmentCenter from "./components/OurCenters/BookAppointmentCenter/BookAppointmentCenter";
import CenterGallery from "./components/OurCenters/CenterGallery/CenterGallery";
import PatientTestimonials from "./components/OurCenters/PatientTestimonials/PatientTestimonials";

/* DOCTOR PROFILE */
import DoctorProfile from "./components/DoctorProfiles/DoctorProfile/DoctorProfile";
import DoctorBreadcrumb from "./components/DoctorProfiles/DoctorBreadcrumb/DoctorBreadcrumb";
import RecentHighlights from "./components/DoctorProfiles/RecentHighlights/RecentHighlights";
import PatientStoriesEmbed from "./components/DoctorProfiles/PatientStoriesEmbed/PatientStoriesEmbed";
import BlogsSection from "./components/BlogsSection/BlogsSection";
import BlogBreadcrumb from "./components/BlogsSection/BlogBreadcrumb";
import BlogPost from "./components/BlogsSection/BlogPost";
import BlogPostBreadcrumb from "./components/BlogsSection/BlogPostBreadcrumb";
import AllCentres from "./components/AllCentres/AllCentres";
import CancerDetails from "./components/CancerDetails/CancerDetails";
import AllCentersBreadcrumb from "./components/AllCentres/AllCentersBreadcrumb";
import CancerDetBreadcrumb from "./components/CancerDetails/CancerDetBreadcrumb";
import ServicePage from "./components/ServicePage/ServicePage";
import OurDoctorTeam from "./components/OurDoctorTeam/OurDoctorTeam";
import AboutUs from "./components/AboutUs/AboutUs";

import Chatbot from "./components/Chatbot/Chatbot";
import BookAppoinmentFull from "./components/BookAppoinmentSecond/BookAppoinmentFull";
import BookSecondOp from "./components/BookAppoinmentSecond/BookSecondOp";
import AllCancerTypePage from "./components/CancerDetails/AllCancerTypePage";
import AllServicePage from "./components/ServicePage/AllServicePage";

import ServiceBreadcrumb from "./components/ServicePage/ServiceBreadcrumb";
import AllDoctorsBreadcrumb from "./components/OurDoctorTeam/AllDoctorsBreadcrumb";
import AboutUsBreadcrumb from "./components/AboutUs/AboutUsBreadcrumb";
import BookAppoinmentBreadcrumb from "./components/BookAppoinmentSecond/BookAppoinmentBreadcrumb";
import BookSecondAppoinmentBreadcrumb from "./components/BookAppoinmentSecond/BookSecondAppoinmentBreadcrumb";
import AllCancerDetBreadcrumb from "./components/CancerDetails/AllCancerDetBreadcrumb";
import AllServiceBreadcrumb from "./components/ServicePage/AllServiceBreadcrumb";
import ScrollToTop from "./components/Common/ScrollToTop";
import NotFound from "./components/Common/NotFound";

function App() {
  return (
    <>
      <Navbar />

      <ScrollToTop/>
  <main className="app-layout">
      <Routes>
        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <HeroCarousel />
              <AboutImageSection />
              <WhyChooseICTCImage />
              <CancersWeTreat />
              <MeetOurExperts />
              <ServicesatICTC />
              <NewsFromExperts />
              <BookAppointment />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/centre/:slug"
          element={
            <>
              <CenterBreadcrumb />
              <OurCenterHero />
              <CenterDescription />
              <ExpertsAtICTC />
              <ServicesatICTC />
              <PatientTestimonials />
              <BookAppointment/>
              <CenterGallery />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/allCenters"
          element={
            <>
              <AllCentersBreadcrumb  />
              <AllCentres />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/doctor/:slug"
          element={
            <>
              <DoctorBreadcrumb />
              <DoctorProfile />
              <PatientTestimonials />
              <PatientStoriesEmbed />
           
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/ourDoctors"
          element={
            <>
              <AllDoctorsBreadcrumb />
              <OurDoctorTeam />
              <BookAppointment />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/blog"
          element={
            <>
              <BlogBreadcrumb />
              <BlogsSection />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/blog/:slug"
          element={
            <>
              <BlogPostBreadcrumb />
              <BlogPost />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/cancer/:slug"
          element={
            <>
              <CancerDetBreadcrumb />
              <CancerDetails />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/AllCancer"
          element={
            <>
              <AllCancerDetBreadcrumb />
              <AllCancerTypePage />
              <BookAppointment />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/service/:slug"
          element={
            <>
              <ServiceBreadcrumb />
              <ServicePage />
              <ServicesatICTC />
              <BookAppointment />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/AllService"
          element={
            <>
              <AllServiceBreadcrumb />
              <AllServicePage />
              <BookAppointment />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/aboutUs"
          element={
            <>
              <AboutUsBreadcrumb  />
              <AboutUs />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/BookAppoinment"
          element={
            <>
              <BookAppoinmentBreadcrumb  />
              <BookAppoinmentFull />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/BookSecondOpinion"
          element={
            <>
              <BookSecondAppoinmentBreadcrumb  />
              <BookSecondOp />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route path="*" element={<NotFound/>} />
      </Routes>
</main>
      <Chatbot />
      <Footer />
    </>
  );
}

export default App;
