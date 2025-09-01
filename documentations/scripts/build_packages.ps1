# Ruta del proyecto (asumiendo que se ejecuta desde la raíz)
$ProjectRoot = Get-Location
$FrontendDir = Join-Path $ProjectRoot "frontend"
$BackendDir = Join-Path $ProjectRoot "backend"
$DistDir = Join-Path $FrontendDir "dist"
$DistributableDir = Join-Path $ProjectRoot "Distributable"
$BackendTarget = Join-Path $DistributableDir "app-schema\browser\backend"

Write-Output "🔍 Verificando compilación del frontend..."

# 1. Verificar si existe dist
if (!(Test-Path $DistDir)) {
    Write-Error "❌ No has ejecutado los scripts de compilación del frontend."
    exit 1
}

# 2. Crear carpeta Distributable
New-Item -ItemType Directory -Force -Path $DistributableDir | Out-Null

# 3. Copiar dist
Copy-Item -Path "$DistDir\*" -Destination $DistributableDir -Recurse -Force

Write-Output "✅ Archivos del frontend copiados a $DistributableDir"

# 4. Buscar .exe en backend
Write-Output "🔍 Verificando compilación del backend..."
$BackendExe = Get-ChildItem -Path $BackendDir -Filter *.exe -File | Select-Object -First 1

if (-not $BackendExe) {
    Write-Error "❌ No has ejecutado los scripts de compilación del backend."
    exit 1
}

# 5. Dar permisos de ejecución total (equivalente a chmod 777)
icacls $BackendExe.FullName /grant Everyone:F | Out-Null

# 6. Crear carpeta destino
New-Item -ItemType Directory -Force -Path $BackendTarget | Out-Null

# 7. Mover el .exe
Move-Item -Path $BackendExe.FullName -Destination $BackendTarget -Force

Write-Output "✅ Backend ejecutable movido a $BackendTarget"

# 8. Mensaje final
Write-Output "🎉 El proceso de empaquetado finalizó correctamente."
