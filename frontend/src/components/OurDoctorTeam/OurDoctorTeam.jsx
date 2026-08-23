// import "./OurDoctorTeam.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDoctors } from "../../redux/doctors/doctorsSlice";
// import imgSrc from "../Common/ImgSrc";
// import arrowIcon from "../../assets/cuida_dropdown-outline.png";

// const faqs = [
//   {
//     question: "Can chemotherapy be used to treat cancer?",
//     answer:
//       "Most patients don't feel any pain while receiving treatment, especially if they're taking tablets or using cream topically.",
//   },
//   {
//     question: "Does receiving chemotherapy hurt?",
//     answer:
//       "Chemotherapy itself does not usually cause pain. Some discomfort may occur due to IV insertion or side effects.",
//   },
//   {
//     question: "What stage of cancer receives chemotherapy treatment?",
//     answer:
//       "Chemotherapy can be used in early, advanced, or metastatic stages depending on treatment goals.",
//   },
// ];

// const OurDoctorTeam = () => {
//   const [activeIndex, setActiveIndex] = useState(2);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { list: doctors } = useSelector((state) => state.doctors);

//   useEffect(() => {
//     dispatch(fetchDoctors());
//   }, [dispatch]);

//   const goToDoctorProfile = (slug) => {
//     navigate(`/doctor/${slug}`);
//   };

//   return (
//     <section className="our-doctor-team">
//       <h2 className="our-doctor-team-title">Our Doctor Team</h2>

//       {/* DOCTOR GRID */}
//       <div className="our-doctor-team-grid">
//         {doctors.map((doc) => (
//           <div
//             className="doctor-card-home"
//             key={doc.id}
//             role="button"
//             tabIndex={0}
//             onClick={() => goToDoctorProfile(doc.slug)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") goToDoctorProfile(doc.slug);
//             }}
//           >
//             {/* IMAGE + HOVER */}
//             <div className="doctor-img-wrapper">
//               <img src={imgSrc(doc.image)} alt={doc.name} />

//               <div className="doctor-hover">
//                 <button
//                   className="view-profile-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     goToDoctorProfile(doc.slug);
//                   }}
//                 >
//                   View Complete Profile <span>→</span>
//                 </button>
//               </div>
//             </div>

//             {/* CONTENT */}
//             <div className="doctor-content">
//               <h3>{doc.name}</h3>
//               <p className="doctor-qualification">
//                 {(doc.qualification || "").split(",").map((item, index) => (
//                   <span key={index}>
//                     {item.trim()}
//                     <br />
//                   </span>
//                 ))}
//               </p>
//             </div>

//             {/* TAG */}
//             <div className="doctor-tag">{doc.designation}</div>
//           </div>
//         ))}
//       </div>

//       {/* FAQ SECTION */}
//       <div className="ictc-service-faq">
//         <h2>FAQ's</h2>

//         {faqs.map((faq, index) => {
//           const isActive = activeIndex === index;

//           return (
//             <div
//               key={index}
//               className={`ictc-faq-item ${isActive ? "ictc-faq-active" : ""}`}
//               onClick={() => setActiveIndex(isActive ? -1 : index)}
//             >
//               <div className="ictc-faq-question">
//                 <span>{faq.question}</span>
//                 <img
//                   src={arrowIcon}
//                   className={isActive ? "rotate" : ""}
//                   alt="toggle"
//                 />
//               </div>

//               {isActive && (
//                 <div className="ictc-faq-answer">{faq.answer}</div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default OurDoctorTeam;



import "./OurDoctorTeam.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../redux/doctors/doctorsSlice";
import imgSrc from "../Common/ImgSrc";
import { encryptId } from "../Common/Idcrypto";
import { doctorAlt } from "../../seo/pageSeo";
import SeoHead from "../Common/SeoHead";
import { getAllDoctorsSeo } from "../../seo/pageSeo";
import usePublicSeoEnv from "../../seo/usePublicSeoEnv";

const OurDoctorTeam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  //get the current route path to determine if we are on the doctor profile page or not
  const currentPath = window.location.pathname;
  const isAboutUsPage = currentPath.startsWith("/aboutUs");

  const { list: doctors } = useSelector((state) => state.doctors);
  const { siteUrl } = usePublicSeoEnv();

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const goToDoctorProfile = (doc) => {
    navigate(`/doctor/${doc.slug}/${encryptId(doc.id)}`);
  };

  return (
    <section className="our-doctor-team">
      {!isAboutUsPage && <SeoHead {...getAllDoctorsSeo({ siteUrl })} />}
      <h2 className="our-doctor-team-title">Our Doctor Team</h2>

      {/* DOCTOR GRID */}
      <div className="our-doctor-team-grid">
        {doctors.map((doc) => (
          <div
            className="doctor-card-home"
            key={doc.id}
            role="button"
            tabIndex={0}
            onClick={() => goToDoctorProfile(doc)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToDoctorProfile(doc);
            }}
          >
            {/* IMAGE + HOVER */}
            <div className="doctor-img-wrapper">
              <img src={imgSrc(doc.image)} alt={doctorAlt(doc)} />

              <div className="doctor-hover">
                <button
                  className="view-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDoctorProfile(doc);
                  }}
                >
                  View Complete Profile <span>→</span>
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="doctor-content">
              <h3>{doc.name}</h3>
              <p className="doctor-qualification">
                {(doc.qualification || "").split(",").map((item, index) => (
                  <span key={index}>
                    {item.trim()}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            {/* TAG */}
            <div className="doctor-tag">{doc.designation}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurDoctorTeam;