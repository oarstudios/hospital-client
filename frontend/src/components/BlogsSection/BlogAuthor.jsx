import { useEffect, useState } from "react";
import { fetchDoctorByIdApi } from "../../redux/doctors/doctorsApi";
import ExpertProfileRow from "../OurCenters/ExpertsAtICTC/ExpertProfileRow";
import "./BlogAuthor.css";

/**
 * "About the Author" for a blog/news post written by one of our doctors.
 * Posts by ICTC (no authorId), or whose doctor can't be loaded, show nothing.
 */
const BlogAuthor = ({ authorId }) => {
  // Keyed by id so a stale response never shows for a different post
  const [loaded, setLoaded] = useState({ id: null, doctor: null });

  useEffect(() => {
    if (!authorId) return undefined;
    let cancelled = false;

    fetchDoctorByIdApi(authorId)
      .then((res) => {
        const doctor = res?.data?.data ?? null;
        if (!cancelled) setLoaded({ id: authorId, doctor });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ id: authorId, doctor: null });
      });

    return () => {
      cancelled = true;
    };
  }, [authorId]);

  const doctor = authorId && loaded.id === authorId ? loaded.doctor : null;
  if (!doctor || doctor.isDeleted) return null;

  return (
    <section className="experts-section-dark blog-author-section" aria-labelledby="blog-author-heading">
      <h2 id="blog-author-heading" className="experts-heading">About the Author</h2>
      <ExpertProfileRow doctor={doctor} />
    </section>
  );
};

export default BlogAuthor;
