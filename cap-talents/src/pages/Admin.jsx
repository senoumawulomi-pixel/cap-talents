import React, { useState, useEffect } from "react";
import { LEVELS, today, Field, statusTag, Track } from "../shared";

export default function Admin({ db, setDb, user, go, toast }) {
  const [tab, setTab] = useState("cand");
  const [flt, setFlt] = useState("tous");
  const [o, setO] = useState({ title: "", dept: "", loc: "", type: "CDI", desc: "" });
  if (!user || user.role !== "admin") return <div className="card">Accès réservé aux administrateurs.</div>;
  const decide = (a, ok) => {
    const note = ok ? "" : (prompt("Motif du refus (facultatif) :") || "");
    const h = { level: a.level, decision: ok ? "Validé" : "Refusé", by: user.name, date: today(), note };
    const upd = ok ? (a.level >= LEVELS.length - 1 ? { status: "acceptee" } : { level: a.level + 1 }) : { status: "rejetee" };
    setDb({ ...db, apps: db.apps.map(x => x.id === a.id ? { ...x, ...upd, history: [...x.history, h] } : x) });
    toast(ok ? "Niveau validé" : "Candidature refusée");
  };
  const addOffer = () => {
    if (!o.title.trim() || !o.dept.trim() || !o.loc.trim()) return toast("Renseignez le titre, le service et le lieu");
    setDb({ ...db, offers: [...db.offers, { ...o, id: Date.now(), open: true }] }); setO({ title: "", dept: "", loc: "", type: "CDI", desc: "" }); toast("Offre publiée");
  };
  const shown = db.apps.filter(a => flt === "tous" || (flt === "rejetee" || flt === "acceptee" ? a.status === flt : a.status === "en_cours" && a.level === Number(flt)));
  const cnt = { total: db.apps.length, cours: db.apps.filter(a => a.status === "en_cours").length, ok: db.apps.filter(a => a.status === "acceptee").length, offres: db.offers.filter(x => x.open).length };
  const name = id => (db.users.find(u => u.id === id) || { name: "Supprimé" }).name;
  return <>
    <h1>Administration</h1>
    <div className="stats">
      <div className="card"><b>{cnt.total}</b>candidatures</div><div className="card"><b>{cnt.cours}</b>en cours de validation</div>
      <div className="card"><b>{cnt.ok}</b>acceptées</div><div className="card"><b>{cnt.offres}</b>offres ouvertes</div>
    </div>
    <div className="tabs">{[["cand", "Candidatures"], ["offres", "Offres"], ["users", "Utilisateurs"]].map(([k, l]) => <button key={k} className={"btn sm " + (tab === k ? "" : "sec")} onClick={() => setTab(k)}>{l}</button>)}</div>
    {tab === "cand" && <div className="card">
      <div className="f" style={{ maxWidth: 260 }}><select aria-label="Filtrer" value={flt} onChange={e => setFlt(e.target.value)}><option value="tous">Toutes</option>{LEVELS.map((l, i) => <option key={l} value={i}>À valider : {l}</option>)}<option value="acceptee">Acceptées</option><option value="rejetee">Refusées</option></select></div>
      <div className="scroll"><table><thead><tr><th>Candidat</th><th>Offre</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
        {shown.map(a => <tr key={a.id}><td>{name(a.userId)}<div className="mut">{a.exp} · {a.cv}</div></td>
          <td>{(db.offers.find(x => x.id === a.offerId) || {}).title || "—"}</td><td>{statusTag(a)}</td>
          <td>{a.status === "en_cours" ? <div className="row"><button className="btn sm" onClick={() => decide(a, true)}>{a.level === 2 ? "Accepter" : "Valider"}</button><button className="btn bad sm" onClick={() => decide(a, false)}>Refuser</button></div> : <span className="mut">Clôturée</span>}</td></tr>)}
        {shown.length === 0 && <tr><td colSpan="4" className="mut">Aucune candidature dans cette vue.</td></tr>}
      </tbody></table></div></div>}
    {tab === "offres" && <>
      <div className="card" style={{ marginBottom: 14 }}><h3>Publier une offre</h3>
        <div className="two"><Field label="Titre"><input value={o.title} onChange={e => setO({ ...o, title: e.target.value })} /></Field><Field label="Service"><input value={o.dept} onChange={e => setO({ ...o, dept: e.target.value })} /></Field>
        <Field label="Lieu"><input value={o.loc} onChange={e => setO({ ...o, loc: e.target.value })} /></Field><Field label="Contrat"><select value={o.type} onChange={e => setO({ ...o, type: e.target.value })}><option>CDI</option><option>CDD</option><option>Stage</option><option>Alternance</option></select></Field></div>
        <Field label="Description"><textarea rows="3" value={o.desc} onChange={e => setO({ ...o, desc: e.target.value })} /></Field>
        <button className="btn" onClick={addOffer}>Publier l’offre</button></div>
      <div className="card scroll"><table><thead><tr><th>Offre</th><th>État</th><th>Actions</th></tr></thead><tbody>
        {db.offers.map(x => <tr key={x.id}><td>{x.title}<div className="mut">{x.dept} · {x.loc} · {x.type}</div></td><td>{x.open ? <span className="tag o">Ouverte</span> : <span className="tag">Fermée</span>}</td>
          <td><div className="row"><button className="btn sec sm" onClick={() => setDb({ ...db, offers: db.offers.map(y => y.id === x.id ? { ...y, open: !y.open } : y) })}>{x.open ? "Fermer" : "Rouvrir"}</button>
          <button className="btn bad sm" onClick={() => { if (confirm("Supprimer cette offre et ses candidatures ?")) setDb({ ...db, offers: db.offers.filter(y => y.id !== x.id), apps: db.apps.filter(a => a.offerId !== x.id) }); }}>Supprimer</button></div></td></tr>)}
      </tbody></table></div></>}
    {tab === "users" && <div className="card scroll"><table><thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Compte</th></tr></thead><tbody>
      {db.users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
        <td>{u.id === user.id ? <span className="mut">Vous</span> : <button className={"btn sm " + (u.blocked ? "sec" : "bad")} onClick={() => setDb({ ...db, users: db.users.map(x => x.id === u.id ? { ...x, blocked: !x.blocked } : x) })}>{u.blocked ? "Réactiver" : "Suspendre"}</button>}</td></tr>)}
    </tbody></table></div>}
  </>;
}
