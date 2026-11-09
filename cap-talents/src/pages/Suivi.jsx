import React, { useState, useEffect } from "react";
import { LEVELS, today, Field, statusTag, Track } from "../shared";

export default function Suivi({ db, setDb, user, go, toast }) {
  if (!user) return <div className="card">Connectez-vous pour suivre vos candidatures. <button className="btn sm" onClick={() => go("connexion")}>Se connecter</button></div>;
  const mine = db.apps.filter(a => a.userId === user.id);
  const withdraw = (id) => { setDb({ ...db, apps: db.apps.filter(a => a.id !== id) }); toast("Candidature retirée"); };
  return <>
    <h1>Mes candidatures</h1>
    {mine.length === 0 && <div className="card">Vous n’avez pas encore postulé. <button className="btn sm" onClick={() => go("offres")}>Voir les offres</button></div>}
    <div style={{ display: "grid", gap: 14 }}>{mine.map(a => {
      const o = db.offers.find(x => x.id === a.offerId) || { title: "Offre supprimée" };
      return <div className="card" key={a.id}>
        <div className="row sp"><h3>{o.title}</h3>{statusTag(a)}</div>
        <p className="mut">Envoyée le {a.date} · CV : {a.cv}</p>
        <Track a={a} />
        {a.history.map((h, i) => <p key={i} className="mut" style={{ margin: "2px 0" }}>{h.date} · {LEVELS[h.level]} : {h.decision}{h.note ? " (" + h.note + ")" : ""}</p>)}
        {a.status === "en_cours" && <button className="btn bad sm" style={{ marginTop: 10 }} onClick={() => withdraw(a.id)}>Retirer ma candidature</button>}
      </div>;
    })}</div>
  </>;
}
