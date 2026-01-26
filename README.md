<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>KNS G-NOC-SOC | Command Center</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<style>
/* --- VARIÁVEIS DE TEMA --- */
:root {
    --bg-color: #050a14;
    --glass-bg: rgba(20, 30, 50, 0.7);
    --glass-border: rgba(255, 255, 255, 0.1);
    --text-main: #e2e8f0;
    --text-muted: #94a3b8;
    --neon-blue: #3b82f6;
    --neon-green: #10b981;
    --neon-red: #ef4444;
    --neon-yellow: #f59e0b;
    --card-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
    --log-bg: rgba(0,0,0,0.3);
}

[data-theme="light"] {
    --bg-color: #f1f5f9;
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(0, 0, 0, 0.1);
    --text-main: #0f172a;
    --text-muted: #475569;
    --neon-blue: #0284c7;
    --neon-green: #16a34a;
    --neon-red: #dc2626;
    --neon-yellow: #d97706;
    --card-shadow: 0 8px 24px rgba(148, 163, 184, 0.4);
    --log-bg: rgba(255,255,255,0.8);
}

* { box-sizing: border-box; transition: all 0.3s ease; }

body {
    margin: 0; padding: 15px;
    background-color: var(--bg-color);
    background-image: radial-gradient(var(--text-muted) 1px, transparent 1px);
    background-size: 40px 40px;
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    height: 100vh;
    overflow: hidden; 
}

/* --- ANIMAÇÕES DE PULSO (NOVO) --- */
@keyframes pulse-green {
    0% { text-shadow: 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
    50% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); transform: scale(1.1); }
    100% { text-shadow: 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
}

@keyframes pulse-border-green {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes pulse-border-red {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* --- GRID PRINCIPAL --- */
.dashboard-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 15px;
    height: calc(100vh - 30px);
}

.header {
    grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid var(--glass-border); padding-bottom: 10px; background: var(--bg-color);
}
.brand h1 { font-family: 'JetBrains Mono', monospace; font-size: 22px; margin: 0; letter-spacing: -1px; }
.brand span { color: var(--neon-blue); }

/* --- CONTROLES --- */
.controls { display: flex; align-items: center; gap: 15px; }
.lang-flags { display: flex; gap: 8px; border-right: 1px solid var(--glass-border); padding-right: 15px; }
.flag-btn { width: 24px; height: 16px; cursor: pointer; border-radius: 2px; opacity: 0.5; }
.flag-btn.active, .flag-btn:hover { opacity: 1; transform: scale(1.1); }

.btn-icon {
    background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-main);
    width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.btn-icon:hover { border-color: var(--neon-blue); color: var(--neon-blue); }

/* Indicador de Status Geral (Pulsante) */
.sys-dot {
    display: inline-block;
    color: var(--neon-green);
    animation: pulse-green 2s infinite;
}

/* --- GLASS CARDS (COM HOVER NOVO) --- */
.glass-card {
    background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border);
    border-radius: 10px; padding: 15px; box-shadow: var(--card-shadow);
    display: flex; flex-direction: column;
    transition: all 0.3s ease;
}

/* Efeito Hover Neon */
.glass-card:hover {
    border-color: var(--neon-blue);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); 
    transform: translateY(-2px);
}

/* --- SIDEBAR --- */
.sidebar { display: flex; flex-direction: column; gap: 10px; grid-row: 2 / 3; overflow-y: auto; }
.metric-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; display: flex; justify-content: space-between;}
.metric-value { font-family: 'JetBrains Mono'; font-size: 24px; font-weight: 700; color: var(--text-main); margin: 2px 0; }
.metric-bar-bg { height: 4px; background: rgba(128,128,128,0.2); border-radius: 2px; overflow: hidden; margin-top:5px; }
.metric-fill { height: 100%; background: var(--neon-blue); width: 0%; transition: width 1s ease; }

.global-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 8px; }
.region-box { background: var(--log-bg); padding: 5px; border-radius: 4px; border-left: 2px solid transparent; font-size: 12px; transition: all 0.3s; }
.region-val { font-family: 'JetBrains Mono'; font-weight: bold; }

/* Status com animação de borda */
.status-ok { 
    border-color: var(--neon-green); 
    color: var(--neon-green); 
    /* animation: pulse-border-green 2s infinite; Removido para não poluir demais, ativado se quiser */
}
.status-bad { 
    border-color: var(--neon-red); 
    color: var(--neon-red); 
    animation: pulse-border-red 1.5s infinite; /* Alerta visual forte */
}

.action-area { margin-top: 8px; display: none; }
.btn-action {
    width: 100%; padding: 8px; border: none; border-radius: 4px; cursor: pointer;
    font-weight: bold; font-size: 11px; display: flex; align-items: center; justify-content: center; gap: 5px;
    text-transform: uppercase; color: #fff; margin-bottom: 5px;
}
.btn-crit { background: var(--neon-red); animation: pulseBtn 1.5s infinite; }
.btn-warn { background: var(--neon-yellow); color: #000; }

/* --- MAIN STAGE (GRID DE 5 GRÁFICOS) --- */
.main-stage { 
    grid-column: 2 / 3; 
    grid-row: 2 / 3;
    display: grid;
    /* Divide em 6 colunas virtuais para flexibilidade */
    grid-template-columns: repeat(6, 1fr);
    /* 2 linhas de altura: Topo 55%, Baixo 45% */
    grid-template-rows: 55% 45%; 
    gap: 10px;
    overflow: hidden;
}

/* Container do Iframe */
.grafana-box {
    padding: 0 !important;
    position: relative;
    overflow: hidden;
}
iframe { width: 100%; height: 100%; border: 0; display: block; }

/* Topo: Gráficos ocupam metade cada (3 colunas de 6) */
.box-large { grid-column: span 3; }

/* Baixo: Gráficos ocupam um terço cada (2 colunas de 6) */
.box-small { grid-column: span 2; }


/* --- LOGS --- */
.logs-panel { grid-column: 1 / -1; height: 100px; overflow: hidden; grid-row: 3 / 4; }
.logs-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
.log-terminal { font-family: 'JetBrains Mono', monospace; font-size: 11px; overflow-y: auto; height: 100%; background: var(--log-bg); padding: 8px; border-radius: 4px; }
.log-row { padding: 2px 0; border-bottom: 1px solid var(--glass-border); display: flex; gap: 10px; }
.lvl-crit { color: var(--neon-red); font-weight:bold; }
.lvl-warn { color: var(--neon-yellow); font-weight:bold; }
.lvl-info { color: var(--neon-blue); font-weight:bold; }
.lvl-sys  { color: var(--neon-green); font-weight:bold; }

@keyframes blink { 50% { opacity: 0.5; } }
@keyframes pulseBtn { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
</style>
</head>

<body>

<div class="dashboard-grid">
    <div class="header">
        <div class="brand"><h1>KNS<span>_COMMAND_CENTER</span></h1></div>
        <div class="controls">
            <div class="lang-flags">
                <img src="https://flagcdn.com/w40/br.png" class="flag-btn active" id="btn-pt" onclick="changeLang('pt')">
                <img src="https://flagcdn.com/w40/us.png" class="flag-btn" id="btn-en" onclick="changeLang('en')">
            </div>
            <button class="btn-icon" onclick="simulateAttack()" title="Simular Ataque"><i class="fa-solid fa-bug"></i></button>
            <button class="btn-icon" onclick="toggleTheme()" title="Tema"><i class="fa-solid fa-circle-half-stroke"></i></button>
            <div style="font-size:11px; color:var(--neon-green); font-weight:bold">
                <span class="sys-dot">●</span> <span data-lang="sys_status">ONLINE</span>
            </div>
        </div>
    </div>

    <aside class="sidebar">
        <div class="glass-card">
            <span class="metric-label"><span data-lang="lbl_latency">Latência Global</span> <i class="fa-solid fa-globe"></i></span>
            <div class="global-grid">
                <div class="region-box" id="reg-latam"><div class="region-val">--</div></div>
                <div class="region-box" id="reg-us"><div class="region-val">--</div></div>
                <div class="region-box" id="reg-eu"><div class="region-val">--</div></div>
            </div>
            <div id="action-routing" class="action-area">
                <button class="btn-action btn-warn" onclick="sendAction('REROUTE_TRAFFIC')">
                    <i class="fa-solid fa-route"></i> BGP Optimize
                </button>
            </div>
        </div>

        <div class="glass-card">
            <span class="metric-label" data-lang="lbl_cpu">Node.js CPU</span>
            <div class="metric-value" id="cpu-txt">--%</div>
            <div class="metric-bar-bg"><div id="cpu-bar" class="metric-fill"></div></div>
        </div>

        <div class="glass-card">
             <span class="metric-label" data-lang="lbl_security">Status Segurança</span>
             <div class="metric-value" id="sec-status" style="color:var(--neon-green); font-size:18px;">SECURE</div>
             <div id="action-mitigate" class="action-area">
                 <button class="btn-action btn-crit" onclick="sendAction('MITIGATE_DDOS')">
                    <i class="fa-solid fa-shield-halved"></i> MITIGATE
                </button>
            </div>
        </div>

        <div class="glass-card">
            <span class="metric-label" data-lang="lbl_sessions">Tráfego (L7)</span>
            <div class="metric-value" id="rps-val">--</div>
            <small style="color:var(--text-muted); font-size:9px;">Req/Sec</small>
        </div>
    </aside>

    <main class="main-stage">
        
        <div class="glass-card grafana-box box-large">
            <iframe src="http://localhost:3000/d-solo/adlvx49/new-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s&panelId=4&__feature.dashboardSceneSolo=true&theme=dark" frameborder="0"></iframe>
        </div>

        <div class="glass-card grafana-box box-large">
            <iframe src="http://localhost:3000/d-solo/adlvx49/new-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s&panelId=2&__feature.dashboardSceneSolo=true&theme=dark" frameborder="0"></iframe>
        </div>

        <div class="glass-card grafana-box box-small">
            <iframe src="http://localhost:3000/d-solo/adlvx49/new-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s&panelId=3&__feature.dashboardSceneSolo=true&theme=dark" frameborder="0"></iframe>
        </div>

        <div class="glass-card grafana-box box-small">
            <iframe src="http://localhost:3000/d-solo/adlvx49/new-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s&panelId=5&__feature.dashboardSceneSolo=true&theme=dark" frameborder="0"></iframe>
        </div>

        <div class="glass-card grafana-box box-small">
            <iframe src="http://localhost:3000/d-solo/adlvx49/new-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s&panelId=6&__feature.dashboardSceneSolo=true&theme=dark" frameborder="0"></iframe>
        </div>

    </main>

    <footer class="glass-card logs-panel">
        <div class="logs-header"><strong data-lang="log_title">Audit Log</strong><span>Multi-Panel View</span></div>
        <div class="log-terminal" id="log-terminal"></div>
    </footer>
</div>

<script>
    // --- SCRIPT PADRÃO ---
    const translations = {
        pt: { sys_status: "ONLINE", lbl_latency: "Latência Global", lbl_cpu: "Carga Node", lbl_security: "Status Segurança", lbl_sessions: "Tráfego", btn_reroute: "Otimizar BGP", btn_mitigate: "MITIGAR ATAQUE", log_title: "Fluxo de Auditoria", sec_safe: "SEGURO", sec_crit: "ATAQUE DETECTADO" },
        en: { sys_status: "ONLINE", lbl_latency: "Global Latency", lbl_cpu: "Node Load", lbl_security: "Security Status", lbl_sessions: "Traffic", btn_reroute: "Optimize BGP", btn_mitigate: "MITIGATE ATTACK", log_title: "Audit Stream", sec_safe: "SECURE", sec_crit: "ATTACK DETECTED" }
    };
    let currentLang = localStorage.getItem('kns_lang') || 'pt';
    let currentTheme = localStorage.getItem('kns_theme') || 'dark';

    async function sendAction(actionType) {
        addLog("SYS", `Action: ${actionType}...`);
        try { fetch('/api/actions', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: actionType }) }); } catch(e){}
    }
    async function simulateAttack() { sendAction('SIMULATE_ATTACK'); }

    async function updateData() {
        try {
            const res = await fetch('/api/enterprise-status');
            const data = await res.json();
            const dict = translations[currentLang];
            
            updateRegion('reg-latam', data.regions.latam);
            updateRegion('reg-us', data.regions.useast);
            updateRegion('reg-eu', data.regions.euwest);
            
            document.getElementById('action-routing').style.display = data.business.latency_issue ? 'block' : 'none';
            const isAttack = data.business.is_under_attack;
            const secEl = document.getElementById('sec-status');
            if(isAttack) {
                secEl.innerText = dict.sec_crit; secEl.style.color = "var(--neon-red)"; secEl.classList.add("blink");
                document.getElementById('action-mitigate').style.display = 'block';
            } else {
                secEl.innerText = dict.sec_safe; secEl.style.color = "var(--neon-green)"; secEl.classList.remove("blink");
                document.getElementById('action-mitigate').style.display = 'none';
            }
            document.getElementById('cpu-bar').style.width = data.system.cpu + "%";
            document.getElementById('cpu-txt').innerText = data.system.cpu + "%";
            document.getElementById('rps-val').innerText = data.business.rps.toLocaleString();
        } catch(e) {}
    }
    function updateRegion(id, data) {
        const el = document.getElementById(id);
        el.querySelector('.region-val').innerText = data.ms + "ms";
        
        // Remove classes antigas para atualizar status
        el.classList.remove('status-ok', 'status-bad');
        
        if (data.status === 'ONLINE') {
            el.querySelector('.region-val').style.color = 'var(--neon-green)';
            el.classList.add('status-ok');
        } else {
            el.querySelector('.region-val').style.color = 'var(--neon-red)';
            el.classList.add('status-bad');
        }
    }
    function changeLang(lang) {
        currentLang = lang; localStorage.setItem('kns_lang', lang);
        document.querySelectorAll('.flag-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${lang}`).classList.add('active');
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang'); if(translations[lang][key]) el.innerText = translations[lang][key];
        });
    }
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute("data-theme", currentTheme);
        // Recarrega iframes para mudar tema (simples reload)
        document.querySelectorAll('iframe').forEach(ifr => {
           let url = new URL(ifr.src);
           url.searchParams.set('theme', currentTheme);
           ifr.src = url.toString();
        });
    }
    function addLog(lvl, msg) {
        const t = document.getElementById('log-terminal');
        const div = document.createElement('div');
        div.className = 'log-row';
        let cl = 'lvl-info'; if(lvl==='CRIT') cl='lvl-crit'; if(lvl==='WARN') cl='lvl-warn'; if(lvl==='SYS') cl='lvl-sys';
        div.innerHTML = `<span style="opacity:0.6">${new Date().toLocaleTimeString()}</span> <span class="${cl}">[${lvl}]</span> ${msg}`;
        t.prepend(div); if(t.children.length > 30) t.removeChild(t.lastChild);
    }

    changeLang(currentLang);
    setInterval(updateData, 2000);
    addLog("SYS", "KNS Command Center Initialized.");
</script>
</body>
</html>