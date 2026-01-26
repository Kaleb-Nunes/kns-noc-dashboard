# 🚀 KNS Command Center | Protocolo 09

Painel de Monitoramento de Rede (NOC/SOC) de alta performance, desenvolvido para visualização em tempo real de infraestruturas críticas. Este projeto integra métricas reais do **Zabbix** com uma interface reativa moderna.

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js com Express (Modo Híbrido: Simulação + Dados Reais).
* **Inteligência/Coleta:** Python (Sentinela de Auto-Healing) integrado à API do Zabbix.
* **Frontend:** HTML5/CSS3 com efeitos Neon e Grid Dinâmico.
* **Integração:** Túneis seguros para monitoramento de borda (Edge Monitoring).

## 📊 Funcionalidades
* **Monitoramento em Tempo Real:** Visualização de Mbps da interface Wi-Fi (Host 10777).
* **Simulação de Incidentes:** Botão para disparar protocolos de ataque DDoS e Mitigação.
* **Alertas Visuais:** Card de tráfego com animação de pulso (Glow) ao exceder 50 Mbps.
* **Log de Sistema:** Terminal integrado para acompanhamento de eventos do Sentinela.

## 🚀 Como Executar
1. **Servidor Node.js:**
   ```bash
   node server.js
