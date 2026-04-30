import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

// 🔗 Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 📩 MAIL + RESEND
async function queueMail(mail) {
  // 1. Sauvegarde dans Supabase
  const { data, error } = await supabase
    .from("mail_queue")
    .insert([{
      to_email: mail.to_email,
      subject: mail.subject,
      body: mail.body,
      status: "pending"
    }])
    .select()
    .single();

  if (error) {
    console.error("Erreur mail_queue:", error);
    return;
  }

  // 2. Envoi réel via API
  try {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mail)
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Erreur Resend:", result);
      return;
    }

    // 3. Update statut
    await supabase
      .from("mail_queue")
      .update({ status: "sent" })
      .eq("id", data.id);

  } catch (e) {
    console.error("Erreur API mail:", e);
  }
}

function App() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    email: "",
    network: "IVAO",
    network_id: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // 🧾 Candidature
    await supabase.from("applications").insert([form]);

    // 📩 Mail
    await queueMail({
      to_email: form.email,
      subject: "Candidature TigerWing reçue",
      body: `Bonjour ${form.first_name},

Ta candidature a bien été envoyée.
Notre équipe va l'étudier.

TigerWing VA ✈️`
    });

    alert("Candidature envoyée !");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Rejoindre TigerWing</h1>

      <input name="first_name" placeholder="Prénom" onChange={handleChange} /><br/>
      <input name="last_name" placeholder="Nom" onChange={handleChange} /><br/>
      <input name="nickname" placeholder="Surnom" onChange={handleChange} /><br/>
      <input name="email" placeholder="Email" onChange={handleChange} /><br/>

      <select name="network" onChange={handleChange}>
        <option value="IVAO">IVAO</option>
        <option value="VATSIM">VATSIM</option>
      </select><br/>

      <input name="network_id" placeholder="ID IVAO / CID VATSIM" onChange={handleChange} /><br/><br/>

      <button onClick={handleSubmit}>
        Envoyer candidature
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
