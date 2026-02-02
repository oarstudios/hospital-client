import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

/* ASSETS */
import chatIcon from "../../assets/ChatButton.png";
import backIcon from "../../assets/BackArrow.png";
import sendIcon from "../../assets/Send Message icon.svg";
import DefaultArrow from "../../assets/DefaultArrow.png";
import VariantArrow from "../../assets/VariantArrow.png";
import WhatsappIcon from "../../assets/whatsapp-icon.png";
import Logo from "../../assets/ICTC_Logo(long).png";
import DownChatbot from "../../assets/DownChatbot.png";
import UpFAQ from "../../assets/upfaq.png";
import DownFAQ from "../../assets/dowfaq.png";
import Close from "../../assets/CloseIcon.png";

/* ============================
   AREA → CENTER MAP
============================ */
const areacenterMap = {
  Mumbai: ["Sion", "Dadar", "Ghatkopar", "Goregaon", "Chembur", "Santacruz"],
  "Navi Mumbai": ["Vashi", "Panvel"],
  Thane: ["Kalyan", "Dombivli"],
};

export default function Chatbot() {
  /* ================= STATE ================= */
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu"); // menu | booking
  const [step, setStep] = useState(""); // name | age | phone | area | center | date | done
  const [openFaq, setOpenFaq] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  /* ================= REFS ================= */
  const selectedcenterRef = useRef("");
  const isSubmittingRef = useRef(false);
  const msgEndRef = useRef(null);

  /* ================= FORM DATA ================= */
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    phone: "",
    area: "",
    center: "",
    date: "",
    type: "Appointment",
  });

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (view === "booking") {
      msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, view]);

  /* ================= RESET ================= */
  function resetChat() {
    setView("menu");
    setMessages([]);
    setStep("");
    setInput("");
    selectedcenterRef.current = "";
    isSubmittingRef.current = false;
    setForm({
      patientName: "",
      age: "",
      phone: "",
      area: "",
      center: "",
      date: "",
      type: "Appointment",
    });
  }

  function toggleOpen() {
    setOpen(!open);
    if (!open) resetChat();
  }

  /* ================= DATA ================= */
  const faqs = [
    {
      question: "Where are you located?",
      answer: (
        <>
          We are present at multiple locations across Mumbai & Navi Mumbai.{" "}
          <span
            className="faq-link"
            onClick={() => window.open("/allCenters", "_blank")}
          >
            View centers →
          </span>
        </>
      ),
    },
    {
      question: "Can I get a second opinion?",
      answer:
        "Yes, our doctors provide second opinions with complete case review.",
    },
    {
      question: "What should I bring to my appointment?",
      answer:
        "Please bring all previous medical reports, prescriptions, and ID proof.",
    },
  ];

  /* ================= BOOKING FLOW ================= */
  function startBooking() {
    setMessages([{ from: "user", text: "I want to book an appointment" }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Please enter Patient's Name" },
      ]);
      setView("booking");
      setStep("name");
    }, 400);
  }

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  /* ================= AREA ================= */
  function chooseArea(area) {
    setForm((prev) => ({
      ...prev,
      area,
      center: "",
    }));

    selectedcenterRef.current = "";

    setMessages((prev) => [
      ...prev,
      { from: "user", text: area },
      { from: "bot", text: "Please select ICTC center." },
    ]);

    setStep("center");
  }

  /* ================= CENTER ================= */
  function choosecenter(c) {
    selectedcenterRef.current = c;

    setForm((prev) => ({ ...prev, center: c }));

    setMessages((prev) => [
      ...prev,
      { from: "user", text: c },
      { from: "bot", text: "Please select appointment date." },
    ]);

    setStep("date");
  }

  /* ================= DATE + SUBMIT ================= */
  async function chooseDate(d) {
    if (!d || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const selectedDate = new Date(d);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      isSubmittingRef.current = false;
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Date cannot be in the past." },
      ]);
      return;
    }

    if (new Date(d).getDay() === 0) {
      isSubmittingRef.current = false;
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Consultations are not available on Sundays." },
      ]);
      return;
    }

    if (!form.area || !selectedcenterRef.current) {
      isSubmittingRef.current = false;
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Please select area and center properly." },
      ]);
      return;
    }

    const payload = {
      patientname: form.patientName,
      age: form.age,
      phone: form.phone,
      area: form.area,
      center: selectedcenterRef.current,
      date: d,
      source: "Chatbot",
    };

    setMessages((prev) => [...prev, { from: "user", text: d }]);

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwvMAutv6LdpzjigmueH0mBXUXNBn0YYh7zhQgLl4BoJ6fldYbuFH_SSBqB4-5U44aw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        }
      );

      // With no-cors mode, we can't read the response, so assume success
      // if the request didn't throw an error
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🎉 Appointment booked successfully!" },
        {
          from: "bot",
          text:
            "Our team will contact you shortly to confirm your appointment.",
        },
      ]);
      setStep("done");
    } catch (err) {
      console.error("Booking error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Something went wrong. Please try again." },
      ]);
    } finally {
      isSubmittingRef.current = false;
    }
  }

  /* ================= INPUT HANDLER ================= */
  function handleSend() {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);

    if (step === "name") {
      if (!/^[a-zA-Z ]+$/.test(userMsg) || userMsg.length < 2) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ Please enter a valid full name." },
        ]);
        return;
      }

      setForm((prev) => ({ ...prev, patientName: userMsg }));
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please enter Patient's Age" },
        ]);
        setStep("age");
      }, 300);
    } else if (step === "age") {
      const age = Number(userMsg);
      if (!age || age < 1 || age > 120) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ Enter age between 1 and 120." },
        ]);
        return;
      }

      setForm((prev) => ({ ...prev, age }));
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please enter WhatsApp Number" },
        ]);
        setStep("phone");
      }, 300);
    } else if (step === "phone") {
      if (
        !/^[6-9]\d{9}$/.test(userMsg) ||
        /^(\d)\1{9}$/.test(userMsg)
      ) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ Enter valid Indian WhatsApp number." },
        ]);
        return;
      }

      setForm((prev) => ({ ...prev, phone: userMsg }));
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please select area." },
        ]);
        setStep("area");
      }, 300);
    }
  }

  /* ================= JSX ================= */
  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="chat-float-wrapper">
        {!open && (
          <>
            <div className="chat-hover-text">
              Hi, Need Help? <br /> I'm here to assist
            </div>
            <button className="chat-button" onClick={toggleOpen}>
              <img src={chatIcon} className="chat-icon" alt="" />
            </button>
          </>
        )}

        {open && (
          <button className="chat-down-btn" onClick={toggleOpen}>
            <img src={DownChatbot} className="down-arrow-icon" alt="" />
          </button>
        )}
      </div>

      {open && (
        <div className="chat-window">
          {/* HEADER */}
          <div className="chat-header">
            <img src={Logo} className="chat-logo" alt="" />
            <button className="close-btn" onClick={toggleOpen}>
              <img src={Close} alt="" />
            </button>
          </div>

          <div className="chat-body">
            {view === "booking" && (
              <div className="back-row" onClick={resetChat}>
                <img src={backIcon} className="back-icon" alt="" />
              </div>
            )}

            {/* MENU */}
            {view === "menu" && (
              <div className="menu-container">
                <p className="hi-text">
                  Hi there 👋 <br /> How can we help you?
                </p>

                <button className="menu-option" onClick={startBooking}>
                  <span>Book an appointment</span>
                  <span className="arrow-wrapper">
                    <img src={DefaultArrow} className="arrow default" alt="" />
                    <img src={VariantArrow} className="arrow hover" alt="" />
                  </span>
                </button>

                <button
                  className="menu-option"
                  onClick={() => window.open("tel:8858855200")}
                >
                  <span>Call ICTC Helpline</span>
                  <span className="arrow-wrapper">
                    <img src={DefaultArrow} className="arrow default" alt="" />
                    <img src={VariantArrow} className="arrow hover" alt="" />
                  </span>
                </button>

                <button
                  className="menu-option whatsapp"
                  onClick={() => window.open("https://wa.me/8858855200")}
                >
                  <span className="whatsapp-logo-msg">
                    Reach out to us on WhatsApp{" "}
                    <img src={WhatsappIcon} alt="" />
                  </span>
                </button>

                <div className="faq-box">
                  <h4>FAQ's</h4>
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className={`faq-item ${
                        openFaq === i ? "active" : ""
                      }`}
                      onClick={() => toggleFaq(i)}
                    >
                      <div className="faq-question">
                        {faq.question}
                        <img
                          src={openFaq === i ? UpFAQ : DownFAQ}
                          alt=""
                        />
                      </div>
                      {openFaq === i && (
                        <div className="faq-answer">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES */}
            <div className="msg-area">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
          </div>

          {/* AREA */}
          {step === "area" && (
            <div className="center-box">
              {Object.keys(areacenterMap).map((a) => (
                <button
                  key={a}
                  className="center-btn"
                  onClick={() => chooseArea(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          )}

          {/* CENTERS */}
          {step === "center" && (
            <div className="center-box">
              {areacenterMap[form.area].map((c) => (
                <button
                  key={c}
                  className="center-btn"
                  onClick={() => choosecenter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* DATE */}
          {step === "date" && (
            <div className="inline-date-box">
              <input
                type="date"
                className="date-picker-inline"
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => chooseDate(e.target.value)}
              />
            </div>
          )}

          {/* INPUT */}
          {view === "booking" &&
            !["area", "center", "date", "done"].includes(step) && (
              <div className="input-row">
                <input
                  type="text"
                  value={input}
                  placeholder={
                    step === "name"
                      ? "Enter patient name..."
                      : step === "age"
                      ? "Enter patient age..."
                      : "Enter WhatsApp number..."
                  }
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <img
                  src={sendIcon}
                  className="send-icon"
                  onClick={handleSend}
                  alt=""
                />
              </div>
            )}
        </div>
      )}
    </>
  );
}
