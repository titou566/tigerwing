import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Plane, ShieldCheck, Globe2, Users, Trophy, CalendarDays, Gauge, MapPin,
  Send, CheckCircle2, Clock3, FileText, Bell, Settings, ClipboardCheck,
  Star, RadioTower, Download, MessageCircle, Crown, Compass, BookOpen,
  Flag, LogIn, LogOut, UserPlus, Lock, Menu, X, Award, BarChart3, Sparkles,
  Route, BriefcaseBusiness, Building2, Rocket, Check, ChevronRight, Mail,
  UserCircle, Eye, Database, Megaphone, SlidersHorizontal, Search, Filter,
  LayoutDashboard, MapPinned, Medal, Wrench, Activity, Zap
} from "lucide-react";
import "./style.css";

const USERS = [
  { email:"pilote@tigerwing.va", password:"tiger123", role:"pilote", name:"Antoine Martin", callsign:"TWG1896", network:"IVAO + VATSIM", ivaoId:"586421", vatsimCid:"1542001", country:"France", hours:42, flights:18, rank:"First Officer", xp:38, currentAirport:"LFLL", status:"Actif" },
  { email:"admin@tigerwing.va", password:"admin123", role:"admin", name:"Julie Moreau", callsign:"TWG900", network:"IVAO", ivaoId:"671201", vatsimCid:"", country:"France", hours:210, flights:81, rank:"Commandant", xp:74, currentAirport:"LFPG", status:"Staff" },
  { email:"ceo@tigerwing.va", password:"ceo123", role:"ceo", name:"Alexandre Leroy", callsign:"TWG001", network:"Aucun", ivaoId:"", vatsimCid:"", country:"France", hours:980, flights:412, rank:"Executive Captain", xp:100, currentAirport:"LFPG", status:"CEO" }
];

const FLEET = [
  { model:"A220-300", role:"Régional premium", range:"3 400 NM", seats:"135", maker:"Airbus", hub:"Lyon", tag:"Court-courrier élégant" },
  { model:"A320neo", role:"Cœur européen", range:"3 500 NM", seats:"180", maker:"Airbus", hub:"Paris CDG", tag:"Avion principal" },
  { model:"A321neo", role:"Europe haute capacité", range:"4 000 NM", seats:"220", maker:"Airbus", hub:"Nice", tag:"Moyen-courrier premium" },
  { model:"A330neo", role:"Long-courrier confort", range:"7 200 NM", seats:"287", maker:"Airbus", hub:"Montréal", tag:"Long-courrier souple" },
  { model:"A350-900", role:"Flagship luxe", range:"8 100 NM", seats:"325", maker:"Airbus", hub:"Paris CDG", tag:"Vaisseau amiral" },
  { model:"B737-8", role:"Réseau flexible", range:"3 550 NM", seats:"178", maker:"Boeing", hub:"Genève", tag:"Moderne et efficace" },
  { model:"B777-300ER", role:"Long-courrier lourd", range:"7 370 NM", seats:"396", maker:"Boeing", hub:"Dubaï", tag:"Routes prestige" },
  { model:"B787-9", role:"Dreamliner premium", range:"7 635 NM", seats:"290", maker:"Boeing", hub:"Paris CDG", tag:"International moderne" }
];

const DEFAULT_APPLICATIONS = [
  { id:"APP-001", name:"Lucas M", email:"lucas@example.com", country:"France", network:"Aucun", ivaoId:"", vatsimCid:"", simulator:"MSFS", experience:"Débutant", motivation:"Je veux progresser dans une VA propre et active.", status:"En attente" },
  { id:"APP-002", name:"Nina R", email:"nina@example.com", country:"Belgique", network:"VATSIM", ivaoId:"", vatsimCid:"1628890", simulator:"X-Plane", experience:"Intermédiaire", motivation:"Je cherche une VA premium avec des events réguliers.", status:"En attente" },
  { id:"APP-003", name:"Mathis D", email:"mathis@example.com", country:"Suisse", network:"IVAO + VATSIM", ivaoId:"672110", vatsimCid:"1588221", simulator:"MSFS", experience:"Confirmé", motivation:"Je souhaite rejoindre une communauté francophone ambitieuse.", status:"Acceptée" }
];

const DEFAULT_PLANS = [
  { id:"FP-1001", callsign:"TWG204", pilot:"Antoine Martin", departure:"LFPG", arrival:"LEMD", aircraft:"A320neo", route:"OKASI UN860 PPN", status:"Accepté", progress:55, date:"2026-05-01" },
  { id:"FP-1002", callsign:"TWG711", pilot:"Julie Moreau", departure:"EGLL", arrival:"LFPG", aircraft:"B737-8", route:"DVR UL9 BUBLI", status:"Terminé", progress:100, date:"2026-04-28" },
  { id:"FP-1003", callsign:"TWG350", pilot:"Alexandre Leroy", departure:"LFPG", arrival:"OMDB", aircraft:"A350-900", route:"MOPAR UL607 RESMI UM728", status:"Programmé", progress:0, date:"2026-05-03" },
  { id:"FP-1004", callsign:"TWG787", pilot:"Nina R", departure:"CYUL", arrival:"LFPG", aircraft:"B787-9", route:"MIVOK NAT GINGA", status:"Accepté", progress:22, date:"2026-05-04" }
];

const EVENTS = [
  { title:"Friday Night Ops", date:"Vendredi 21:00", route:"Paris CDG → Nice", aircraft:"A320neo / B737-8", type:"Vol de groupe" },
  { title:"Luxury Long Haul", date:"Dimanche 18:30", route:"Paris CDG → Dubaï", aircraft:"A350 / B777", type:"Long courrier" },
  { title:"Académie débutants", date:"Mercredi 20:30", route:"Tour de piste LFLL", aircraft:"Libre", type:"Formation" },
  { title:"Découverte Europe", date:"Samedi 16:00", route:"Lyon → Genève → Nice", aircraft:"A220 / ATR", type:"Tour" }
];

const LEADERBOARD = [
  { name:"Alexandre Leroy", hours:980, flights:412, rank:"Executive Captain", network:"Aucun" },
  { name:"Julie Moreau", hours:210, flights:81, rank:"Commandant", network:"IVAO" },
  { name:"Antoine Martin", hours:42, flights:18, rank:"First Officer", network:"IVAO + VATSIM" },
  { name:"Nina R", hours:31, flights:14, rank:"Cadet", network:"VATSIM" },
  { name:"Lucas M", hours:8, flights:4, rank:"Cadet", network:"Aucun" }
];

const GRADES = [
  { title:"Cadet", req:"0h", perks:"Accès aux vols courts" },
  { title:"First Officer", req:"25h", perks:"Moyen-courrier" },
  { title:"Senior First Officer", req:"75h", perks:"Events avancés" },
  { title:"Captain", req:"150h", perks:"Long-courrier" },
  { title:"Senior Captain", req:"300h", perks:"Flagship routes" },
  { title:"Commandant", req:"500h", perks:"Mentorat" },
  { title:"Executive Captain", req:"900h", perks:"Prestige + staff" }
];

const HUBS = ["Paris CDG", "Lyon", "Nice", "Genève", "Montréal", "Dubaï"];

function readStorage(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function writeStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
function canAdmin(user){ return user?.role === "admin" || user?.role === "ceo"; }
function canCEO(user){ return user?.role === "ceo"; }

function App(){
  const [page, setPage] = useState("accueil");
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem("tw_launch_user") || "null"));
  const [menu, setMenu] = useState(false);
  const [apps, setApps] = useState(()=>readStorage("tw_launch_apps", DEFAULT_APPLICATIONS));
  const [plans, setPlans] = useState(()=>readStorage("tw_launch_plans", DEFAULT_PLANS));
  const [announcement, setAnnouncement] = useState("Bienvenue chez TigerWing — lancement officiel prochainement.");

  function login(email,password){
    const found = USERS.find(u => u.email === email && u.password === password);
    if(!found) throw new Error("Email ou mot de passe incorrect.");
    setUser(found);
    localStorage.setItem("tw_launch_user", JSON.stringify(found));
    setPage("tableau");
  }
  function logout(){
    setUser(null);
    localStorage.removeItem("tw_launch_user");
    setPage("accueil");
  }
  function submitApplication(app){
    const next = [{...app, id:"APP-"+Date.now().toString().slice(-5), status:"En attente"}, ...apps];
    setApps(next); writeStorage("tw_launch_apps", next);
  }
  function updateApplication(id,status){
    const next = apps.map(a => a.id === id ? {...a,status} : a);
    setApps(next); writeStorage("tw_launch_apps", next);
  }
  function addPlan(plan){
    const next = [{...plan, id:"FP-"+Date.now().toString().slice(-5), pilot:user?.name || "Invité", status:"En attente", progress:0, date:new Date().toISOString().slice(0,10)}, ...plans];
    setPlans(next); writeStorage("tw_launch_plans", next);
  }
  function updatePlan(id, patch){
    const next = plans.map(p => p.id === id ? {...p, ...patch} : p);
    setPlans(next); writeStorage("tw_launch_plans", next);
  }

  if(page === "accueil") return <PublicHome setPage={setPage}/>;
  if(page === "rejoindre") return <JoinPage setPage={setPage} submitApplication={submitApplication}/>;
  if(page === "connexion") return <LoginPage setPage={setPage} login={login}/>;

  return (
    <div className="appShell">
      <Sidebar user={user} page={page} setPage={setPage} open={menu} setOpen={setMenu}/>
      <main className="main">
        <Topbar user={user} logout={logout} setOpen={setMenu}/>
        {!user ? <Locked setPage={setPage}/> : (
          <>
            {page === "tableau" && <Dashboard user={user} plans={plans} announcement={announcement}/>}
            {page === "profil" && <Profile user={user}/>}
            {page === "plans" && <Plans user={user} plans={plans} addPlan={addPlan}/>}
            {page === "flotte" && <Fleet/>}
            {page === "grades" && <Grades/>}
            {page === "classement" && <Leaderboard/>}
            {page === "evenements" && <Events/>}
            {page === "documents" && <Documents/>}
            {page === "admin" && <AdminCenter user={user} apps={apps} plans={plans} updateApplication={updateApplication} updatePlan={updatePlan}/>}
            {page === "pilotes" && <PilotsAdmin user={user}/>}
            {page === "direction" && <CEOBoard user={user} announcement={announcement} setAnnouncement={setAnnouncement}/>}
            {page === "parametres" && <SettingsPage user={user}/>}
          </>
        )}
      </main>
    </div>
  );
}

function Logo({dark=false}){
  return <div className={dark ? "logo dark" : "logo"}><span></span><b>TIGERWING</b></div>;
}

function PublicHome({setPage}){
  return (
    <div className="public">
      <nav className="publicNav">
        <Logo/>
        <div className="publicLinks">
          <button>Accueil</button>
          <button>Flotte</button>
          <button>Hubs</button>
          <button>Événements</button>
          <button>Communauté</button>
        </div>
        <div className="publicActions">
          <button className="ghost" onClick={()=>setPage("connexion")}>Connexion</button>
          <button className="gold" onClick={()=>setPage("rejoindre")}>Rejoindre la flotte</button>
        </div>
      </nav>

      <section className="hero">
        <div className="heroText">
          <div className="eyebrow"><Sparkles size={16}/> Compagnie virtuelle premium indépendante</div>
          <h1>L’excellence de l’aviation virtuelle.</h1>
          <p>
            TigerWing est une VA francophone premium, indépendante d’IVAO et VATSIM,
            mais ouverte aux pilotes de tous réseaux. Sérieuse, élégante, accessible,
            et pensée pour créer une vraie communauté.
          </p>
          <div className="heroButtons">
            <button className="gold big" onClick={()=>setPage("rejoindre")}>Créer ma candidature</button>
            <button className="glass big" onClick={()=>setPage("connexion")}>Accès pilote</button>
          </div>
          <div className="networkPills">
            <span>IVAO</span><span>VATSIM</span><span>Les deux</span><span>Aucun réseau requis</span>
          </div>
        </div>
        <div className="heroVisual">
          <div className="radar"></div>
          <Plane className="heroPlane"/>
          <div className="flightChip c1"><b>TWG350</b><small>Paris CDG → Dubaï</small></div>
          <div className="flightChip c2"><b>TWG787</b><small>Montréal → Paris</small></div>
          <div className="flightChip c3"><b>A350-900</b><small>Flagship premium</small></div>
        </div>
      </section>

      <section className="publicStats">
        <MiniStat value="250+" label="Objectif pilotes"/>
        <MiniStat value="8" label="Avions officiels"/>
        <MiniStat value="6" label="Hubs premium"/>
        <MiniStat value="12" label="Events mensuels"/>
      </section>

      <section className="section white">
        <div className="sectionHead">
          <h2>Une VA sérieuse, mais accessible</h2>
          <p>Tu peux rejoindre TigerWing même sans réseau IVAO/VATSIM. Le but est d’apprendre, voler, progresser et participer à une communauté propre.</p>
        </div>
        <div className="cards3">
          <Feature icon={<ShieldCheck/>} title="Structure premium" text="Grades, dashboard, staff, validations, events et identité forte."/>
          <Feature icon={<Rocket/>} title="Débutants acceptés" text="Tu peux démarrer sans réseau, puis progresser vers IVAO/VATSIM si tu veux."/>
          <Feature icon={<Crown/>} title="Style compagnie réelle" text="Air France premium + prestige international, sans tomber dans le gaming cheap."/>
        </div>
      </section>

      <section className="section darkBlock">
        <div className="sectionHead">
          <h2>Flotte officielle TigerWing</h2>
          <p>Un mix Airbus/Boeing crédible : Europe, régional, long courrier, prestige.</p>
        </div>
        <div className="fleetPreview">
          {FLEET.map(a => <div key={a.model}><b>{a.model}</b><small>{a.role}</small></div>)}
        </div>
      </section>

      <section className="section white">
        <div className="sectionHead">
          <h2>Hubs & opérations</h2>
          <p>Un réseau pensé pour être réaliste et attractif dès le lancement.</p>
        </div>
        <div className="hubGrid">{HUBS.map(h => <div className="hub" key={h}><Building2/><b>{h}</b></div>)}</div>
      </section>
    </div>
  );
}

function MiniStat({value,label}){ return <div className="miniStat"><b>{value}</b><span>{label}</span></div>; }
function Feature({icon,title,text}){ return <div className="feature">{icon}<h3>{title}</h3><p>{text}</p></div>; }

function JoinPage({setPage, submitApplication}){
  const [form,setForm] = useState({name:"", email:"", country:"France", network:"Aucun", ivaoId:"", vatsimCid:"", simulator:"MSFS", experience:"Débutant", motivation:""});
  const [done,setDone] = useState(false);
  const needsIVAO = form.network === "IVAO" || form.network === "IVAO + VATSIM";
  const needsVATSIM = form.network === "VATSIM" || form.network === "IVAO + VATSIM";
  function change(k,v){ setForm({...form,[k]:v}); }
  function submit(e){ e.preventDefault(); submitApplication(form); setDone(true); }

  return (
    <div className="authPage">
      <button className="backBtn" onClick={()=>setPage("accueil")}>← Accueil</button>
      <Logo dark/>
      <form className="authCard wide" onSubmit={submit}>
        <h1>Rejoindre TigerWing</h1>
        <p>Remplis ta candidature pilote. IVAO/VATSIM ne sont pas obligatoires.</p>
        <div className="two">
          <Field label="Nom / pseudo pilote" value={form.name} onChange={v=>change("name",v)} required/>
          <Field label="Email" value={form.email} onChange={v=>change("email",v)} required/>
        </div>
        <div className="two">
          <label>Pays
            <select value={form.country} onChange={e=>change("country",e.target.value)}>
              <option>France</option><option>Belgique</option><option>Suisse</option><option>Canada</option><option>Autre</option>
            </select>
          </label>
          <label>Réseau utilisé
            <select value={form.network} onChange={e=>change("network",e.target.value)}>
              <option>Aucun</option><option>IVAO</option><option>VATSIM</option><option>IVAO + VATSIM</option>
            </select>
          </label>
        </div>
        {(needsIVAO || needsVATSIM) && (
          <div className="two">
            {needsIVAO && <Field label="ID IVAO" value={form.ivaoId} onChange={v=>change("ivaoId",v)}/>}
            {needsVATSIM && <Field label="CID VATSIM" value={form.vatsimCid} onChange={v=>change("vatsimCid",v)}/>}
          </div>
        )}
        <div className="two">
          <label>Simulateur principal
            <select value={form.simulator} onChange={e=>change("simulator",e.target.value)}>
              <option>MSFS</option><option>X-Plane</option><option>Prepar3D</option><option>Autre</option>
            </select>
          </label>
          <label>Expérience
            <select value={form.experience} onChange={e=>change("experience",e.target.value)}>
              <option>Débutant</option><option>Intermédiaire</option><option>Confirmé</option><option>Expert</option>
            </select>
          </label>
        </div>
        <label>Motivation
          <textarea value={form.motivation} onChange={e=>change("motivation",e.target.value)} placeholder="Pourquoi veux-tu rejoindre TigerWing ?"/>
        </label>
        <div className="accept"><Check size={18}/> J’accepte le règlement TigerWing et je comprends que la VA est indépendante.</div>
        <button className="gold full"><UserPlus size={18}/> Envoyer ma candidature</button>
        {done && <div className="success"><CheckCircle2/> Candidature envoyée. Elle est visible dans l’espace admin.</div>}
        <button type="button" className="linkBtn" onClick={()=>setPage("connexion")}>J’ai déjà un compte</button>
      </form>
    </div>
  );
}
function Field({label,value,onChange,required}){ return <label>{label}{required ? " *" : ""}<input value={value} onChange={e=>onChange(e.target.value)} required={required}/></label>; }

function LoginPage({setPage, login}){
  const [email,setEmail] = useState("pilote@tigerwing.va");
  const [password,setPassword] = useState("tiger123");
  const [err,setErr] = useState("");
  function submit(e){ e.preventDefault(); setErr(""); try{ login(email,password); } catch(error){ setErr(error.message); } }
  return (
    <div className="authPage loginBg">
      <button className="backBtn" onClick={()=>setPage("accueil")}>← Accueil</button>
      <Logo dark/>
      <form className="authCard" onSubmit={submit}>
        <h1>Connexion pilote</h1>
        <p>Accède à ton espace TigerWing.</p>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {err && <div className="error">{err}</div>}
        <button className="gold full"><LogIn size={18}/> Se connecter</button>
        <button type="button" className="linkBtn" onClick={()=>setPage("rejoindre")}>Créer une candidature</button>
        <div className="demo">
          pilote@tigerwing.va / tiger123<br/>
          admin@tigerwing.va / admin123<br/>
          ceo@tigerwing.va / ceo123
        </div>
      </form>
    </div>
  );
}

function Sidebar({user,page,setPage,open,setOpen}){
  const pilotItems = [
    ["tableau","Tableau de bord",LayoutDashboard],
    ["profil","Mon profil",UserCircle],
    ["plans","Plans de vol",FileText],
    ["flotte","Flotte",Plane],
    ["grades","Grades",Award],
    ["classement","Classement",Trophy],
    ["evenements","Événements",CalendarDays],
    ["documents","Documents",BookOpen]
  ];
  const adminItems = [
    ["admin","Administration",ShieldCheck],
    ["pilotes","Gestion pilotes",Users]
  ];
  const ceoItems = [
    ["direction","Direction générale",Crown],
    ["parametres","Paramètres VA",Settings]
  ];
  return (
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="sideLogo"><Logo dark/></div>
      <div className="sideSection">Pilote</div>
      {pilotItems.map(([id,label,Icon]) => <NavButton key={id} id={id} label={label} Icon={Icon} page={page} setPage={setPage} setOpen={setOpen}/>)}
      {canAdmin(user) && <div className="sideSection">Admin</div>}
      {canAdmin(user) && adminItems.map(([id,label,Icon]) => <NavButton key={id} id={id} label={label} Icon={Icon} page={page} setPage={setPage} setOpen={setOpen}/>)}
      {canCEO(user) && <div className="sideSection">CEO</div>}
      {canCEO(user) && ceoItems.map(([id,label,Icon]) => <NavButton key={id} id={id} label={label} Icon={Icon} page={page} setPage={setPage} setOpen={setOpen}/>)}
      <div className="discordBox">
        <MessageCircle/>
        <b>Discord TigerWing</b>
        <p>Ajoute ton lien Discord officiel ici.</p>
      </div>
    </aside>
  );
}
function NavButton({id,label,Icon,page,setPage,setOpen}){
  return <button className={page === id ? "navItem active" : "navItem"} onClick={()=>{setPage(id);setOpen(false)}}><Icon size={21}/><span>{label}</span></button>;
}
function Topbar({user,logout,setOpen}){
  return (
    <header className="topbar">
      <button className="mobileMenu" onClick={()=>setOpen(true)}><Menu/></button>
      <b>TigerWing Crew Center</b>
      <div className="topRight">
        <Bell size={20}/>
        <div className="avatar">✈</div>
        <div className="userText"><b>{user.name}</b><small>{user.rank} · {user.role.toUpperCase()}</small></div>
        <button className="logout" onClick={logout}><LogOut size={16}/> Déconnexion</button>
      </div>
    </header>
  );
}
function Locked({setPage}){
  return <div className="locked"><Lock size={58}/><h1>Connexion requise</h1><p>Connecte-toi pour accéder au Crew Center.</p><button className="gold" onClick={()=>setPage("connexion")}>Connexion</button></div>;
}

function Dashboard({user,plans,announcement}){
  const myPlans = user.role === "pilote" ? plans.filter(p => p.pilot === user.name) : plans;
  return (
    <div className="page">
      <div className="welcome"><Sparkles/> {announcement}</div>
      <div className="statGrid">
        <DashStat icon={<Plane/>} label="Vols" value={user.flights}/>
        <DashStat icon={<Clock3/>} label="Heures de vol" value={`${user.hours}h`}/>
        <DashStat icon={<Trophy/>} label="Grade" value={user.rank}/>
        <DashStat icon={<MapPin/>} label="Aéroport actuel" value={user.currentAirport}/>
      </div>
      <div className="dashGrid">
        <div className="panel profile">
          <div className="captain">👨‍✈️</div>
          <div>
            <h2>{user.callsign}</h2>
            <p>{user.name}</p>
            <div className="chips"><span>{user.network}</span><span>{user.country}</span><span>{user.status}</span></div>
            <div className="progress"><span style={{width:user.xp+"%"}}></span></div>
            <small>{user.xp}% vers le prochain grade</small>
          </div>
        </div>
        <div className="panel routeMap">
          <h2>Opérations live VA</h2>
          <div className="fakeMap">
            {plans.slice(0,4).map((p,i)=><div className={"mapFlight mf"+i} key={p.id}><Plane size={18}/><b>{p.callsign}</b><small>{p.departure} → {p.arrival}</small></div>)}
          </div>
        </div>
        <TableCard title="Plans de vol récents">
          <table><thead><tr><th>Vol</th><th>Route</th><th>Avion</th><th>Statut</th></tr></thead><tbody>{myPlans.map(p=><tr key={p.id}><td>{p.callsign}</td><td>{p.departure} → {p.arrival}</td><td>{p.aircraft}</td><td><Status s={p.status}/></td></tr>)}</tbody></table>
        </TableCard>
        <div className="panel badges">
          <h2>Badges</h2>
          <div><Badge title="Premier vol"/><Badge title="Pilote événement"/><Badge title="Long-courrier"/><Badge title="Explorateur"/></div>
        </div>
      </div>
    </div>
  );
}
function DashStat({icon,label,value}){ return <div className="dashStat"><div>{icon}</div><span>{label}</span><b>{value}</b></div>; }
function Badge({title}){ return <span className="badgeItem"><Star size={16}/>{title}</span>; }

function Profile({user}){
  return <div className="page"><h1>Mon profil</h1><div className="profileGrid"><div className="panel bigProfile"><div className="captain huge">👨‍✈️</div><h2>{user.name}</h2><p>{user.callsign}</p><div className="chips center"><span>{user.network}</span><span>{user.country}</span><span>{user.rank}</span></div></div><TableCard title="Informations pilote"><table><tbody><tr><td>Email</td><td>{user.email}</td></tr><tr><td>Rôle</td><td>{user.role}</td></tr><tr><td>IVAO</td><td>{user.ivaoId || "Non renseigné"}</td></tr><tr><td>VATSIM</td><td>{user.vatsimCid || "Non renseigné"}</td></tr><tr><td>Statut</td><td>{user.status}</td></tr></tbody></table></TableCard></div></div>;
}

function Plans({user,plans,addPlan}){
  const [form,setForm] = useState({callsign:"TWG204", departure:"LFPG", arrival:"LEMD", aircraft:"A320neo", route:"OKASI UN860 PPN"});
  const [ok,setOk] = useState(false);
  function change(k,v){ setForm({...form,[k]:v.toUpperCase ? v.toUpperCase() : v});}
  function submit(e){ e.preventDefault(); addPlan(form); setOk(true); }
  const shown = user.role === "pilote" ? plans.filter(p => p.pilot === user.name) : plans;
  return <div className="page"><h1>Plans de vol</h1><div className="twoCols"><form className="panel form" onSubmit={submit}><h2>Déposer un plan</h2><div className="two"><input value={form.callsign} onChange={e=>change("callsign",e.target.value)} placeholder="Callsign"/><input value={form.aircraft} onChange={e=>change("aircraft",e.target.value)} placeholder="Avion"/></div><div className="two"><input value={form.departure} onChange={e=>change("departure",e.target.value)} placeholder="Départ"/><input value={form.arrival} onChange={e=>change("arrival",e.target.value)} placeholder="Arrivée"/></div><textarea value={form.route} onChange={e=>change("route",e.target.value)} placeholder="Route / remarques"/><button className="gold"><Send size={18}/> Envoyer</button>{ok && <div className="success"><CheckCircle2/> Plan ajouté.</div>}</form><TableCard title="Mes plans"><table><thead><tr><th>Callsign</th><th>Pilote</th><th>Route</th><th>Statut</th></tr></thead><tbody>{shown.map(p=><tr key={p.id}><td>{p.callsign}</td><td>{p.pilot}</td><td>{p.departure} → {p.arrival}</td><td><Status s={p.status}/></td></tr>)}</tbody></table></TableCard></div></div>;
}

function Fleet(){
  return <div className="page"><div className="titleRow"><h1>Flotte officielle</h1><p>Airbus élégant + Boeing prestige. Une flotte crédible pour attirer tous les profils de pilotes.</p></div><div className="fleetGrid">{FLEET.map(a=><div className="fleetCard" key={a.model}><div className="fleetTop"><Plane/><span>{a.maker}</span></div><h2>{a.model}</h2><p>{a.role}</p><div className="fleetMeta"><span>{a.range}</span><span>{a.seats} sièges</span><span>{a.hub}</span></div><b>{a.tag}</b></div>)}</div></div>;
}
function Grades(){ return <div className="page"><h1>Grades & progression</h1><div className="gradeLine">{GRADES.map(g=><div className="grade" key={g.title}><Crown/><b>{g.title}</b><small>{g.req}</small><p>{g.perks}</p></div>)}</div></div>; }
function Leaderboard(){ return <div className="page"><h1>Classement pilotes</h1><TableCard title="Top pilotes"><table><thead><tr><th>#</th><th>Pilote</th><th>Heures</th><th>Vols</th><th>Grade</th><th>Réseau</th></tr></thead><tbody>{LEADERBOARD.map((p,i)=><tr key={p.name}><td>{i+1}</td><td>{p.name}</td><td>{p.hours}h</td><td>{p.flights}</td><td>{p.rank}</td><td>{p.network}</td></tr>)}</tbody></table></TableCard></div>; }
function Events(){ return <div className="page"><h1>Événements</h1><div className="cards3">{EVENTS.map(e=><div className="eventCard" key={e.title}><CalendarDays/><h2>{e.title}</h2><p>{e.route}</p><div className="chips"><span>{e.date}</span><span>{e.aircraft}</span><span>{e.type}</span></div></div>)}</div></div>; }
function Documents(){ return <div className="page"><h1>Documents & téléchargements</h1><div className="cards3"><Doc title="Manuel pilote" text="Règles, procédures et fonctionnement TigerWing."/><Doc title="Livrées" text="Pack liveries MSFS/X-Plane à ajouter."/><Doc title="Discord" text="Guide de la communauté et salons officiels."/><Doc title="ACARS" text="Prévu pour la version connectée."/></div></div>; }
function Doc({title,text}){ return <div className="eventCard"><Download/><h2>{title}</h2><p>{text}</p></div>; }

function AdminCenter({user,apps,plans,updateApplication,updatePlan}){
  if(!canAdmin(user)) return <NoAccess/>;
  return <div className="page"><h1>Centre administration</h1><div className="statGrid"><DashStat icon={<Users/>} label="Candidatures" value={apps.length}/><DashStat icon={<ClipboardCheck/>} label="En attente" value={apps.filter(a=>a.status==="En attente").length}/><DashStat icon={<Plane/>} label="Plans de vol" value={plans.length}/><DashStat icon={<ShieldCheck/>} label="Rôle" value={user.role}/></div><div className="twoCols"><TableCard title="Candidatures pilotes"><table><thead><tr><th>Nom</th><th>Réseau</th><th>Simu</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{apps.map(a=><tr key={a.id}><td>{a.name}<br/><small>{a.email}</small></td><td>{a.network}<br/><small>{a.ivaoId || a.vatsimCid || "Aucun ID"}</small></td><td>{a.simulator}<br/><small>{a.experience}</small></td><td>{a.status}</td><td><button onClick={()=>updateApplication(a.id,"Acceptée")}>Accepter</button><button onClick={()=>updateApplication(a.id,"Refusée")}>Refuser</button></td></tr>)}</tbody></table></TableCard><TableCard title="Validation des plans"><table><thead><tr><th>Vol</th><th>Pilote</th><th>Statut</th><th>Action</th></tr></thead><tbody>{plans.map(p=><tr key={p.id}><td>{p.callsign}<br/><small>{p.departure} → {p.arrival}</small></td><td>{p.pilot}</td><td>{p.status}</td><td><button onClick={()=>updatePlan(p.id,{status:"Accepté"})}>Valider</button><button onClick={()=>updatePlan(p.id,{status:"Refusé"})}>Refuser</button></td></tr>)}</tbody></table></TableCard></div></div>;
}
function PilotsAdmin({user}){
  if(!canAdmin(user)) return <NoAccess/>;
  return <div className="page"><h1>Gestion pilotes</h1><TableCard title="Membres TigerWing"><table><thead><tr><th>Nom</th><th>Callsign</th><th>Rôle</th><th>Grade</th><th>Réseau</th></tr></thead><tbody>{USERS.map(u=><tr key={u.email}><td>{u.name}</td><td>{u.callsign}</td><td>{u.role}</td><td>{u.rank}</td><td>{u.network}</td></tr>)}</tbody></table></TableCard></div>;
}
function CEOBoard({user,announcement,setAnnouncement}){
  if(!canCEO(user)) return <NoAccess/>;
  return <div className="page"><h1>Direction générale</h1><div className="statGrid"><DashStat icon={<Crown/>} label="Contrôle" value="Total"/><DashStat icon={<Database/>} label="Flotte" value={FLEET.length}/><DashStat icon={<Building2/>} label="Hubs" value={HUBS.length}/><DashStat icon={<Activity/>} label="Statut" value="Prêt"/></div><div className="twoCols"><div className="panel form"><h2>Annonce globale</h2><textarea value={announcement} onChange={e=>setAnnouncement(e.target.value)} /><div className="success">Annonce mise à jour dans le tableau de bord.</div></div><TableCard title="Stratégie TigerWing"><table><tbody><tr><td>Positionnement</td><td>VA francophone premium indépendante</td></tr><tr><td>Style</td><td>Air France luxe + prestige international</td></tr><tr><td>Objectif</td><td>Attirer pilotes débutants et confirmés</td></tr><tr><td>Discord</td><td>Communauté centrale</td></tr></tbody></table></TableCard></div></div>;
}
function SettingsPage({user}){
  if(!canCEO(user)) return <NoAccess/>;
  return <div className="page"><h1>Paramètres VA</h1><div className="cards3"><Feature icon={<SlidersHorizontal/>} title="Identité" text="TigerWing — L’excellence de l’aviation virtuelle."/><Feature icon={<Route/>} title="Réseau" text="Hubs premium : Paris, Nice, Lyon, Genève, Montréal, Dubaï."/><Feature icon={<Wrench/>} title="Technique" text="Prêt à connecter à Supabase, Discord OAuth et ACARS."/></div></div>;
}
function NoAccess(){ return <div className="locked"><Lock size={56}/><h1>Accès refusé</h1><p>Cette section est réservée à un rôle supérieur.</p></div>; }

function TableCard({title,children}){ return <div className="panel tableCard"><h2>{title}</h2>{children}</div>; }
function Status({s}){ return <span className={"status "+s.toLowerCase().replace("é","e").replace(" ","-")}>{s}</span>; }

createRoot(document.getElementById("root")).render(<App/>);
