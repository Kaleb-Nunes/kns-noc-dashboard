const express = require("express");
const os = require("os");
const { exec } = require("child_process");
const path = require("path");

const APP_PORT = 5000;
const app = express();

// Middleware para entender JSON (Importante para receber comandos)
app.use(express.json());

// --- ESTADO DO SISTEMA (SIMULAÇÃO DE CAOS) ---
// Em vez de só ler, agora temos variáveis que podemos controlar
let systemState = {
    latencyMod: 0,    // Modificador de latência (0 = normal, 200 = lagado)
    ddosActive: false, // Se tem ataque rolando
    cpuStress: 0      // Carga extra de CPU simulada
};

// Dados globais persistentes
let globalStats = {
    latam: { target: 'uol.com.br', ms: 0, status: 'OK' },
    useast: { target: 'google.com', ms: 0, status: 'OK' },
    euwest: { target: 'bbc.com', ms: 0, status: 'OK' }
};

let sysStats = { cpu: 0, mem: 0, proc: 0, uptime: 0 };

// --- FUNÇÃO DE PING ---
function pingHost(host) {
    return new Promise(resolve => {
        exec(`ping -n 1 ${host}`, { timeout: 2000 }, (err, stdout) => {
            if (err || !stdout) return resolve(null);
            const m = stdout.match(/(?:tempo|time)[=<]\s*(\d+)\s*ms/i);
            let realMs = m ? parseInt(m[1], 10) : 0;
            
            // AQUI ESTÁ O TRUQUE EXPERT:
            // Somamos o "latencyMod" para simular problemas que VOCÊ pode consertar
            resolve(realMs + systemState.latencyMod); 
        });
    });
}

// --- LOOPS DE ATUALIZAÇÃO ---
async function updateGlobalMetrics() {
    const [latam, us, eu] = await Promise.all([
        pingHost(globalStats.latam.target),
        pingHost(globalStats.useast.target),
        pingHost(globalStats.euwest.target)
    ]);

    globalStats.latam.ms = latam || 999;
    globalStats.useast.ms = us || 999;
    globalStats.euwest.ms = eu || 999;
    
    // Regras de Status
    globalStats.latam.status = (globalStats.latam.ms < 150) ? 'ONLINE' : 'DEGRADADO';
    globalStats.useast.status = (globalStats.useast.ms < 250) ? 'ONLINE' : 'DEGRADADO';
    globalStats.euwest.status = (globalStats.euwest.ms < 300) ? 'ONLINE' : 'DEGRADADO';
}

function updateSysMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    sysStats.mem = Math.round((1 - freeMem / totalMem) * 100);
    sysStats.uptime = os.uptime();
    
    let idle = 0, total = 0;
    cpus.forEach(c => { idle += c.times.idle; total += Object.values(c.times).reduce((a,b)=>a+b,0); });
    
    let baseCpu = Math.round((1 - idle/total)*100);
    // Adiciona estresse simulado se o DDoS estiver ativo
    sysStats.cpu = systemState.ddosActive ? Math.min(100, baseCpu + 50) : baseCpu;
    if(isNaN(sysStats.cpu)) sysStats.cpu = 10;
}

// Loop de "Caos Controlado" (Opcional: Gera problemas aleatórios as vezes)
setInterval(() => {
    // 10% de chance de gerar um pico de latência do nada
    if(Math.random() > 0.90 && systemState.latencyMod === 0) {
        systemState.latencyMod = 300; // Cria lag artificial
    }
}, 10000);

setInterval(updateGlobalMetrics, 5000);
setInterval(updateSysMetrics, 4000);
updateGlobalMetrics(); 

// --- API DE LEITURA ---
app.get("/api/enterprise-status", (req, res) => {
    const rps = systemState.ddosActive ? 5000 : (1200 + Math.floor(Math.random() * 200));
    
    res.json({
        regions: globalStats,
        system: sysStats,
        business: {
            rps: rps,
            is_under_attack: systemState.ddosActive,
            latency_issue: systemState.latencyMod > 0
        }
    });
});

// --- API DE AÇÃO (NÍVEL SENIOR) ---
// Aqui nós recebemos ordens do painel para consertar as coisas
app.post("/api/actions", (req, res) => {
    const { action } = req.body;
    
    if (action === 'MITIGATE_DDOS') {
        systemState.ddosActive = false;
        console.log("🛡️ Ação executada: Firewall ativado, DDoS mitigado.");
        return res.json({ success: true, msg: "Firewall Rules Updated. Traffic Normalized." });
    }
    
    if (action === 'REROUTE_TRAFFIC') {
        systemState.latencyMod = 0; // Remove o lag artificial
        console.log("🔄 Ação executada: Rota otimizada via Backbone secundário.");
        return res.json({ success: true, msg: "BGP Routes Updated. Latency Stabilized." });
    }
    
    // Simula um comando de ataque (para teste)
    if (action === 'SIMULATE_ATTACK') {
        systemState.ddosActive = true;
        return res.json({ success: true, msg: "Simulation Started." });
    }

    res.status(400).json({ error: "Comando desconhecido" });
});

// --- SERVIDOR WEB ---
app.use(express.static(__dirname));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(APP_PORT, () => {
    console.log(`🚀 KNS NOC-SOC Expert rodando: http://localhost:${APP_PORT}`);
});