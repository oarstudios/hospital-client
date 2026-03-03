import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

/* ================= COMMON COMPONENTS ================= */
import Navbar from "./components/Home/Navbar/Navbar";
import Footer from "./components/Home/Footer/Footer";
import ScrollToTop from "./components/Common/ScrollToTop";
import NotFound from "./components/Common/NotFound";
import WhatsAppFloat from "./components/WhatsAppFloat/WhatsAppFloat";
import Chatbot from "./components/Chatbot/Chatbot";

/* ================= HOME ================= */
import HeroCarousel from "./components/Home/HeroCarousel/HeroCarousel";
import AboutImageSection from "./components/Home/AboutImageSection/AboutImageSection";
import WhyChooseICTCImage from "./components/Home/WhyChooseICTC/WhyChooseICTC";
import CancersWeTreat from "./components/Home/CancersWeTreat/CancersWeTreat";
import MeetOurExperts from "./components/Home/MeetOurExperts/MeetOurExperts";
import ServicesatICTC from "./components/Home/ServicesatICTC/ServicesatICTC";
import NewsFromExperts from "./components/Home/NewsFromExperts/NewsFromExperts";
import BookAppointment from "./components/Home/BookAppointment/BookAppointment";
import RequestCallback from "./components/Home/RequestCallback/RequestCallback";
import OurNetworkOfCare from "./components/Home/OurNetworkOfCare/OurNetworkOfCare";

/* ================= CENTERS ================= */
import CenterBreadcrumb from "./components/OurCenters/CenterBreadcrumb/CenterBreadcrumb";
import OurCenterHero from "./components/OurCenters/OurCenterHero/OurCenterHero";
import CenterDescription from "./components/OurCenters/CenterAbout/CenterDescription";
import ExpertsAtICTC from "./components/OurCenters/ExpertsAtICTC/ExpertsAtICTC";
import CenterGallery from "./components/OurCenters/CenterGallery/CenterGallery";
import PatientTestimonials from "./components/OurCenters/PatientTestimonials/PatientTestimonials";
import AllCentres from "./components/AllCentres/AllCentres";
import AllCentersBreadcrumb from "./components/AllCentres/AllCentersBreadcrumb";

/* ================= DOCTORS ================= */
import DoctorProfile from "./components/DoctorProfiles/DoctorProfile/DoctorProfile";
import DoctorBreadcrumb from "./components/DoctorProfiles/DoctorBreadcrumb/DoctorBreadcrumb";
import PatientStoriesEmbed from "./components/DoctorProfiles/PatientStoriesEmbed/PatientStoriesEmbed";
import OurDoctorTeam from "./components/OurDoctorTeam/OurDoctorTeam";
import AllDoctorsBreadcrumb from "./components/OurDoctorTeam/AllDoctorsBreadcrumb";

/* ================= BLOG ================= */
import BlogsSection from "./components/BlogsSection/BlogsSection";
import BlogBreadcrumb from "./components/BlogsSection/BlogBreadcrumb";
import BlogPost from "./components/BlogsSection/BlogPost";
import BlogPostBreadcrumb from "./components/BlogsSection/BlogPostBreadcrumb";

/* ================= CANCER ================= */
import CancerDetails from "./components/CancerDetails/CancerDetails";
import CancerDetBreadcrumb from "./components/CancerDetails/CancerDetBreadcrumb";
import AllCancerTypePage from "./components/CancerDetails/AllCancerTypePage";
import AllCancerDetBreadcrumb from "./components/CancerDetails/AllCancerDetBreadcrumb";

/* ================= SERVICES ================= */
import ServicePage from "./components/ServicePage/ServicePage";
import AllServicePage from "./components/ServicePage/AllServicePage";
import ServiceBreadcrumb from "./components/ServicePage/ServiceBreadcrumb";
import AllServiceBreadcrumb from "./components/ServicePage/AllServiceBreadcrumb";

/* ================= OTHER ================= */
import AboutUs from "./components/AboutUs/AboutUs";
import AboutUsBreadcrumb from "./components/AboutUs/AboutUsBreadcrumb";
import BookAppoinmentFull from "./components/BookAppoinmentSecond/BookAppoinmentFull";
import BookSecondOp from "./components/BookAppoinmentSecond/BookSecondOp";
import BookAppoinmentBreadcrumb from "./components/BookAppoinmentSecond/BookAppoinmentBreadcrumb";
import BookSecondAppoinmentBreadcrumb from "./components/BookAppoinmentSecond/BookSecondAppoinmentBreadcrumb";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";

/* ================= ADMIN ================= */
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/auth/AdminLogin";
import ProtectedRoute from "./admin/auth/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/ctrl");

  return (
    <>
      {/* Hide Navbar in Admin */}
      {!isAdminRoute && <Navbar />}

      <ScrollToTop />

      <main className="app-layout">
        <Routes>

          {/* ================= WEBSITE ROUTES ================= */}

          {/* HOME */}
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

          {/* CENTRE DETAILS */}
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
                <BookAppointment />
                <CenterGallery />
                <OurNetworkOfCare />
                <RequestCallback />
              </>
            }
          />

          {/* ALL CENTERS */}
          <Route
            path="/allCenters"
            element={
              <>
                <AllCentersBreadcrumb />
                <AllCentres />
                <OurNetworkOfCare />
                <RequestCallback />
              </>
            }
          />

          {/* DOCTOR PROFILE */}
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

          {/* ALL DOCTORS */}
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

          {/* BLOG LIST */}
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

          {/* BLOG DETAILS */}
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

          {/* CANCER DETAILS */}
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

          {/* ALL CANCERS */}
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

          {/* SERVICE DETAILS */}
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

          {/* ALL SERVICES */}
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

          {/* ABOUT */}
          <Route
            path="/aboutUs"
            element={
              <>
                <AboutUsBreadcrumb />
                <AboutUs />
                <OurNetworkOfCare />
                <RequestCallback />
              </>
            }
          />

          {/* BOOK APPOINTMENT */}
          <Route
            path="/BookAppoinment"
            element={
              <>
                <BookAppoinmentBreadcrumb />
                <BookAppoinmentFull />
                <OurNetworkOfCare />
                <RequestCallback />
              </>
            }
          />

          {/* SECOND OPINION */}
          <Route
            path="/BookSecondOpinion"
            element={
              <>
                <BookSecondAppoinmentBreadcrumb />
                <BookSecondOp />
                <OurNetworkOfCare />
                <RequestCallback />
              </>
            }
          />

          {/* PRIVACY POLICY */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* ================= ADMIN ROUTES ================= */}

          <Route path="/ctrl/login" element={<AdminLogin />} />

          <Route
            path="/ctrl/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      {/* Hide Website Extras in Admin */}
      {!isAdminRoute && <WhatsAppFloat />}
      {!isAdminRoute && <Chatbot />}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;