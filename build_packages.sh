#!/bin/bash

# Ruta del proyecto (asumiendo que el script se ejecuta desde la raíz del proyecto)
PROJECT_ROOT=$(pwd)
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
DIST_DIR="$FRONTEND_DIR/dist"
DISTRIBUTABLE_DIR="$PROJECT_ROOT/Distributable"
BACKEND_TARGET="$DISTRIBUTABLE_DIR/sample/browser/backend"

cd ../..
echo "Directory: $PROJECT_ROOT"

echo "🔍 Verificando compilación del frontend..."

# 1. Validar si existe la carpeta dist en frontend
if [ ! -d "$DIST_DIR" ]; then
  echo "❌ No has ejecutado los scripts de compilación del frontend."
  exit 1
fi

# 2. Crear carpeta Distributable en la raíz
mkdir -p "$DISTRIBUTABLE_DIR"

# 3. Copiar contenido de dist a Distributable
cp -r "$DIST_DIR"/* "$DISTRIBUTABLE_DIR/"

echo "✅ Archivos del frontend copiados a $DISTRIBUTABLE_DIR"

# 4. Buscar archivo .exe en backend
echo "🔍 Verificando compilación del backend..."
cd "$BACKEND_DIR" || exit 1
BACKEND_EXE=$(find . -maxdepth 1 -type f -name "*.exe" | head -n 1)

if [ -z "$BACKEND_EXE" ]; then
  echo "❌ No has ejecutado los scripts de compilación del backend."
  exit 1
fi

# 5. Modificar permisos del archivo .exe
chmod 777 "$BACKEND_EXE"

# 6. Crear carpeta destino en Distributable
mkdir -p "$BACKEND_TARGET"

# 7. Mover archivo .exe
mv "$BACKEND_EXE" "$BACKEND_TARGET/"

echo "✅ Backend ejecutable movido a $BACKEND_TARGET"

# 8. Mensaje final
echo "🎉 El proceso de empaquetado finalizó correctamente."
