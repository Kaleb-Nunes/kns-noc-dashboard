const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve arquivos estáticos (CSS, Imagens, JS do front)
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

// --- ESTADO DA SIMULAÇÃO ---
let simulationState = {
    isUnderAttack: false,
    latencyIssue: false,
    trafficSpike: false
};

// --- ROTA PRINCIPAL (DASHBOARD) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API DE DADOS (O "Coração" do Dashboard) ---
app.get('/api/enterprise-status', (req, res) => {
    
    // Gera números aleatórios para dar "vida" ao dashboard
    const baseCpu = simulationState.isUnderAttack ? 90 : 30;
    const cpuFluctuation = Math.floor(Math.random() * 15);
    
    const baseRps = simulationState.isUnderAttack ? 5000 : 800;
    const rpsFluctuation = Math.floor(Math.random() * 200);

    // Simula latência alta se houver problema
    const latamMs = simulationState.latencyIssue ? 450 : 35 + Math.floor(Math.random() * 20);
    const latamStatus = simulationState.latencyIssue ? 'WARN' : 'ONLINE';

    res.json({
        system: {
            cpu: Math.min(100, baseCpu + cpuFluctuation),
            memory: 60
        },
        business: {
            rps: baseRps + rpsFluctuation,
            is_under_attack: simulationState.isUnderAttack,
            latency_issue: simulationState.latencyIssue
        },
        regions: {
            latam:  { ms: latamMs, status: latamStatus },
            useast: { ms: 120 + Math.floor(Math.random() * 10), status: 'ONLINE' },
            euwest: { ms: 180 + Math.floor(Math.random() * 10), status: 'ONLINE' }
        }
    });
});

// --- API DE AÇÕES (Botões do Painel) ---
app.post('/api/actions', (req, res) => {
    const { action } = req.body;
    console.log(`[ACTION RECEIVED] ${action}`);

    if (action === 'SIMULATE_ATTACK') {
        simulationState.isUnderAttack = true;
        simulationState.latencyIssue = true; // Ataque causa lentidão
    } 
    else if (action === 'MITIGATE_DDOS') {
        simulationState.isUnderAttack = false;
        setTimeout(() => { simulationState.latencyIssue = false; }, 3000); // Demora um pouco para normalizar a rede
    }
    else if (action === 'REROUTE_TRAFFIC') {
        simulationState.latencyIssue = false;
    }

    res.json({ success: true, newState: simulationState });
});

app.listen(PORT, () => {
    console.log(`🚀 KNS Dashboard rodando em: http://localhost:${PORT}`);
    console.log(`🔧 Modo de Simulação Ativo`);
});