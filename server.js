const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve arquivos estáticos (CSS, Imagens, JS do front)
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

// --- ESTADO DO SISTEMA ---
let simulationState = {
    isUnderAttack: false,
    latencyIssue: false,
    trafficSpike: false
};

// Variável para armazenar o tráfego real vindo do Zabbix (Wi-Fi Host 10777)
let realTrafficValue = 0;

// --- ROTA PRINCIPAL (DASHBOARD) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API DE DADOS (O "Coração" do Dashboard) ---
app.get('/api/enterprise-status', (req, res) => {
    
    // Lógica de CPU (Oscilação natural)
    const baseCpu = simulationState.isUnderAttack ? 90 : 32;
    const cpuFluctuation = Math.floor(Math.random() * 8);
    
    // Lógica de Tráfego: Prioriza o dado real do Zabbix injetado pelo Python
    let displayRps;
    if (realTrafficValue > 0) {
        displayRps = realTrafficValue; // Valor real em Mbps do Zabbix
    } else {
        const baseRps = simulationState.isUnderAttack ? 5600 : 842;
        const rpsFluctuation = Math.floor(Math.random() * 150);
        displayRps = baseRps + rpsFluctuation;
    }

    // Lógica de Latência (Reflete estado de ataque)
    const latamMs = simulationState.latencyIssue ? 403 : 12 + Math.floor(Math.random() * 5);
    const latamStatus = simulationState.latencyIssue ? 'BAD' : 'ONLINE';

    res.json({
        system: {
            cpu: Math.min(100, baseCpu + cpuFluctuation),
            memory: 60
        },
        business: {
            rps: displayRps,
            is_under_attack: simulationState.isUnderAttack,
            latency_issue: simulationState.latencyIssue
        },
        regions: {
            latam:  { ms: latamMs, status: latamStatus },
            useast: { ms: 120, status: 'ONLINE' },
            euwest: { ms: 180, status: 'ONLINE' }
        }
    });
});

// --- API PARA RECEBER DADOS DO PYTHON (SENTINELA ZABBIX) ---
app.post('/api/update-traffic', (req, res) => {
    const { value } = req.body;
    if (value !== undefined) {
        realTrafficValue = value;
        console.log(`[ZABBIX DATA] Tráfego Wi-Fi atualizado: ${value} Mbps`);
    }
    res.json({ success: true });
});

// --- API DE AÇÕES (Botões do Painel e Automação Python) ---
app.post('/api/actions', (req, res) => {
    const { action } = req.body;
    console.log(`[ACTION RECEIVED] ${action}`);

    if (action === 'SIMULATE_ATTACK') {
        simulationState.isUnderAttack = true;
        simulationState.latencyIssue = true;
    } 
    else if (action === 'MITIGATE_DDOS') {
        simulationState.isUnderAttack = false;
        setTimeout(() => { simulationState.latencyIssue = false; }, 3000);
    }
    else if (action === 'REROUTE_TRAFFIC') {
        simulationState.latencyIssue = false;
    }

    res.json({ success: true, newState: simulationState });
});

app.listen(PORT, () => {
    console.log(`🚀 KNS Dashboard rodando em: http://localhost:${PORT}`);
    console.log(`🔧 Modo de Operação Híbrido (Simulação + Zabbix) Ativo`);
});