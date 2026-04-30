import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

// 🔗 Connexion Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 📩 Envoi vers mail_queue
async function mailReceived(a) {
  await supabase.from("mail_queue").insert([
    {
      to_email: a.email,
      subject: "Candidature TigerWing reçue",
      body: `Bonjour ${a.first_name},

Ta candidature a bien été envoyée.
Notre équipe va l’étudier rapidement.

TigerWing VA ✈️`,
      status: "pending",
    },
  ]);
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
    // 🧾 Enregistrer candidature
    await supabase.from("applications").insert([form]);

    // 📩 Ajouter email dans mail_queue
    await mailReceived(form);

    alert("Candidature envoyée !");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Rejoindre TigerWing</h1>

      <input
        name="first_name"
        placeholder="Prénom"
        onChange={handleChange}
      /><br/>

      <input
        name="last_name"
        placeholder="Nom"
        onChange={handleChange}
      /><br/>

      <input
        name="nickname"
        placeholder="Surnom"
        onChange={handleChange}
      /><br/>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      /><br/>

      <select name="network" onChange={handleChange}>
        <option value="IVAO">IVAO</option>
        <option value="VATSIM">VATSIM</option>
      </select><br/>

      <input
        name="network_id"
        placeholder="ID IVAO / CID VATSIM"
        onChange={handleChange}
      /><br/><br/>

      <button onClick={handleSubmit}>
        Envoyer candidature
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
