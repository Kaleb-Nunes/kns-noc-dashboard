while($true) {

    $cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average

    $os = Get-CimInstance Win32_OperatingSystem
    $memLivre = $os.FreePhysicalMemory
    $memTotal = $os.TotalVisibleMemorySize
    $memPercent = [math]::Round((1 - ($memLivre / $memTotal)) * 100, 2)

    $ping = Test-Connection -ComputerName 8.8.8.8 -Count 1 -ErrorAction SilentlyContinue
    $latencia = if ($ping) { $ping.ResponseTime } else { 0 }

    $dados = @{
        cpu = [math]::Round($cpu, 2)
        memoria = $memPercent
        latencia = $latencia
        timestamp = (Get-Date -Format "HH:mm:ss")
        status = if ($latencia -lt 50) { "Estável" } else { "Alerta" }
    }

    $dados | ConvertTo-Json | Out-File -FilePath "dados.json" -Encoding utf8

    Write-Host "CPU: $cpu% | Memória: $memPercent% | Latência: $latencia ms" -ForegroundColor Green

    Start-Sleep -Seconds 5
}
