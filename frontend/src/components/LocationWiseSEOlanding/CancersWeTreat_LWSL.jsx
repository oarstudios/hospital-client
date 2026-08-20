import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCancers } from "../../redux/cancers/cancersSlice";
import imgSrc from "../Common/ImgSrc";
import { encryptId } from "../Common/Idcrypto";
import useLandingCenter, { centrePlaceName } from "./useLandingCenter";
import "./CancersWeTreat_LWSL.css";

import cwt1 from "../../assets/cwt1.png";
import cwt2 from "../../assets/cwt2.png";
import cwt3 from "../../assets/cwt3.png";
import cwt4 from "../../assets/cwt4.png";
import cwt5 from "../../assets/cwt5.png";
import cwt6 from "../../assets/cwt6.png";
import cwt7 from "../../assets/cwt7.png";
import cwt8 from "../../assets/cwt8.png";

const FALLBACK_ICONS = {
  "gastrointestinal-cancer": cwt1,
  "brain-cancer": cwt2,
  "lung-cancer": cwt8,
  "urological-cancer": cwt3,
  "blood-cancer": cwt6,
  "bone-soft-tissue-cancer": cwt7,
  "breast-cancer": cwt5,
  "gynecological-cancer": cwt4,
};

const CancersWeTreat_LWSL = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { center } = useLandingCenter();
  const { list: cancers = [] } = useSelector((s) => s.cancers || {});

  useEffect(() => {
    if (!cancers.length) dispatch(fetchCancers());
  }, [dispatch, cancers.length]);

  if (!center) return null;

  const place = centrePlaceName(center);

  return (
    <section className="cancers-ictc">
      <h2 className="cancers-title">Cancer Treatment at {place}</h2>

      <div className="cancers-grid">
        {cancers.map((cancer) => (
          <div
            key={cancer.id}
            className="cancer-card"
            onClick={() => navigate(`/cancer/${cancer.slug}/${encryptId(cancer.id)}`)}
          >
            <div className="cancer-icon">
              <img
                src={
                  cancer.coverImage
                    ? imgSrc(cancer.coverImage)
                    : FALLBACK_ICONS[cancer.slug] || cwt1
                }
                alt={cancer.altText || cancer.name}
              />
            </div>
            <div className="cancer-content">
              <h3>{cancer.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CancersWeTreat_LWSL;
