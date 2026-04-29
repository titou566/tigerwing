import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function App() {
  return (
    <div className="app">
      <header>
        <h1>TigerWing</h1>
        <p>Aviation Virtuelle Premium</p>
      </header>

      <section className="hero">
        <h2>Bienvenue Commandant</h2>
        <p>
          Rejoignez une VA indépendante luxe inspirée des plus grandes compagnies.
        </p>
        <button>Rejoindre maintenant</button>
      </section>

      <section className="stats">
        <div>✈️ 125 Pilotes</div>
        <div>🌍 42 Routes</div>
        <div>🏆 Premium VA</div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
