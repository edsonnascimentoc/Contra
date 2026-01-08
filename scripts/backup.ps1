param([string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\.."))
$ErrorActionPreference = "Stop"
function Ensure-Dir($path) { if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path | Out-Null } }
$root = $ProjectRoot
Set-Location $root
$envPath = Join-Path $root ".env"
if (Test-Path $envPath) {
  Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*$') { return }
    if ($_ -match '^\s*([^=]+)\s*=\s*(.*)\s*$') {
      $k = $matches[1].Trim()
      $v = $matches[2].Trim().Trim('"').Trim("'")
      [Environment]::SetEnvironmentVariable($k, $v, 'Process')
    }
  }
}
$backups = Join-Path $root "backups"
Ensure-Dir $backups
$logsDir = Join-Path $root "logs"
$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$logFile = Join-Path $backups "backup_scheduler.log"
function Log($msg) { Add-Content -Path $logFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg" }
$failed = $false
$failures = @()
try {
  if ($env:DATABASE_URL) {
    $dumpPath = Join-Path $backups "db_$ts.dump"
    Log "Iniciando backup PostgreSQL"
    $m = [regex]::Match($env:DATABASE_URL, '^postgresql://([^:]+):(.*)@([^:/]+)(?::(\d+))?/([^?]+)')
    if ($m.Success) {
      $user = $m.Groups[1].Value
      $pass = $m.Groups[2].Value
      $pgHost = $m.Groups[3].Value
      $port = if ($m.Groups[4].Value) { [int]$m.Groups[4].Value } else { 5432 }
      $db   = $m.Groups[5].Value
      $env:PGPASSWORD = $pass
      & pg_dump -h $pgHost -p $port -U $user -d $db -F c -f $dumpPath
      $env:PGPASSWORD = $null
    } else {
      $conn = $env:DATABASE_URL -replace '\?schema=public',''
      & pg_dump --dbname=$conn -F c -f $dumpPath
    }
    Log "Backup PostgreSQL concluído: $dumpPath"
  } elseif (Test-Path (Join-Path $root "server\database\construction.db")) {
    $sqliteSrc = Join-Path $root "server\database\construction.db"
    $sqliteDest = Join-Path $backups "construction_$ts.db"
    Log "Iniciando backup SQLite"
    Copy-Item $sqliteSrc $sqliteDest
    Log "Backup SQLite concluído: $sqliteDest"
  } else {
    $failed = $true
    $failures += "Banco de dados não encontrado ou DATABASE_URL não definido"
    Log "Falha: banco de dados não encontrado"
  }
} catch {
  $failed = $true
  $failures += "Erro ao executar backup do banco: $($_.Exception.Message)"
  Log "Erro: $($_.Exception.Message)"
}
try {
  if (Test-Path $logsDir) {
    $logsZip = Join-Path $backups "logs_$ts.zip"
    Log "Compactando logs em $logsZip"
    Compress-Archive -Path (Join-Path $logsDir "*") -DestinationPath $logsZip -Force
    Log "Logs compactados: $logsZip"
  } else {
    Log "Pasta de logs não encontrada, ignorando"
  }
} catch {
  $failed = $true
  $failures += "Erro ao compactar logs: $($_.Exception.Message)"
  Log "Erro: $($_.Exception.Message)"
}
try {
  $threshold = (Get-Date).AddDays(-45)
  $patterns = @("db_*.dump","construction_*.db","logs_*.zip")
  $files = Get-ChildItem -Path $backups -File | Where-Object {
    $name = $_.Name
    ($patterns | ForEach-Object { $name -like $_ }) -contains $true
  } | Where-Object { $_.LastWriteTime -lt $threshold } | Sort-Object LastWriteTime
  $toDelete = $files | Select-Object -First 3
  foreach ($f in $toDelete) {
    try {
      Log "Removendo backup antigo: $($f.FullName)"
      Remove-Item -Path $f.FullName -Force
    } catch {
      Log "Falha ao remover $($f.FullName): $($_.Exception.Message)"
    }
  }
} catch {
  Log "Erro na limpeza automática: $($_.Exception.Message)"
}
if ($failed) {
  $smtpHost = if ($env:SMTP_HOST) { $env:SMTP_HOST } else { "smtp.gmail.com" }
  $smtpPort = if ($env:SMTP_PORT) { [int]$env:SMTP_PORT } else { 587 }
  $smtpUser = $env:SMTP_USER
  $smtpPass = $env:SMTP_PASS
  $fromAddr = if ($env:SMTP_FROM) { $env:SMTP_FROM } else { $smtpUser }
  $toAddr = "edson.nascimentoc@gmail.com"
  $subject = "Backup FAILED - National Group Construction"
  $body = ($failures -join "`n")
  if ($smtpUser -and $smtpPass -and $fromAddr) {
    try {
      $sec = ConvertTo-SecureString $smtpPass -AsPlainText -Force
      $cred = New-Object System.Management.Automation.PSCredential ($smtpUser, $sec)
      Send-MailMessage -SmtpServer $smtpHost -Port $smtpPort -UseSsl -Credential $cred -From $fromAddr -To $toAddr -Subject $subject -Body $body
      Log "Notificação de falha enviada para $toAddr"
    } catch {
      Log "Falha ao enviar e-mail: $($_.Exception.Message)"
    }
  } else {
    Log "Configuração SMTP ausente; e-mail de falha não enviado"
  }
  exit 1
} else {
  Log "Backup concluído com sucesso"
  exit 0
}
