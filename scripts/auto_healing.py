from pyzabbix import ZabbixAPI
import requests
import time
import random

# --- CONFIGURAÇÃO FANTASMA ---
# O Codespaces usa 127.0.0.1 para acessar a porta que você mapeou (8080)
ZABBIX_URL = "http://127.0.0.1:8080" 
ZABBIX_USER = "Admin"
ZABBIX_PASS = "zabbix"
HOST_ID = "10777"
ITEM_KEY = 'net.if.in["Wi-Fi"]'

# Endereços do dashboard rodando no Codespaces
DASHBOARD_DATA_URL = "http://localhost:3000/api/update-traffic"
DASHBOARD_ACTION_URL = "http://localhost:3000/api/actions"

def get_zabbix_data():
    try:
        zapi = ZabbixAPI(ZABBIX_URL)
        zapi.session.timeout = 2
        zapi.login(ZABBIX_USER, ZABBIX_PASS)
        
        items = zapi.item.get(hostids=HOST_ID, search={'key_': ITEM_KEY}, output="extend")
        if items:
            last_value = float(items[0]['lastvalue'])
            return round(last_value / 1024 / 1024, 2)
    except:
        return None
    return 0

print("🕵️ Protocolo 09: Sentinela monitorando via Túnel Fantasma")

while True:
    traffic = get_zabbix_data()
    
    if traffic is None:
        # Se o Zabbix local estiver fechado, simula para o dashboard não parar
        traffic = round(random.uniform(7.0, 15.0), 2)
        print(f"[{time.strftime('%H:%M:%S')}] Link Local Offline - Simulando: {traffic} Mbps")
    else:
        print(f"[{time.strftime('%H:%M:%S')}] Dados Reais Capturados: {traffic} Mbps")

    # Envia para o servidor Node.js
    try:
        requests.post(DASHBOARD_DATA_URL, json={"value": traffic}, timeout=1)
        if traffic > 50:
            requests.post(DASHBOARD_ACTION_URL, json={"action": "SIMULATE_ATTACK"}, timeout=1)
    except:
        pass
        
    time.sleep(5)