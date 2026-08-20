import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCenterById,
  clearSelectedCenter,
} from "../../redux/centers/centersSlice";
import { resolveUrlId } from "../Common/Idcrypto";
import SeoHead from "../Common/SeoHead";
import { getCenterSeo } from "../../seo/pageSeo";
import usePublicSeoEnv from "../../seo/usePublicSeoEnv";

import CenterBreadcrumb from "./CenterBreadcrumb/CenterBreadcrumb";
import OurCenterHero from "./OurCenterHero/OurCenterHero";
import CenterDescription from "./CenterAbout/CenterDescription";
import ExpertsAtICTC from "./ExpertsAtICTC/ExpertsAtICTC";
import CenterGallery from "./CenterGallery/CenterGallery";
import PatientTestimonials from "./PatientTestimonials/PatientTestimonials";
import BookAppointmentCenter from "./BookAppointmentCenter/BookAppointmentCenter";

import BookAppointment from "../Home/BookAppointment/BookAppointment";
import OurNetworkOfCare from "../Home/OurNetworkOfCare/OurNetworkOfCare";
import RequestCallback from "../Home/RequestCallback/RequestCallback";
import ServicesatICTC from "../Home/ServicesatICTC/ServicesatICTC";

const CenterDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const numericId = resolveUrlId(id);

  const { selected: center, loading, error } = useSelector(
    (state) => state.centers
  );
  const seoEnv = usePublicSeoEnv();

  useEffect(() => {
    if (numericId) {
      dispatch(fetchCenterById(numericId));
    }
    return () => {
      dispatch(clearSelectedCenter());
    };
  }, [dispatch, numericId]);

  if (loading) return <div style={{ padding: "80px", textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ padding: "80px", textAlign: "center" }}>Error: {error}</div>;
  if (!center) return null;

  return (
    <>
      <SeoHead {...getCenterSeo(center, seoEnv)} />
      <CenterBreadcrumb center={center} />
      <OurCenterHero center={center} />
      <CenterDescription center={center} />
      <ExpertsAtICTC center={center} />
      <ServicesatICTC />
      <PatientTestimonials />
      <BookAppointment />
      <CenterGallery center={center} />
      <OurNetworkOfCare />
      <RequestCallback />
    </>
  );
};

export default CenterDetailPage;