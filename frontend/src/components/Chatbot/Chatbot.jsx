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

export default function Chatbot() {
  /* ================= STATE ================= */
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu"); // menu | booking
  const [step, setStep] = useState(""); // name | age | phone | centre | date | done
  const [openFaq, setOpenFaq] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const msgEndRef = useRef(null);

  /* ================= FORM DATA ================= */
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    phone: "",
    centre: "",
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
    setForm({
      patientName: "",
      age: "",
      phone: "",
      centre: "",
      date: "",
      type: "Appointment",
    });
  }

  function toggleOpen() {
    setOpen(!open);
    if (!open) resetChat();
  }

  /* ================= DATA ================= */
  const centres = [
    "Vashi",
    "Panvel",
    "Kalyan",
    "Dombivli",
    "Sion",
    "Dadar",
    "Ghatkopar",
    "Goregaon",
    "Chembur",
    "Santacruz",
  ];

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
            View centres →
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

  /* ================= CENTRE ================= */
  function chooseCentre(c) {
    setForm((prev) => ({ ...prev, centre: c }));

    setMessages((prev) => [
      ...prev,
      { from: "user", text: c },
      { from: "bot", text: "Please select appointment date." },
    ]);

    setStep("date");
  }

  /* ================= DATE + SUBMIT ================= */
  async function chooseDate(d) {
    if (!d) return;

    const today = new Date().setHours(0, 0, 0, 0);
    const selected = new Date(d).setHours(0, 0, 0, 0);

    if (selected < today) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Date cannot be in the past." },
        { from: "bot", text: "Please select a valid date." },
      ]);
      return;
    }

    const payload = {
      name: form.patientName,
      age: form.age,
      phone: form.phone,
      selectedCentre: form.centre,
      date: d,
      type: "Appointment",
    };

    setMessages((prev) => [...prev, { from: "user", text: d }]);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby_yIfLs8GlqAlgyqHtjPFcujoIfeiYqHzFNUUJckL4FAb1z-EkbqlBW1FpkVqXFA/exec",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
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
      } else {
        throw new Error("Sheet error");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Something went wrong. Please try again." },
      ]);
    }
  }

  /* ================= INPUT HANDLER ================= */
  function handleSend() {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);

    /* NAME */
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
    }

    /* AGE */
    else if (step === "age") {
      if (!/^\d+$/.test(userMsg)) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ Age must be a number." },
        ]);
        return;
      }

      const age = Number(userMsg);
      if (age < 1 || age > 120) {
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
          { from: "bot", text: "Please enter Phone Number" },
        ]);
        setStep("phone");
      }, 300);
    }

    /* PHONE */
    else if (step === "phone") {
      if (!/^\d{10}$/.test(userMsg) || !/^[6-9]/.test(userMsg)) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ Enter valid 10-digit Indian number." },
        ]);
        return;
      }

      setForm((prev) => ({ ...prev, phone: userMsg }));
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please select ICTC centre." },
        ]);
        setStep("centre");
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
                      className={`faq-item ${openFaq === i ? "active" : ""}`}
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

          {/* CENTRES */}
          {step === "centre" && (
            <div className="centre-box">
              {centres.map((c) => (
                <button
                  key={c}
                  className="centre-btn"
                  onClick={() => chooseCentre(c)}
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
            !["centre", "date", "done"].includes(step) && (
              <div className="input-row">
                <input
                  type="text"
                  value={input}
                  placeholder={
                    step === "name"
                      ? "Enter patient name..."
                      : step === "age"
                      ? "Enter patient age..."
                      : "Enter phone number..."
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
