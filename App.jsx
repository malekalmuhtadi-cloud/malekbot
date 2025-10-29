import React, { useState } from 'react'

function Chat({ clientSlug }) {
  const [messages, setMessages] = useState([{ role: "system", content: "Hello! How can I help you?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/${clientSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs })
      });
      const data = await res.json();
      const assistant = data?.choices?.[0]?.message || { role: "assistant", content: "Sorry, error." };
      setMessages(prev => [...prev, assistant]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.filter(m=>m.role!=="system").map((m,i)=>(
          <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
            <div className="msg-role">{m.role === "user" ? (m.role==="user"?"You":"You") : "MalekBot"}</div>
            <div className="msg-content">{m.content}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." rows={2} />
        <button onClick={send} disabled={loading}>{loading ? "..." : "Send"}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [slug] = useState("demo-shop");
  const [lang, setLang] = useState("en");

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo-circle">MB</div>
          <div>
            <h1>MalekBot</h1>
            <p>Automated replies — Deutsch &amp; English</p>
          </div>
        </div>

        <div className="lang-switch">
          <button onClick={()=>setLang('en')}>EN</button>
          <button onClick={()=>setLang('de')}>DE</button>
        </div>
      </header>

      <main>
        <Chat clientSlug={slug} />
      </main>

      <footer className="footer">
        <div>Contact: malkmhtdy7@gmail.com</div>
      </footer>
    </div>
  );
}
