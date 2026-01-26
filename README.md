KNS Command Center | Protocolo 09
Painel de Monitoramento de Rede (NOC/SOC) de alta performance, desenvolvido para visualização crítica de infraestrutura em tempo real. Este projeto integra métricas reais do Zabbix com uma interface reativa e automação de "Auto-Healing" via Python.

🛠️ Stack Tecnológica
Frontend: HTML5, CSS3 (Neon Grid System) e JavaScript Puro.

Backend: Node.js com Express para orquestração híbrida.

Inteligência: Python 3 (Sentinela) integrado à API JSON-RPC do Zabbix.

Infraestrutura: Docker e Túneis Privados para Edge Monitoring.

📊 Diferenciais do Projeto
Monitoramento Real: Conexão direta com Host 10777 do Zabbix para leitura de tráfego Wi-Fi.

Interface Reativa: Alertas visuais de saturação (Glow Pulse) quando o tráfego excede 50 Mbps.

Modo Híbrido: Capacidade de operar com dados simulados ou reais, garantindo alta disponibilidade do painel.

Sentinela de Autocura: Script Python que monitora latência e pode disparar ações automáticas de mitigação.

Como Executar
Para rodar o ecossistema completo no seu ambiente:

Inicie o Dashboard (Node.js):

Bash
node server.js
Ative o Sentinela (Python):

Bash
python3 scripts/auto_healing.py
Acesse a Interface: O painel estará disponível na porta 3000.

🚀 Desenvolvido por Kaleb Nunes - Consultor de Implantação e Infraestrutura.
