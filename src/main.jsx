import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Plane, Crown, ShieldCheck, Users, Trophy, CalendarDays, FileText, LogIn,
  LogOut, UserPlus, Settings, Star, MapPin, Clock3, Award, BookOpen, Send,
  CheckCircle2, Lock, Menu, Bell, Building2, Download, Activity, RadioTower
} from "lucide-react";
import "./style.css";

const users = [
  { email:"pilote@tigerwing.va", password:"tiger123", role:"pilote", name:"Antoine Martin", callsign:"TWG1896", network:"IVAO + VATSIM", rank:"First Officer", hours:42, flights:18, airport:"LFLL", xp:38 },
  { email:"admin@tigerwing.va", password:"admin123", role:"admin", name:"Julie Moreau", callsign:"TWG900", network:"IVAO", rank:"Commandant", hours:210, flights:81, airport:"LFPG", xp:74 },
  { email:"ceo@tigerwing.va", password:"ceo123", role:"ceo", name:"Alexandre Leroy", callsign:"TWG001", network:"Aucun", rank:"Executive Captain", hours:980, flights:412, airport:"LFPG", xp:100 }
];

const fleet = [
  ["A220-300","Régional premium","Airbus","Lyon"],
  ["A320neo","Cœur européen","Airbus","Paris CDG"],
  ["A321neo","Europe haute capacité","Airbus","Nice"],
  ["A330neo","Long-courrier confort","Airbus","Montréal"],
  ["A350-900","Flagship luxe","Airbus","Paris CDG"],
  ["B737-8","Réseau flexible","Boeing","Genève"],
  ["B777-300ER","Routes prestige","Boeing","Dubaï"],
  ["B787-9","Dreamliner premium","Boeing","Paris CDG"]
];

const defaultPlans = [
  { id:"FP-1001", callsign:"TWG204", pilot:"Antoine Martin", dep:"LFPG", arr:"LEMD", aircraft:"A320neo", status:"Accepté" },
  { id:"FP-1002", callsign:"TWG711", pilot:"Julie Moreau", dep:"EGLL", arr:"LFPG", aircraft:"B737-8", status:"Terminé" },
  { id:"FP-1003", callsign:"TWG350", pilot:"Alexandre Leroy", dep:"LFPG", arr:"OMDB", aircraft:"A350-900", status:"Programmé" },
  { id:"FP-1004", callsign:"TWG787", pilot:"Nina R", dep:"CYUL", arr:"LFPG", aircraft:"B787-9", status:"Accepté" }
];

const defaultApps = [
  { id:"APP-001", name:"Lucas M", email:"lucas@example.com", network:"Aucun", sim:"MSFS", status:"En attente" },
  { id:"APP-002", name:"Nina R", email:"nina@example.com", network:"VATSIM", sim:"X-Plane", status:"En attente" }
];

function canAdmin(u){ return u?.role === "admin" || u?.role === "ceo"; }
function canCEO(u){ return u?.role === "ceo"; }

function App(){
  const [page,setPage] = useState("home");
  const [user,setUser] = useState(null);
  const [plans,setPlans] = useState(defaultPlans);
  const [apps,setApps] = useState(defaultApps);
  const [menu,setMenu] = useState(false);

  function login(email,password){
    const found = users.find(u=>u.email===email && u.password===password);
    if(!found) throw new Error("Identifiants incorrects");
    setUser(found); setPage("dashboard");
  }

  if(page==="home") return <Home setPage={setPage}/>;
  if(page==="join") return <Join setPage={setPage} apps={apps} setApps={setApps}/>;
  if(page==="login") return <Login setPage={setPage} login={login}/>;

  return <div className="shell">
    <aside className={menu ? "side open" : "side"}>
      <Logo dark/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<Plane/>} id="dashboard" label="Tableau de bord"/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<FileText/>} id="plans" label="Plans de vol"/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<Plane/>} id="fleet" label="Flotte"/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<Award/>} id="grades" label="Grades"/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<Trophy/>} id="leaderboard" label="Classement"/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<CalendarDays/>} id="events" label="Événements"/>
      <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<BookOpen/>} id="docs" label="Documents"/>
      {canAdmin(user) && <div className="sep">Admin</div>}
      {canAdmin(user) && <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<ShieldCheck/>} id="admin" label="Administration"/>}
      {canCEO(user) && <div className="sep">CEO</div>}
      {canCEO(user) && <Nav page={page} setPage={setPage} setMenu={setMenu} icon={<Crown/>} id="ceo" label="Direction générale"/>}
    </aside>
    <main>
      <header className="top">
        <button className="hamb" onClick={()=>setMenu(true)}><Menu/></button>
        <b>TigerWing Crew Center</b>
        <div className="topUser"><Bell size={18}/><span>{user.name}</span><button onClick={()=>{setUser(null);setPage("home")}}><LogOut size={16}/> Déconnexion</button></div>
      </header>
      {page==="dashboard" && <Dashboard user={user} plans={plans}/>}
      {page==="plans" && <Plans user={user} plans={plans} setPlans={setPlans}/>}
      {page==="fleet" && <Fleet/>}
      {page==="grades" && <Grades/>}
      {page==="leaderboard" && <Leaderboard/>}
      {page==="events" && <Events/>}
      {page==="docs" && <Docs/>}
      {page==="admin" && (canAdmin(user) ? <Admin apps={apps} setApps={setApps} plans={plans} setPlans={setPlans}/> : <NoAccess/>)}
      {page==="ceo" && (canCEO(user) ? <CEO/> : <NoAccess/>)}
    </main>
  </div>
}

function Logo({dark=false}){ return <div className={dark?"logo dark":"logo"}><span></span><b>TIGERWING</b></div> }
function Nav({icon,id,label,page,setPage,setMenu}){ return <button className={page===id?"nav active":"nav"} onClick={()=>{setPage(id);setMenu(false)}}>{icon}<span>{label}</span></button> }

function Home({setPage}){
  return <div className="public">
    <nav className="pubnav"><Logo/><div><button className="ghost" onClick={()=>setPage("login")}>Connexion</button><button className="gold" onClick={()=>setPage("join")}>Rejoindre</button></div></nav>
    <section className="hero">
      <div>
        <p className="badge">Compagnie virtuelle premium indépendante</p>
        <h1>L’excellence de l’aviation virtuelle.</h1>
        <p className="lead">TigerWing est une VA francophone premium, ouverte aux pilotes IVAO, VATSIM, les deux ou aucun réseau.</p>
        <button className="gold big" onClick={()=>setPage("join")}>Créer ma candidature</button>
        <button className="glass big" onClick={()=>setPage("login")}>Accès pilote</button>
      </div>
      <div className="visual"><Plane className="bigPlane"/><div>TWG350<br/><small>Paris CDG → Dubaï</small></div><div>TWG787<br/><small>Montréal → Paris</small></div></div>
    </section>
    <section className="stats"><Card title="Objectif pilotes" value="250+"/><Card title="Flotte" value="8 avions"/><Card title="Hubs" value="6"/><Card title="Events" value="12/mois"/></section>
    <section className="white"><h2>Pourquoi rejoindre TigerWing ?</h2><div className="grid3"><Feature icon={<ShieldCheck/>} title="Sérieuse" text="Règlement clair, staff, grades et dashboard."/><Feature icon={<Crown/>} title="Premium" text="Style unique TigerWing : bleu nuit, or, aviation luxe."/><Feature icon={<Users/>} title="Accessible" text="Débutants acceptés, réseaux optionnels."/></div></section>
  </div>
}

function Join({setPage,apps,setApps}){
  const [form,setForm] = useState({name:"",email:"",network:"Aucun",sim:"MSFS",status:"En attente"});
  const [ok,setOk] = useState(false);
  function submit(e){e.preventDefault(); setApps([{...form,id:"APP-"+Date.now().toString().slice(-5)},...apps]); setOk(true);}
  return <div className="auth"><button className="back" onClick={()=>setPage("home")}>← Accueil</button><Logo dark/><form onSubmit={submit} className="authcard"><h1>Rejoindre TigerWing</h1><input required placeholder="Nom / pseudo" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><select value={form.network} onChange={e=>setForm({...form,network:e.target.value})}><option>Aucun</option><option>IVAO</option><option>VATSIM</option><option>IVAO + VATSIM</option></select><select value={form.sim} onChange={e=>setForm({...form,sim:e.target.value})}><option>MSFS</option><option>X-Plane</option><option>Prepar3D</option></select><textarea placeholder="Motivation"></textarea><button className="gold full"><UserPlus size={18}/> Envoyer ma candidature</button>{ok&&<p className="success">Candidature envoyée.</p>}<button type="button" className="link" onClick={()=>setPage("login")}>Déjà un compte</button></form></div>
}

function Login({setPage,login}){
  const [email,setEmail]=useState("pilote@tigerwing.va");
  const [password,setPassword]=useState("tiger123");
  const [err,setErr]=useState("");
  function submit(e){e.preventDefault();try{login(email,password)}catch(x){setErr(x.message)}}
  return <div className="auth"><button className="back" onClick={()=>setPage("home")}>← Accueil</button><Logo dark/><form className="authcard" onSubmit={submit}><h1>Connexion pilote</h1><input value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/>{err&&<p className="error">{err}</p>}<button className="gold full"><LogIn size={18}/> Se connecter</button><div className="demo">pilote@tigerwing.va / tiger123<br/>admin@tigerwing.va / admin123<br/>ceo@tigerwing.va / ceo123</div></form></div>
}

function Dashboard({user,plans}){
  return <section className="page"><div className="welcome">Bienvenue chez TigerWing, {user.name}.</div><div className="stats"><Card title="Vols" value={user.flights}/><Card title="Heures" value={user.hours+"h"}/><Card title="Grade" value={user.rank}/><Card title="Aéroport" value={user.airport}/></div><div className="grid2"><div className="panel profile"><div className="pilot">👨‍✈️</div><h2>{user.callsign}</h2><p>{user.network}</p><div className="bar"><span style={{width:user.xp+"%"}}></span></div></div><div className="panel map"><h2>Opérations VA</h2>{plans.map(p=><div className="flight" key={p.id}><Plane size={16}/><b>{p.callsign}</b><span>{p.dep} → {p.arr}</span></div>)}</div></div></section>
}

function Plans({plans,setPlans,user}){
 const [f,setF]=useState({callsign:"TWG204",dep:"LFPG",arr:"LEMD",aircraft:"A320neo"});
 function add(e){e.preventDefault();setPlans([{...f,id:"FP-"+Date.now(),pilot:user.name,status:"En attente"},...plans]);}
 return <section className="page"><h1>Plans de vol</h1><div className="grid2"><form className="panel form" onSubmit={add}><input value={f.callsign} onChange={e=>setF({...f,callsign:e.target.value.toUpperCase()})}/><input value={f.dep} onChange={e=>setF({...f,dep:e.target.value.toUpperCase()})}/><input value={f.arr} onChange={e=>setF({...f,arr:e.target.value.toUpperCase()})}/><input value={f.aircraft} onChange={e=>setF({...f,aircraft:e.target.value})}/><button className="gold"><Send size={16}/> Envoyer</button></form><Table data={plans}/></div></section>
}
function Table({data}){return <div className="panel"><h2>Liste</h2><table><tbody>{data.map(p=><tr key={p.id}><td>{p.callsign}</td><td>{p.dep} → {p.arr}</td><td>{p.aircraft}</td><td>{p.status}</td></tr>)}</tbody></table></div>}
function Fleet(){return <section className="page"><h1>Flotte officielle</h1><div className="fleet">{fleet.map(([m,r,b,h])=><div className="fleetcard" key={m}><Plane/><span>{b}</span><h2>{m}</h2><p>{r}</p><small>Hub : {h}</small></div>)}</div></section>}
function Grades(){return <section className="page"><h1>Grades</h1><div className="fleet">{["Cadet","First Officer","Captain","Commandant","Executive Captain"].map(g=><div className="fleetcard" key={g}><Award/><h2>{g}</h2><p>Progression TigerWing</p></div>)}</div></section>}
function Leaderboard(){return <section className="page"><h1>Classement</h1><Table data={users.map(u=>({id:u.email,callsign:u.name,dep:u.hours+"h",arr:u.flights+" vols",aircraft:u.rank,status:u.network}))}/></section>}
function Events(){return <section className="page"><h1>Événements</h1><div className="grid3"><Feature icon={<CalendarDays/>} title="Friday Night Ops" text="Paris CDG → Nice"/><Feature icon={<Plane/>} title="Long Courrier Luxe" text="Paris CDG → Dubaï"/><Feature icon={<Users/>} title="Académie débutants" text="Formation et accompagnement"/></div></section>}
function Docs(){return <section className="page"><h1>Documents</h1><div className="grid3"><Feature icon={<Download/>} title="Manuel pilote" text="Procédures TigerWing"/><Feature icon={<BookOpen/>} title="Livrées" text="Pack à venir"/><Feature icon={<Building2/>} title="Discord" text="Communauté officielle"/></div></section>}
function Admin({apps,setApps,plans}){return <section className="page"><h1>Administration</h1><div className="grid2"><div className="panel"><h2>Candidatures</h2>{apps.map(a=><div className="row" key={a.id}><b>{a.name}</b><span>{a.network}</span><button onClick={()=>setApps(apps.map(x=>x.id===a.id?{...x,status:"Acceptée"}:x))}>Accepter</button></div>)}</div><Table data={plans}/></div></section>}
function CEO(){return <section className="page"><h1>Direction générale</h1><div className="stats"><Card title="Contrôle" value="Total"/><Card title="Flotte" value="8"/><Card title="Hubs" value="6"/><Card title="Statut" value="Prêt"/></div><div className="panel"><h2>Stratégie</h2><p>TigerWing : VA francophone premium indépendante, identité unique, sérieuse et accessible.</p></div></section>}
function NoAccess(){return <section className="page"><Lock/><h1>Accès refusé</h1></section>}
function Card({title,value}){return <div className="card"><small>{title}</small><b>{value}</b></div>}
function Feature({icon,title,text}){return <div className="feature">{icon}<h3>{title}</h3><p>{text}</p></div>}

createRoot(document.getElementById("root")).render(<App />);
