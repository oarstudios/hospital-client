import MobileQuickCTA from "../MobileQuickCTA/MobileQuickCTA";
import useMobileFloatStackBottom from "../Common/useMobileFloatStackBottom";
import "./MobileFloatStack.css";

const MobileFloatStack = () => {
  useMobileFloatStackBottom(8);

  return (
    <div className="mobile-float-stack" aria-hidden={false}>
      <MobileQuickCTA floating />
    </div>
  );
};

export default MobileFloatStack;
