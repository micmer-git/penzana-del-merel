import"./hoisted.Gibxo63F.js";const v=window.__ORDER_API||"http://localhost:3003",$=33;let g=[],m={};document.querySelectorAll(".cl-tab").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".cl-tab").forEach(n=>{n.classList.remove("active"),n.setAttribute("aria-selected","false")}),document.querySelectorAll(".cl-panel").forEach(n=>n.classList.remove("active")),t.classList.add("active"),t.setAttribute("aria-selected","true"),document.getElementById("panel-"+t.dataset.tab)?.classList.add("active")})});async function h(){try{const[t,n]=await Promise.all([fetch(`${v}/api/orders`),fetch(`${v}/api/stats`)]);g=await t.json(),m=await n.json(),document.getElementById("cl-offline").style.display="none"}catch{document.getElementById("cl-offline").style.display="block";return}b(),E(),f(),I()}function b(){const t=document.getElementById("podium"),n=(m.ranking||[]).slice(0,3);if(n.length===0){t.innerHTML="";return}const a=["🥇","🥈","🥉"];t.innerHTML=n.map((s,e)=>`<div class="podium-card podium-${e+1}">
      <div class="podium-medal">${a[e]}</div>
      <div class="podium-name">${c(s.name)}</div>
      <div class="podium-stat">${s.pizzas}</div>
      <div class="podium-label">pizze</div>
    </div>`).join("")}function E(){const t=document.getElementById("ranking-table"),n=m.ranking||[];if(n.length===0){t.innerHTML='<div class="cl-empty">Nessun ordine ancora. Ordina la prima pizza!</div>';return}const a=n[0]?.pizzas||1;let s=`<table class="rank-table"><thead><tr>
    <th>#</th><th>Nome</th><th>Pizze</th><th></th><th>Ordini</th><th>Spesa</th>
  </tr></thead><tbody>`;n.forEach((e,d)=>{const o=Math.round(e.pizzas/a*100);s+=`<tr>
      <td><span class="rank-num">${d+1}</span></td>
      <td class="rank-name">${c(e.name)}</td>
      <td><strong>${e.pizzas}</strong></td>
      <td style="width:30%"><div class="rank-bar" style="width:${o}%"></div></td>
      <td>${e.orders}</td>
      <td>${p(e.totalSpent)}</td>
    </tr>`}),s+="</tbody></table>",t.innerHTML=s}function f(){const t=document.getElementById("orders-list"),n=document.getElementById("filter-period").value,a=new Date,s=g.filter(e=>{const d=new Date(e.timestamp);if(n==="today")return d.toDateString()===a.toDateString();if(n==="week"){const o=new Date(a);return o.setDate(o.getDate()-7),d>=o}return n==="month"?d.getMonth()===a.getMonth()&&d.getFullYear()===a.getFullYear():!0});if(s.length===0){t.innerHTML='<div class="cl-empty">Nessun ordine trovato.</div>';return}t.innerHTML=s.map(e=>{const o=new Date(e.timestamp).toLocaleString("it-IT",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),u=e.orderMode==="delivery"?"Consegna — "+(e.deliveryAddress||""):e.tableId?e.tableId.replace("table-","Tavolo "):"",r=(e.items||[]).map(i=>{const z=i.size?` (${i.size})`:"",l=[];i.removed?.length&&l.push("senza: "+i.removed.join(", ")),i.added?.length&&l.push("con: "+i.added.join(", "));const y=l.length?`<span class="order-mods"> — ${l.join(" | ")}</span>`:"";return`<li>${c(i.name)}${z} x${i.qty} — ${p(i.price*i.qty)}${y}</li>`}).join("");return`<div class="order-card">
      <div class="order-head">
        <div><span class="order-name">${c(e.customerName)}</span>
        <div class="order-mode">${u}</div></div>
        <div class="order-time">${o}</div>
      </div>
      <ul class="order-items">${r}</ul>
      <div class="order-foot">
        <span>Totale: ${p(e.totalPrice)}</span>
        ${e.pizzaCount>0?`<span class="pizza-badge">${e.pizzaCount} pizze</span>`:""}
      </div>
    </div>`}).join("")}document.getElementById("filter-period")?.addEventListener("change",f);function I(){const t=document.getElementById("filo-content"),n=m.totalPizzas||0,a=n*$,s=(a/100).toFixed(1),e=(a/1e5).toFixed(4),d=185,o=a/1e5,r=Math.min(100,(d+o)/800*100);t.innerHTML=`
    <div class="filo-hero">
      <h2>Il Filo d'Oro dagli ordini registrati</h2>
      <div class="filo-number">${s} m</div>
      <div class="filo-sub">${n} pizze ordinate × 33 cm di diametro</div>
      <div class="filo-sub">${e} km aggiunti al viaggio verso Napoli</div>
    </div>
    <div class="filo-progress">
      <strong>Progresso verso Napoli (800 km)</strong>
      <div class="filo-bar-wrap">
        <div class="filo-bar" style="width:${r.toFixed(1)}%"></div>
      </div>
      <div class="filo-targets">
        <span>Orezzo</span>
        <span>${r.toFixed(1)}%</span>
        <span>Napoli</span>
      </div>
    </div>`}function p(t){return(t||0).toFixed(2).replace(".",",")+" €"}function c(t){return(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}h();setInterval(h,3e4);
