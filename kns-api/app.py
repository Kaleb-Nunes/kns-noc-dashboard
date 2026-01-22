from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import os
import time

app = Flask(__name__)
# CORS permite que seu HTML (que pode estar em outra porta) fale com esse Python
CORS(app) 

# Caminho do arquivo de log real
LOG_FILE = "firewall_audit.log"

@app.route('/api/status', methods=['GET'])
def check_status():
    return jsonify({"system": "ONLINE", "cpu_load": "NORMAL"})

@app.route('/api/mitigate', methods=['POST'])
def mitigate_attack():
    # 1. Simula processamento real (atraso de rede)
    time.sleep(1.5) 
    
    # 2. AÇÃO REAL: Escreve no disco rígido (Log de Auditoria)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] [CRITICAL] PROTOCOL 9 EXECUTED. IP RANGE BLOCKED. THREAT MITIGATED.\n"
    
    try:
        with open(LOG_FILE, "a") as f:
            f.write(log_entry)
        
        print(f"✅ AÇÃO EXECUTADA: {log_entry.strip()}")
        
        return jsonify({
            "status": "success",
            "message": "Protocol 9 successfully executed.",
            "timestamp": timestamp,
            "action": "FIREWALL_UPDATE_COMPLETE"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("🚀 KNS BACKEND SYSTEM INITIALIZED ON PORT 5000...")
    app.run(host='0.0.0.0', port=5001, debug=True)