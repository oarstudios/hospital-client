import { Routes, Route } from "react-router-dom";
import "./index.css";

/* COMMON */
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


import Chatbot from "./components/Chatbot/Chatbot"

function App() {
  return (
    <>
      <Navbar />

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

        {/* OUR CENTERS PAGE */}
        <Route
          path="/ourCenters"
          element={
            <>
              <CenterBreadcrumb centerName="ICTC Vashi" />
              <OurCenterHero />
              <CenterDescription />
              <ExpertsAtICTC />
              <ServicesatICTC />
              <PatientTestimonials />
              <BookAppointmentCenter centerName="Vashi" />
              <CenterGallery center="vashi" />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/doctor"
          element={
            <>
              <DoctorBreadcrumb docName="Dr Rohit Pai" />
              <DoctorProfile />
              <PatientTestimonials />
              <PatientStoriesEmbed />
              <RecentHighlights />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/blog"
          element={
            <>
              <BlogBreadcrumb blogNewsName="Blogs and News" />
              <BlogsSection />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/blogpost"
          element={
            <>
              <BlogPostBreadcrumb blogPostName="Parenting With Cancer: What Do We Tell the Kids?" />
              <BlogPost />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/allCenters"
          element={
            <>
              <AllCentersBreadcrumb centerName="All Centres" />
              <AllCentres />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/cancerDetails"
          element={
            <>
              <CancerDetBreadcrumb cancerName="Breast Cancer" />
              <CancerDetails />
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/servicePage"
          element={
            <>
              <ServicePage/>
              <ServicesatICTC/>
              <BookAppointment/>
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/ourDoctors"
          element={
            <>
              <OurDoctorTeam/>
              <BookAppointment/>
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />

        <Route
          path="/aboutUs"
          element={
            <>
           <AboutUs/>
              <OurNetworkOfCare />
              <RequestCallback />
            </>
          }
        />
      </Routes>

          <Chatbot/>
      <Footer />
    </>
  );
}

export default App;
