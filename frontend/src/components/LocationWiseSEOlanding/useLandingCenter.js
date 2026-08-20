import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCenters } from "../../redux/centers/centersSlice";

export function findCenterByLandingSlug(centers = [], slug) {
  if (!slug || !centers.length) return null;
  const s = String(slug).toLowerCase();
  return (
    centers.find((c) => c.slug?.toLowerCase() === s) ||
    centers.find((c) => c.slug?.toLowerCase().endsWith(`-${s}`)) ||
    centers.find((c) => c.slug?.toLowerCase().includes(s)) ||
    centers.find((c) => (c.name || "").toLowerCase().includes(s))
  );
}

export function centrePlaceName(center) {
  if (!center) return "";
  return String(center.name || "").replace(/^ICTC\s+/i, "") || center.area || "";
}

export default function useLandingCenter() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { list: centers = [], loading } = useSelector((s) => s.centers || {});

  useEffect(() => {
    if (!centers.length) dispatch(fetchCenters());
  }, [dispatch, centers.length]);

  return {
    center: findCenterByLandingSlug(centers, slug),
    loading,
    slug,
  };
}
