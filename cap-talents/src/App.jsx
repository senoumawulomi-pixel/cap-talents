import React, { useState, useEffect } from "react";
import { load } from "./shared";
import Offres from "./pages/Offres";
import Candidater from "./pages/Candidater";
import Connexion from "./pages/Connexion";
import Profil from "./pages/Profil";
import Suivi from "./pages/Suivi";
import Admin from "./pages/Admin";

export default function App() {
  const [db, setDb0] = useState(load);
  const [uid, setUid] = useState(null);
  const [offerId, setOfferId] = useState(null);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState((location.hash || "#offres").slice(1));
  const setDb = (d) => { setDb0(d); try { localStorage.setItem("captalents", JSON.stringify(d)); } catch (e) {} };
  const go = (p) => { location.hash = p; setPage(p); window.scrollTo(0, 0); };
  useEffect(() => { const h = () => setPage((location.hash || "#offres").slice(1)); window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  const toast = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2200); };
  const user = db.users.find(u => u.id === uid) || null;
  const startApply = (id) => { setOfferId(id); go("candidater"); };
  const links = [["offres", "Offres"], ["candidater", "Candidater"], ["profil", "Mon espace"], ["suivi", "Mes candidatures"]];
  if (user && user.role === "admin") links.push(["admin", "Admin"]);
  const P = { db, setDb, user, go, toast };
  return <>
    <header><nav>
      <span className="logo" onClick={() => go("offres")}>Cap Talents</span>
      {links.map(([k, l]) => <button key={k} className={"l " + (page === k ? "on" : "")} onClick={() => go(k)}>{l}</button>)}
      {user ? <button className="btn sm sec" onClick={() => { setUid(null); go("offres"); }}>Déconnexion ({user.name.split(" ")[0]})</button> : <button className="btn sm" onClick={() => go("connexion")}>Connexion</button>}
    </nav></header>
    <main>
      {page === "candidater" ? <Candidater key={offerId} {...P} offerId={offerId} /> :
       page === "connexion" ? <Connexion {...P} setUid={setUid} /> :
       page === "profil" ? <Profil key={uid} {...P} /> :
       page === "suivi" ? <Suivi {...P} /> :
       page === "admin" ? <Admin {...P} /> : <Offres {...P} startApply={startApply} />}
    </main>
    {msg && <div className="toast" role="status">{msg}</div>}
  </>;
}
