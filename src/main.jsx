import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { Plane, Crown, ShieldCheck, Users, Trophy, CalendarDays, FileText, LogIn, LogOut, UserPlus, Award, BookOpen, Send, Check, X, Lock, Menu, Bell, Building2, Download, Database, RefreshCw, RadioTower } from "lucide-react";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const demoUsers = [
  { email:"pilote@tigerwing.va", password:"tiger123", role:"pilote", name:"Antoine Martin", callsign:"TWG1896", network:"IVAO + VATSIM", rank:"First Officer", hours:42, flights:18, airport:"LFLL", xp:38 },
  { email:"admin@tigerwing.va", password:"admin123", role:"admin", name:"Julie Moreau", callsign:"TWG900", network:"IVAO", rank:"Commandant", hours:210, flights:81, airport:"LFPG", xp:74 },
  { email:"ceo@tigerwing.va", password:"ceo123", role:"ceo", name:"Alexandre Leroy", callsign:"TWG001", network:"Aucun", rank:"Executive Captain", hours:980, flights:412, airport:"LFPG", xp:100 }
];

const fleet = [
  ["A220-300","Régional premium","Airbus","Lyon"],["A320neo","Cœur européen","Airbus","Paris CDG"],
  ["A321neo","Europe haute capacité","Airbus","Nice"],["A330neo","Long-courrier confort","Airbus","Montréal"],
  ["A350-900","Flagship luxe","Airbus","Paris CDG"],["B737-8","Réseau flexible","Boeing","Genève"],
  ["B777-300ER","Routes prestige","Boeing","Dubaï"],["B787-9","Dreamliner premium","Boeing","Paris CDG"]
];

const fallbackApps = [
  { id:"APP-001", fullname:"Lucas M", email:"lucas@example.com", country:"France", network:"Aucun", simulator:"MSFS", experience:"Débutant", motivation:"Je veux progresser.", status:"pending" },
  { id:"APP-002", fullname:"Nina R", email:"nina@example.com", country:"Belgique", network:"VATSIM", simulator:"X-Plane", experience:"Intermédiaire", motivation:"Je cherche une VA active.", status:"pending" }
];

const fallbackPlans = [
  { id:"FP-1001", callsign:"TWG204", pilot_name:"Antoine Martin", pilot_email:"pilote@tigerwing.va", departure:"LFPG", arrival:"LEMD", aircraft:"A320neo", route:"OKASI UN860 PPN", status:"accepted" },
  { id:"FP-1002", callsign:"TWG711", pilot_name:"Julie Moreau", pilot_email:"admin@tigerwing.va", departure:"EGLL", arrival:"LFPG", aircraft:"B737-8", route:"DVR UL9 BUBLI", status:"completed" },
  { id:"FP-1003", callsign:"TWG350", pilot_name:"Alexandre Leroy", pilot_email:"ceo@tigerwing.va", departure:"LFPG", arrival:"OMDB", aircraft:"A350-900", route:"MOPAR UL607", status:"scheduled" }
];

function canAdmin(u){ return u?.role === "admin" || u?.role === "ceo"; }
function canCEO(u){ return u?.role === "ceo"; }
function statusFR(s){ return ({pending:"En attente",accepted:"Acceptée",rejected:"Refusée",completed:"Terminé",scheduled:"Programmé"}[s] || s); }

async function safeQuery(fn, fallback){
  try{ if(!supabase) return fallback; const {data,error}=await fn(); if(error) throw error; return data || fallback; }
  catch(e){ console.warn(e.message); return fallback; }
}

function App(){
  const [page,setPage]=useState("home");
  const [user,setUser]=useState(null);
  const [menu,setMenu]=useState(false);
  const [apps,setApps]=useState(fallbackApps);
  const [plans,setPlans]=useState(fallbackPlans);
  const [pilots,setPilots]=useState(demoUsers.map(u=>({...u,status:"active"})));
  const [loading,setLoading]=useState(false);

  async function refreshData(){
    setLoading(true);
    const [a,p,pi]=await Promise.all([
      safeQuery(()=>supabase.from("applications").select("*").order("created_at",{ascending:false}), fallbackApps),
      safeQuery(()=>supabase.from("flight_plans").select("*").order("created_at",{ascending:false}), fallbackPlans),
      safeQuery(()=>supabase.from("pilots").select("*").order("created_at",{ascending:false}), demoUsers.map(u=>({...u,status:"active"})))
    ]);
    setApps(a); setPlans(p); setPilots(pi.length ? pi : demoUsers.map(u=>({...u,status:"active"})));
    setLoading(false);
  }
  useEffect(()=>{ refreshData(); }, []);

  function login(email,password){
    const found=demoUsers.find(u=>u.email===email && u.password===password);
    if(!found) throw new Error("Identifiants incorrects");
    setUser(found); setPage("dashboard");
  }

  async function addApplication(form){
    const payload={...form,status:"pending"};
    if(supabase){ const {error}=await supabase.from("applications").insert(payload); if(error) throw error; }
    setApps([{...payload,id:"APP-"+Date.now()},...apps]);
  }
  async function updateApplication(id,status){
    if(supabase && !String(id).startsWith("APP-")) await supabase.from("applications").update({status}).eq("id",id);
    setApps(apps.map(a=>a.id===id?{...a,status}:a));
  }
  async function addFlightPlan(form){
    const payload={...form,pilot_email:user.email,pilot_name:user.name,status:"pending"};
    if(supabase){ const {error}=await supabase.from("flight_plans").insert(payload); if(error) throw error; }
    setPlans([{...payload,id:"FP-"+Date.now()},...plans]);
  }

  if(page==="home") return <Home setPage={setPage}/>;
  if(page==="join") return <Join setPage={setPage} addApplication={addApplication}/>;
  if(page==="login") return <Login setPage={setPage} login={login}/>;

  return <div className="shell">
    <aside className={menu?"side open":"side"}>
      <Logo dark/>
      <Nav icon={<Plane/>} id="dashboard" label="Tableau de bord" page={page} setPage={setPage} setMenu={setMenu}/>
      <Nav icon={<FileText/>} id="plans" label="Plans de vol" page={page} setPage={setPage} setMenu={setMenu}/>
      <Nav icon={<Plane/>} id="fleet" label="Flotte" page={page} setPage={setPage} setMenu={setMenu}/>
      <Nav icon={<Award/>} id="grades" label="Grades" page={page} setPage={setPage} setMenu={setMenu}/>
      <Nav icon={<Trophy/>} id="leaderboard" label="Classement" page={page} setPage={setPage} setMenu={setMenu}/>
      <Nav icon={<CalendarDays/>} id="events" label="Événements" page={page} setPage={setPage} setMenu={setMenu}/>
      <Nav icon={<BookOpen/>} id="docs" label="Documents" page={page} setPage={setPage} setMenu={setMenu}/>
      {canAdmin(user)&&<div className="sep">Admin</div>}
      {canAdmin(user)&&<Nav icon={<ShieldCheck/>} id="admin" label="Candidatures" page={page} setPage={setPage} setMenu={setMenu}/>}
      {canAdmin(user)&&<Nav icon={<Users/>} id="pilots" label="Pilotes" page={page} setPage={setPage} setMenu={setMenu}/>}
      {canCEO(user)&&<div className="sep">CEO</div>}
      {canCEO(user)&&<Nav icon={<Crown/>} id="ceo" label="Direction générale" page={page} setPage={setPage} setMenu={setMenu}/>}
    </aside>
    <main>
      <header className="top"><button className="hamb" onClick={()=>setMenu(true)}><Menu/></button><b>TigerWing Crew Center</b><div className="topUser"><span className={supabase?"db on":"db"}><Database size={16}/>{supabase?"Supabase connecté":"Mode local"}</span><button onClick={refreshData}><RefreshCw size={16}/>{loading?"...":"Actualiser"}</button><Bell size={18}/><span>{user.name}</span><button onClick={()=>{setUser(null);setPage("home")}}><LogOut size={16}/> Déconnexion</button></div></header>
      {page==="dashboard"&&<Dashboard user={user} plans={plans}/>}
      {page==="plans"&&<Plans user={user} plans={plans} addFlightPlan={addFlightPlan}/>}
      {page==="fleet"&&<Fleet/>}
      {page==="grades"&&<Grades/>}
      {page==="leaderboard"&&<Leaderboard pilots={pilots}/>}
      {page==="events"&&<Events/>}
      {page==="docs"&&<Docs/>}
      {page==="admin"&&(canAdmin(user)?<Applications apps={apps} updateApplication={updateApplication}/>:<NoAccess/>)}
      {page==="pilots"&&(canAdmin(user)?<Pilots pilots={pilots} apps={apps}/>:<NoAccess/>)}
      {page==="ceo"&&(canCEO(user)?<CEO apps={apps} plans={plans} pilots={pilots}/>:<NoAccess/>)}
    </main>
  </div>
}

function Logo({dark=false}){ return <div className={dark?"logo dark":"logo"}><span></span><b>TIGERWING</b></div> }
function Nav({icon,id,label,page,setPage,setMenu}){ return <button className={page===id?"nav active":"nav"} onClick={()=>{setPage(id);setMenu(false)}}>{icon}<span>{label}</span></button> }
function Home({setPage}){return <div className="public"><nav className="pubnav"><Logo/><div><button className="ghost" onClick={()=>setPage("login")}>Connexion</button><button className="gold" onClick={()=>setPage("join")}>Rejoindre</button></div></nav><section className="hero"><div><p className="badge"><RadioTower size={16}/> Compagnie virtuelle premium indépendante</p><h1>L’excellence de l’aviation virtuelle.</h1><p className="lead">TigerWing est une VA francophone premium, ouverte aux pilotes IVAO, VATSIM, les deux ou aucun réseau.</p><button className="gold big" onClick={()=>setPage("join")}>Créer ma candidature</button><button className="glass big" onClick={()=>setPage("login")}>Accès pilote</button></div><div className="visual"><Plane className="bigPlane"/><div>TWG350<br/><small>Paris CDG → Dubaï</small></div><div>TWG787<br/><small>Montréal → Paris</small></div></div></section><section className="stats"><Card title="Objectif pilotes" value="250+"/><Card title="Flotte" value="8 avions"/><Card title="Hubs" value="6"/><Card title="Events" value="12/mois"/></section><section className="white"><h2>Pourquoi rejoindre TigerWing ?</h2><div className="grid3"><Feature icon={<ShieldCheck/>} title="Sérieuse" text="Candidatures en base, staff, grades et dashboard."/><Feature icon={<Crown/>} title="Premium" text="Style unique TigerWing : bleu nuit, or, aviation luxe."/><Feature icon={<Users/>} title="Accessible" text="Débutants acceptés, réseaux optionnels."/></div></section></div>}
function Join({setPage,addApplication}){const [form,setForm]=useState({fullname:"",email:"",country:"France",network:"Aucun",simulator:"MSFS",experience:"Débutant",motivation:""});const [ok,setOk]=useState(false);const [err,setErr]=useState("");async function submit(e){e.preventDefault();try{await addApplication(form);setOk(true)}catch(x){setErr(x.message)}}return <div className="auth"><button className="back" onClick={()=>setPage("home")}>← Accueil</button><Logo dark/><form onSubmit={submit} className="authcard"><h1>Rejoindre TigerWing</h1><input required placeholder="Nom / pseudo" value={form.fullname} onChange={e=>setForm({...form,fullname:e.target.value})}/><input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><select value={form.country} onChange={e=>setForm({...form,country:e.target.value})}><option>France</option><option>Belgique</option><option>Suisse</option><option>Canada</option><option>Autre</option></select><select value={form.network} onChange={e=>setForm({...form,network:e.target.value})}><option>Aucun</option><option>IVAO</option><option>VATSIM</option><option>IVAO + VATSIM</option></select><select value={form.simulator} onChange={e=>setForm({...form,simulator:e.target.value})}><option>MSFS</option><option>X-Plane</option><option>Prepar3D</option></select><textarea placeholder="Motivation" value={form.motivation} onChange={e=>setForm({...form,motivation:e.target.value})}></textarea><button className="gold full"><UserPlus size={18}/> Envoyer ma candidature</button>{ok&&<p className="success">Candidature envoyée en base.</p>}{err&&<p className="error">{err}</p>}<button type="button" className="link" onClick={()=>setPage("login")}>Déjà un compte</button></form></div>}
function Login({setPage,login}){const [email,setEmail]=useState("pilote@tigerwing.va");const [password,setPassword]=useState("tiger123");const [err,setErr]=useState("");function submit(e){e.preventDefault();try{login(email,password)}catch(x){setErr(x.message)}}return <div className="auth"><button className="back" onClick={()=>setPage("home")}>← Accueil</button><Logo dark/><form className="authcard" onSubmit={submit}><h1>Connexion pilote</h1><input value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/>{err&&<p className="error">{err}</p>}<button className="gold full"><LogIn size={18}/> Se connecter</button><div className="demo">pilote@tigerwing.va / tiger123<br/>admin@tigerwing.va / admin123<br/>ceo@tigerwing.va / ceo123</div></form></div>}
function Dashboard({user,plans}){const my=user.role==="pilote"?plans.filter(p=>p.pilot_email===user.email||p.pilot_name===user.name):plans;return <section className="page"><div className="welcome">Bienvenue chez TigerWing, {user.name}.</div><div className="stats"><Card title="Vols" value={user.flights}/><Card title="Heures" value={user.hours+"h"}/><Card title="Grade" value={user.rank}/><Card title="Aéroport" value={user.airport}/></div><div className="grid2"><div className="panel profile"><div className="pilot">👨‍✈️</div><h2>{user.callsign}</h2><p>{user.network}</p><div className="bar"><span style={{width:user.xp+"%"}}></span></div></div><div className="panel map"><h2>Opérations VA</h2>{my.map(p=><div className="flight" key={p.id}><Plane size={16}/><b>{p.callsign}</b><span>{p.departure} → {p.arrival}</span></div>)}</div></div></section>}
function Plans({plans,addFlightPlan,user}){const [f,setF]=useState({callsign:"TWG204",departure:"LFPG",arrival:"LEMD",aircraft:"A320neo",route:""});const [ok,setOk]=useState(false);async function add(e){e.preventDefault();await addFlightPlan(f);setOk(true)}const shown=user.role==="pilote"?plans.filter(p=>p.pilot_email===user.email||p.pilot_name===user.name):plans;return <section className="page"><h1>Plans de vol</h1><div className="grid2"><form className="panel form" onSubmit={add}><input value={f.callsign} onChange={e=>setF({...f,callsign:e.target.value.toUpperCase()})}/><input value={f.departure} onChange={e=>setF({...f,departure:e.target.value.toUpperCase()})}/><input value={f.arrival} onChange={e=>setF({...f,arrival:e.target.value.toUpperCase()})}/><input value={f.aircraft} onChange={e=>setF({...f,aircraft:e.target.value})}/><textarea placeholder="Route" value={f.route} onChange={e=>setF({...f,route:e.target.value})}></textarea><button className="gold"><Send size={16}/> Envoyer</button>{ok&&<p className="success">Plan envoyé.</p>}</form><PlanTable data={shown}/></div></section>}
function PlanTable({data}){return <div className="panel"><h2>Liste</h2><table><tbody>{data.map(p=><tr key={p.id}><td>{p.callsign}</td><td>{p.departure} → {p.arrival}</td><td>{p.aircraft}</td><td>{statusFR(p.status)}</td></tr>)}</tbody></table></div>}
function Fleet(){return <section className="page"><h1>Flotte officielle</h1><div className="fleet">{fleet.map(([m,r,b,h])=><div className="fleetcard" key={m}><Plane/><span>{b}</span><h2>{m}</h2><p>{r}</p><small>Hub : {h}</small></div>)}</div></section>}
function Grades(){return <section className="page"><h1>Grades</h1><div className="fleet">{["Cadet","First Officer","Captain","Commandant","Executive Captain"].map(g=><div className="fleetcard" key={g}><Award/><h2>{g}</h2><p>Progression TigerWing</p></div>)}</div></section>}
function Leaderboard({pilots}){return <section className="page"><h1>Classement</h1><div className="panel"><table><tbody>{pilots.map((u,i)=><tr key={u.email||i}><td>{i+1}</td><td>{u.name}</td><td>{u.hours||0}h</td><td>{u.flights||0} vols</td><td>{u.rank||"Cadet"}</td></tr>)}</tbody></table></div></section>}
function Events(){return <section className="page"><h1>Événements</h1><div className="grid3"><Feature icon={<CalendarDays/>} title="Friday Night Ops" text="Paris CDG → Nice"/><Feature icon={<Plane/>} title="Long Courrier Luxe" text="Paris CDG → Dubaï"/><Feature icon={<Users/>} title="Académie débutants" text="Formation"/></div></section>}
function Docs(){return <section className="page"><h1>Documents</h1><div className="grid3"><Feature icon={<Download/>} title="Manuel pilote" text="Procédures TigerWing"/><Feature icon={<BookOpen/>} title="Livrées" text="Pack à venir"/><Feature icon={<Building2/>} title="Discord" text="Communauté officielle"/></div></section>}
function Applications({apps,updateApplication}){return <section className="page"><h1>Candidatures</h1><div className="panel"><table><thead><tr><th>Nom</th><th>Email</th><th>Réseau</th><th>Simu</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{apps.map(a=><tr key={a.id}><td>{a.fullname}</td><td>{a.email}</td><td>{a.network}</td><td>{a.simulator}</td><td>{statusFR(a.status)}</td><td><button onClick={()=>updateApplication(a.id,"accepted")}><Check size={15}/> Accepter</button><button onClick={()=>updateApplication(a.id,"rejected")}><X size={15}/> Refuser</button></td></tr>)}</tbody></table></div></section>}
function Pilots({pilots,apps}){const accepted=apps.filter(a=>a.status==="accepted");return <section className="page"><h1>Gestion pilotes</h1><div className="grid2"><div className="panel"><h2>Pilotes actifs</h2><table><tbody>{pilots.map((p,i)=><tr key={p.email||i}><td>{p.name}</td><td>{p.email}</td><td>{p.role||"pilote"}</td><td>{p.rank||"Cadet"}</td></tr>)}</tbody></table></div><div className="panel"><h2>Candidatures acceptées</h2>{accepted.map(a=><div className="row" key={a.id}><b>{a.fullname}</b><span>{a.email}</span></div>)}</div></div></section>}
function CEO({apps,plans,pilots}){return <section className="page"><h1>Direction générale</h1><div className="stats"><Card title="Candidatures" value={apps.length}/><Card title="En attente" value={apps.filter(a=>a.status==="pending").length}/><Card title="Plans de vol" value={plans.length}/><Card title="Pilotes" value={pilots.length}/></div><div className="grid2"><div className="panel"><h2>Vue CEO</h2><p>Le CEO voit tout : candidatures, pilotes, opérations et stratégie.</p></div><div className="panel"><h2>Objectifs</h2><p>Recrutement, flotte premium, events réguliers, Discord actif et futur ACARS.</p></div></div></section>}
function NoAccess(){return <section className="page"><Lock/><h1>Accès refusé</h1></section>}
function Card({title,value}){return <div className="card"><small>{title}</small><b>{value}</b></div>}
function Feature({icon,title,text}){return <div className="feature">{icon}<h3>{title}</h3><p>{text}</p></div>}
createRoot(document.getElementById("root")).render(<App />);
