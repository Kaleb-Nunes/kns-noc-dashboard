<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>KNS NOC / SOC</title>

<style>
:root{
  --bg:#f4f7fb; --text:#0f172a; --muted:#334155;
  --card:#ffffff; --border:rgba(2,6,23,.08); --shadow:0 10px 20px rgba(2,6,23,.08);
  --primary:#2563eb;
  --btn-bg:#0f172a; --btn-text:#ffffff;
  --danger:#dc2626;
  --gap:18px;
}
[data-theme="dark"]{
  --bg:#0b1220; --text:#e5e7eb; --muted:#cbd5e1;
  --card:rgba(255,255,255,.06); --border:rgba(255,255,255,.10); --shadow:0 10px 20px rgba(0,0,0,.35);
  --primary:#60a5fa;
  --btn-bg:#e5e7eb; --btn-text:#0b1220;
  --danger:#f87171;
}
*{box-sizing:border-box}
body{margin:0;padding:20px;font-family:Arial,sans-serif;background:var(--bg);color:var(--text)}
.header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
h1{margin:0;font-size:22px;color:var(--primary)}
.btn{
  border:1px solid var(--border);
  background:var(--btn-bg);color:var(--btn-text);
  padding:10px 12px;border-radius:10px;cursor:pointer;font-weight:800
}
.grid{display:grid;grid-template-columns:2fr 1fr;gap:var(--gap);margin-bottom:var(--gap)}
.card{
  background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:16px;box-shadow:var(--shadow)
}
h2{margin:0 0 12px;color:var(--primary);font-size:16px}
.kv p{margin:8px 0}
.kv span{font-weight:900}
.bad{color:var(--danger);font-weight:900}
.ok{color:inherit;font-weight:900}

.embeds{display:grid;grid-template-columns:repeat(2,minmax(320px,1fr));gap:var(--gap)}
.embed-title{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
.embed-title small{color:var(--muted)}
.iframe-wrap{border-radius:12px;overflow:hidden;border:1px solid var(--border);background:rgba(0,0,0,.08)}
iframe{width:100%;height:240px;border:0;display:block}

@media (max-width:980px){
  .grid{grid-template-columns:1fr}
  .embeds{grid-template-columns:1fr}
}
</style>
</head>

<body>
  <div class="header">
    <h1>KNS NOC / SOC</h1>
    <button class="btn" id="toggleTheme" type="button">Alternar tema</button>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Status Geral</h2>
      <div class="kv">
        <p>CPU: <span id="cpu">--</span>%</p>
        <p>Memória: <span id="mem">--</span>%</p>
        <p>Latência: <span id="lat">--</span> ms</p>
        <p>Status: <span id="status" class="ok">--</span></p>
      </div>
    </div>

    <div class="card">
      <h2>SOC Security</h2>
      <div class="kv">
        <p>Ataques: <span id="ataques">--</span></p>
        <p>Estado: <span id="seguranca">--</span></p>
      </div>
    </div>
  </div>

  <div class="embeds">
    <div class="card">
      <div class="embed-title"><h2>CPU (Painel 4)</h2><small>Grafana</small></div>
      <div class="iframe-wrap"><iframe id="p4" loading="lazy"></iframe></div>
    </div>

    <div class="card">
      <div class="embed-title"><h2>Memória (Painel 8)</h2><small>Grafana</small></div>
      <div class="iframe-wrap"><iframe id="p8" loading="lazy"></iframe></div>
    </div>

    <div class="card">
      <div class="embed-title"><h2>Latência (Painel 5)</h2><small>Grafana</small></div>
      <div class="iframe-wrap"><iframe id="p5" loading="lazy"></iframe></div>
    </div>

    <div class="card">
      <div class="embed-title"><h2>Disponibilidade (Painel 2)</h2><small>Grafana</small></div>
      <div class="iframe-wrap"><iframe id="p2" loading="lazy"></iframe></div>
    </div>

    <div class="card">
      <div class="embed-title"><h2>Perdas de Pacotes (Painel 7)</h2><small>Grafana</small></div>
      <div class="iframe-wrap"><iframe id="p7" loading="lazy"></iframe></div>
    </div>
  </div>

<script>
  // ====== AJUSTES IMPORTANTES (localhost / outro dispositivo / porta do Grafana) ======
  // - Se você abrir esta página por outro dispositivo (celular), "localhost" viraria o celular.
  //   Por isso usamos window.location.hostname (o host real que você acessou).
  // - Grafana precisa estar acessível em http://SEU_HOST:3000
  //   Se estiver em outra porta, troque GRAFANA_PORT aqui.
  const GRAFANA_PORT = 3000;

  const HOST = window.location.hostname;                 // IP/host real usado no navegador
  const GRAFANA_BASE = `http://${HOST}:${GRAFANA_PORT}`; // evita "localhost" errado
  const METRICS_ENDPOINT = `${location.origin}/kns-metrics`; // mesma origem da página (porta 5055)

  // ====== DASH / PAINÉIS ======
  const DASH_UID  = "adwld8l";
  const DASH_SLUG = "kns-noc-soc-copy";
  const ORG_ID    = 1;

  const PANELS = {
    p4: "panel-4",
    p8: "panel-8",
    p5: "panel-5",
    p2: "panel-2",
    p7: "panel-7"
  };

  // ====== TEMA (1 botão) ======
  const root = document.documentElement;

  function getTheme(){
    return root.getAttribute("data-theme") || "dark";
  }

  function setTheme(theme){
    root.setAttribute("data-theme", theme);
    localStorage.setItem("kns_theme", theme);
    setEmbeds();
  }

  document.getElementById("toggleTheme").addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });

  // ====== EMBEDS (atualiza theme=dark|light nos iframes) ======
  function grafanaSrc(panelId){
    const theme = getTheme();
    return `${GRAFANA_BASE}/d-solo/${DASH_UID}/${DASH_SLUG}` +
      `?orgId=${ORG_ID}` +
      `&from=now-24h&to=now` +
      `&timezone=browser` +
      `&theme=${theme}` +
      `&panelId=${encodeURIComponent(panelId)}` +
      `&__feature.dashboardSceneSolo=true`;
  }

  function setEmbeds(){
    Object.keys(PANELS).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.src = grafanaSrc(PANELS[id]);
    });
  }

  // Tema inicial
  setTheme(localStorage.getItem("kns_theme") || "dark");

  // ====== STATUS GERAL (Zabbix/Proxy em /kns-metrics) ======
  const elCpu = document.getElementById("cpu");
  const elMem = document.getElementById("mem");
  const elLat = document.getElementById("lat");
  const elAtk = document.getElementById("ataques");
  const elSt  = document.getElementById("status");
  const elSec = document.getElementById("seguranca");

  function setStatus(text, isBad){
    elSt.textContent = text;
    elSt.className = isBad ? "bad" : "ok";
  }

  async function atualizarStatus(){
    try{
      const r = await fetch(METRICS_ENDPOINT, { cache: "no-store" });
      if(!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();

      elCpu.textContent = (d.cpu ?? "--");
      elMem.textContent = (d.memoria ?? "--");
      elLat.textContent = (d.latencia ?? "--");
      elAtk.textContent = (d.ataques ?? "--");

      const lat = Number(d.latencia);
      const mem = Number(d.memoria);
      const atk = Number(d.ataques);

      let crit = false;
      if (Number.isFinite(lat) && lat > 120) crit = true;
      if (Number.isFinite(mem) && mem > 90)  crit = true;

      if (crit) setStatus("CRÍTICO", true);
      else if ((Number.isFinite(lat) && lat > 80) || (Number.isFinite(mem) && mem > 80)) setStatus("ALERTA", true);
      else setStatus("OK", false);

      elSec.textContent = (Number.isFinite(atk) && atk >= 3) ? "INCIDENTE" : "OK";
    }catch(e){
      elCpu.textContent = "--";
      elMem.textContent = "--";
      elLat.textContent = "--";
      elAtk.textContent = "--";
      elSec.textContent = "--";
      setStatus("API OFFLINE", true);
    }
  }

  setInterval(atualizarStatus, 5000);
  atualizarStatus();

  // ====== NOTA PRÁTICA (sem travar a execução) ======
  // Se os iframes ficarem vazios, o mais comum é o Grafana exigir login (iframe não autenticado).
  // A solução é habilitar anonymous access ou outro método de embed sem login.
</script>
</body>
</html>
