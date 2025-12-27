import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import chatIcon from "../../assets/ChatButton.png";
import backIcon from "../../assets/BackArrow.png";
import sendIcon from "../../assets/Send Message icon.svg";
import DefaultArrow from "../../assets/DefaultArrow.png";
import VariantArrow from "../../assets/VariantArrow.png";
import WhatsappIcon from "../../assets/whatsapp-icon.png";
import Logo from "../../assets/ICTC_Logo(long).png";
import DownChatbot from "../../assets/DownChatbot.png";
import UpFAQ from "../../assets/upfaq.png";
import Close from "../../assets/CloseIcon.png";
import DownFAQ from "../../assets/dowfaq.png";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu");
  const [step, setStep] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const msgEndRef = useRef(null);

  useEffect(() => {
    if (view === "booking") {
      msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, view]);

  const [, setForm] = useState({
    patientName: "",
    phone: "",
  });

  function resetChat() {
    setView("menu");
    setMessages([]);
    setStep("");
    setForm({ patientName: "", phone: "", centre: "", date: "" });
    setInput("");
    // eslint-disable-next-line no-undef
    setDateModal(false);
  }

  // Centres
  const centres = [
    "Vashi",
    "Panvel",
    "Kalyan",
    "Dombivli",
    "Sion",
    "Dadar",
    "Ghatkopar",
    "Goregaon",
  ];

  function toggleOpen() {
    setOpen(!open);
    if (!open) resetChat();
  }

  // Start booking flow
  function startBooking() {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "I want to book an appointment" },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Please enter Patient's Name" },
      ]);
      setView("booking");
      setStep("name");
    }, 400);
  }

  const faqs = [
    {
      question: "Where are you located?",
      answer: (
        <>
          We are present at 10 locations across Mumbai and Navi Mumbai. To know
          more about each centre please visit{" "}
          <span
            className="faq-link"
            onClick={() => window.open("/centres", "_blank")}
          >
            centre pages →
          </span>
        </>
      ),
    },
    {
      question: "Can I get a second opinion at your center?",
      answer:
        "Yes, our specialists provide second opinions with complete case review.",
    },
    {
      question: "What should I bring to my appointment?",
      answer:
        "Please bring all previous medical reports, prescriptions, and ID proof.",
    },
  ];

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  function chooseCentre(c) {
    setForm((prev) => ({ ...prev, centre: c }));

    setMessages((prev) => [
      ...prev,
      { from: "user", text: c },
      { from: "bot", text: "Please select appointment date." },
    ]);

    setStep("date");
  }

  function chooseDate(d) {
    if (!d) return;

    const today = new Date().setHours(0, 0, 0, 0);
    const selected = new Date(d).setHours(0, 0, 0, 0);

    if (selected < today) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ The selected date cannot be in the past." },
      ]);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please select a valid appointment date." },
        ]);
      }, 200);

      return;
    }

    setForm((prev) => ({ ...prev, date: d }));

    setMessages((prev) => [...prev, { from: "user", text: d }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🎉 Appointment booked successfully!" },
      ]);
      setStep("done");
    }, 300);
  }

  // Handle sending input
  function handleSend() {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);

    // STEP 1 — Patient Name
    if (step === "name") {
      if (!/^[a-zA-Z ]+$/.test(userMsg)) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: " ⚠ Patient's Name should only contain alphabets.",
          },
        ]);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter patient's name again." },
          ]);
        }, 200);
        return;
      }
      if (userMsg.trim().length < 2) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ Please enter a valid full name." },
        ]);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter Patient's Name again." },
          ]);
        }, 200);
        return;
      }

      setForm((prev) => ({ ...prev, patientName: userMsg }));
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please enter Phone Number" },
        ]);
        setStep("phone");
      }, 400);
    }

    // STEP 2 — Phone Number (digits only + must be 10 digits)
    else if (step === "phone") {
      // ❌ Reject anything other than digits
      if (!/^\d+$/.test(userMsg)) {
        setInput("");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: "Please enter numbers only for phone number!",
            },
          ]);
        }, 300);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter phone number again." },
          ]);
        }, 350);
        return;
      }

      // ❌ Reject if not exactly 10 digits
      if (userMsg.length !== 10) {
        setInput("");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "⚠ Phone number must be exactly 10 digits." },
          ]);
        }, 300);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter phone number again." },
          ]);
        }, 350);
        return;
      }

      if (!/^[6-9]/.test(userMsg)) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "⚠ Indian phone numbers must start with 6, 7, 8, or 9.",
          },
        ]);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter phone number again." },
          ]);
        }, 200);
        return;
      }

      // ❌ Reject known invalid sequences
      const blocked = ["1234567890", "9876543210", "0123456789"];
      if (blocked.includes(userMsg)) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠ This phone number is not valid." },
        ]);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter phone number again." },
          ]);
        }, 200);
        return;
      }

      // ❌ Reject same-digit numbers (1111111111, 9999999999)
      if (/^(\d)\1+$/.test(userMsg)) {
        setInput("");
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "⚠ Phone number cannot contain the same digit repeated.",
          },
        ]);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Please enter phone number again." },
          ]);
        }, 200);
        return;
      }

      // ✅ Valid number (10 digits)
      setForm((prev) => ({ ...prev, phone: userMsg }));
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Please select ICTC centre for appointment." },
        ]);
        setStep("centre");
      }, 300);
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="chat-float-wrapper">
        {!open && (
          <>
            <div className="chat-hover-text">
              Hi, Need Help? <br /> I'm here to assist
            </div>

            <button className="chat-button" onClick={toggleOpen}>
              <img src={chatIcon} className="chat-icon" />
            </button>
          </>
        )}

        {open && (
          <button className="chat-down-btn" onClick={toggleOpen}>
            <img src={DownChatbot} className="down-arrow-icon" />
          </button>
        )}
      </div>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            {Logo && <img src={Logo} className="chat-logo" />}

            <button className="close-btn" onClick={toggleOpen}>
              <img src={Close} alt="" />
            </button>
          </div>

          <div className="chat-body">
            {/* TOP BACK BUTTON */}
            {view === "booking" && (
              <div className="back-row" onClick={() => resetChat()}>
                <img src={backIcon} className="back-icon" />
              </div>
            )}

            {/* MENU VIEW */}
            {view === "menu" && (
              <div className="menu-container">
                <p className="hi-text">
                  Hi there👋
                  <br /> How can we help you?
                </p>

                <button className="menu-option" onClick={startBooking}>
                  <span>Book an appointment</span>
                  <span className="arrow-wrapper">
                    <img src={DefaultArrow} className="arrow default" />
                    <img src={VariantArrow} className="arrow hover" />
                  </span>
                </button>

                <button className="menu-option">
                  <span>Call ICTC Helpline</span>
                  <span className="arrow-wrapper">
                    <img src={DefaultArrow} className="arrow default" />
                    <img src={VariantArrow} className="arrow hover" />
                  </span>
                </button>

                <button
                  className="menu-option whatsapp"
                  onClick={() => window.open("https://wa.me/919999999999")}
                >
                  <div>
                    <span className="whatsapp-logo-msg">
                      Reach out to us on WhatsApp{" "}
                      <img src={WhatsappIcon} alt="whatsapp" />
                    </span>
                  </div>

                  <span className="arrow-wrapper">
                    <img src={DefaultArrow} className="arrow default" />
                    <img src={VariantArrow} className="arrow hover" />
                  </span>
                </button>

                <div className="faq-box">
                  <h4 className="faq-title">FAQ's</h4>
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className={`faq-item ${
                        openFaq === index ? "active" : ""
                      }`}
                      onClick={() => toggleFaq(index)}
                    >
                      <div className="faq-question">
                        <span>{faq.question}</span>

                        <img
                          src={openFaq === index ? UpFAQ : DownFAQ}
                          className="faq-arrow"
                          alt="arrow"
                        />
                      </div>

                      {openFaq === index && (
                        <div className="faq-answer">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHAT MESSAGES */}
            <div className="msg-area">
              {messages.map((msg, index) => (
                <div key={index} className={`msg ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
              {/* Auto-scroll anchor */}
              {view === "booking" && <div ref={msgEndRef}></div>}
            </div>
          </div>

          {/* Centre Selection */}
          {step === "centre" && (
            <div className="centre-box">
              {centres.map((c, i) => (
                <button
                  key={i}
                  className="centre-btn"
                  onClick={() => chooseCentre(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {step === "date" && (
            <div className="inline-date-box">
              <input
                type="date"
                className="date-picker-inline"
                onChange={(e) => chooseDate(e.target.value)}
              />
            </div>
          )}

          {/* INPUT AREA */}
          {view === "booking" &&
            step !== "centre" &&
            step !== "date" &&
            step !== "done" && (
              <div className="input-row">
                <input
                  type="text"
                  placeholder={
                    step === "name"
                      ? "Enter patient name..."
                      : "Enter phone number..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />

                <img
                  src={sendIcon}
                  className="send-icon"
                  onClick={handleSend}
                />
              </div>
            )}
        </div>
      )}
    </>
  );
}
