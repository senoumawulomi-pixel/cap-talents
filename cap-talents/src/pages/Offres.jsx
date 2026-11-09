import React, { useState, useEffect } from "react";
import { LEVELS, today, Field, statusTag, Track } from "../shared";

export default function Offres({ db, go, user, startApply }) {
  const [q, setQ] = useState("");
  const list = db.offers.filter(o => o.open && (o.title + o.dept + o.loc).toLowerCase().includes(q.toLowerCase()));
  return <>
    <h1>Trouvez le poste qui vous correspond</h1>
    <p className="mut">Postulez en ligne et suivez chaque étape de validation de votre dossier.</p>
    <div className="f"><input aria-label="Rechercher une offre" placeholder="Rechercher par poste, service ou ville" value={q} onChange={e => setQ(e.target.value)} /></div>
    {list.length === 0 && <div className="card">Aucune offre ne correspond. Modifiez votre recherche.</div>}
    <div className="grid">{list.map(o => <div className="card" key={o.id}>
      <div className="row sp"><h3>{o.title}</h3><span className="tag">{o.type}</span></div>
      <p className="mut">{o.dept} · {o.loc}</p><p>{o.desc}</p>
      <button className="btn" onClick={() => startApply(o.id)}>Candidater</button>
    </div>)}</div>
  </>;
}
