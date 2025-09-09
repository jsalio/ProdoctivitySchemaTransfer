package main

import (
	"fmt"
	"image"
	"image/color"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/nfnt/resize"
	"github.com/srwiley/oksvg"
	"github.com/srwiley/rasterx"
	"golang.org/x/image/bmp"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Uso: go run main.go <archivo.svg> [tamaño]")
		fmt.Println("Ejemplo: go run main.go imagen.svg 32")
		fmt.Println("Si no se especifica tamaño, se usará 32x32 por defecto")
		os.Exit(1)
	}

	svgPath := os.Args[1]
	size := 32 // tamaño por defecto

	// Si se proporciona un tamaño como segundo argumento
	if len(os.Args) > 2 {
		_, err := fmt.Sscanf(os.Args[2], "%d", &size)
		if err != nil {
			log.Fatalf("Tamaño inválido: %v", err)
		}
	}

	// Validar que el archivo SVG existe
	if _, err := os.Stat(svgPath); os.IsNotExist(err) {
		log.Fatalf("El archivo SVG no existe: %s", svgPath)
	}

	// Convertir SVG a ICO
	err := convertSVGToICO(svgPath, size)
	if err != nil {
		log.Fatalf("Error al convertir SVG a ICO: %v", err)
	}

	fmt.Printf("✓ Conversión completada exitosamente\n")
}

func convertSVGToICO(svgPath string, size int) error {
	// Leer el archivo SVG
	svgData, err := os.ReadFile(svgPath)
	if err != nil {
		return fmt.Errorf("error al leer el archivo SVG: %v", err)
	}

	// Parsear el SVG
	icon, err := oksvg.ReadIconStream(strings.NewReader(string(svgData)))
	if err != nil {
		return fmt.Errorf("error al parsear el SVG: %v", err)
	}

	// Asegurarse de que el tamaño sea válido
	if size < 1 || size > 256 {
		size = 32
	}

	// Crear una imagen RGBA
	img := image.NewRGBA(image.Rect(0, 0, size, size))

	// Configurar el tamaño del SVG
	icon.SetTarget(0, 0, float64(size), float64(size))

	// Crear el rasterizador
	scanner := rasterx.NewScannerGV(size, size, img, img.Bounds())
	raster := rasterx.NewDasher(size, size, scanner)

	// Rellenar el fondo con blanco (opcional, puedes quitarlo si prefieres fondo transparente)
	for y := 0; y < size; y++ {
		for x := 0; x < size; x++ {
			img.SetRGBA(x, y, color.RGBA{255, 255, 255, 255})
		}
	}

	// Dibujar el SVG
	icon.Draw(raster, 1.0)

	// Generar el nombre del archivo ICO
	ext := filepath.Ext(svgPath)
	if ext == "" {
		ext = ".svg"
	}
	icoPath := strings.TrimSuffix(svgPath, ext) + ".ico"

	// Crear el archivo ICO
	icoFile, err := os.Create(icoPath)
	if err != nil {
		return fmt.Errorf("error al crear el archivo ICO: %v", err)
	}
	defer icoFile.Close()

	// Redimensionar la imagen si es necesario (asegurarse de que las dimensiones sean potencias de 2)
	resizedImg := resize.Resize(uint(size), uint(size), img, resize.Lanczos3)

	// Crear un archivo temporal BMP
	tmpFile, err := os.CreateTemp("", "temp-*.bmp")
	if err != nil {
		return fmt.Errorf("error al crear archivo temporal: %v", err)
	}
	defer os.Remove(tmpFile.Name())

	// Guardar como BMP
	err = bmp.Encode(tmpFile, resizedImg)
	if err != nil {
		return fmt.Errorf("error al codificar a BMP: %v", err)
	}
	tmpFile.Close()

	// Leer el BMP
	bmpFile, err := os.Open(tmpFile.Name())
	if err != nil {
		return fmt.Errorf("error al abrir el archivo BMP temporal: %v", err)
	}
	defer bmpFile.Close()

	// Leer la imagen BMP
	srcImg, err := bmp.Decode(bmpFile)
	if err != nil {
		return fmt.Errorf("error al decodificar BMP: %v", err)
	}

	// Crear un nuevo archivo ICO
	dst, err := os.Create(icoPath)
	if err != nil {
		return fmt.Errorf("error al crear el archivo ICO: %v", err)
	}
	defer dst.Close()

	// Escribir el encabezado ICO
	err = writeIcoHeader(dst, 1) // 1 imagen
	if err != nil {
		return fmt.Errorf("error al escribir el encabezado ICO: %v", err)
	}

	// Escribir la entrada del directorio ICO
	err = writeIcoDirectoryEntry(dst, srcImg, 0)
	if err != nil {
		return fmt.Errorf("error al escribir la entrada del directorio ICO: %v", err)
	}

	// Escribir los datos de la imagen
	err = writeIcoImageData(dst, srcImg)
	if err != nil {
		return fmt.Errorf("error al escribir los datos de la imagen ICO: %v", err)
	}

	fmt.Printf("Archivo ICO creado: %s (%dx%d)\n", icoPath, size, size)
	return nil
}

// Funciones auxiliares para escribir el archivo ICO
func writeIcoHeader(w *os.File, numImages int) error {
	header := []byte{
		0x00, 0x00, // Reserved (must be 0)
		0x01, 0x00, // Image type (1 = .ico, 2 = .cur)
		byte(numImages), 0x00, // Number of images
	}
	_, err := w.Write(header)
	return err
}

func writeIcoDirectoryEntry(w *os.File, img image.Image, offset int) error {
	b := img.Bounds()
	width, height := b.Dx(), b.Dy()
	if width > 255 || height > 255 {
		return fmt.Errorf("las dimensiones de la imagen son demasiado grandes para un ICO")
	}

	dirEntry := make([]byte, 16)
	dirEntry[0] = byte(width)        // Width
	dirEntry[1] = byte(height)       // Height
	dirEntry[2] = 0                  // Number of colors in palette (0 if no palette)
	dirEntry[3] = 0                  // Reserved (must be 0)
	dirEntry[4] = 1                  // Color planes (0 or 1)
	dirEntry[5] = 0                  // Bits per pixel
	dirEntry[6] = 32                 // Bits per pixel (32 for RGBA)
	dirEntry[7] = 0                  // Image size (0 for uncompressed)
	dirEntry[8] = byte(offset)       // Offset to image data
	dirEntry[9] = byte(offset >> 8)  // ...
	dirEntry[10] = byte(offset >> 16) // ...
	dirEntry[11] = byte(offset >> 24) // ...

	_, err := w.Write(dirEntry)
	return err
}

func writeIcoImageData(w *os.File, img image.Image) error {
	b := img.Bounds()
	width, height := b.Dx(), b.Dy()

	// Escribir el encabezado BITMAPINFOHEADER
	header := make([]byte, 40)
	header[0] = 40                  // Tamaño del encabezado (40 bytes)
	header[4] = byte(width)         // Ancho
	header[5] = byte(width >> 8)    // ...
	header[6] = byte(width >> 16)   // ...
	header[7] = byte(width >> 24)   // ...
	header[8] = byte(height * 2)    // Alto (doble para el formato AND mask)
	header[9] = byte((height * 2) >> 8)
	header[10] = byte((height * 2) >> 16)
	header[11] = byte((height * 2) >> 24)
	header[12] = 1                  // Planos (siempre 1)
	header[14] = 32                 // Bits por píxel (32 para RGBA)
	header[32] = 32                 // Tamaño de la imagen en bytes

	_, err := w.Write(header)
	if err != nil {
		return err
	}

	// Escribir los datos de píxeles (en orden BGRA)
	for y := height - 1; y >= 0; y-- {
		for x := 0; x < width; x++ {
			r, g, b, a := img.At(x, y).RGBA()
			_, err = w.Write([]byte{
				byte(b >> 8),
				byte(g >> 8),
				byte(r >> 8),
				byte(a >> 8),
			})
			if err != nil {
				return err
			}
		}
	}

	// Escribir la máscara AND (todo 0 para transparencia)
	maskRowSize := (width + 31) / 32 * 4
	mask := make([]byte, maskRowSize*height)
	_, err = w.Write(mask)

	return err
}
