import CancersWeTreat from "../Home/CancersWeTreat/CancersWeTreat";
import SeoHead from "../Common/SeoHead";
import { getAllCancersSeo } from "../../seo/pageSeo";
import usePublicSeoEnv from "../../seo/usePublicSeoEnv";

function AllCancerTypePage() {
  const { siteUrl } = usePublicSeoEnv();

  return (
    <>
      <SeoHead {...getAllCancersSeo({ siteUrl })} />
      <CancersWeTreat />
    </>
  );
}

export default AllCancerTypePage;
