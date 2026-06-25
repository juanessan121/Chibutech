/**
 * pdfStyles.js
 * Constantes de diseño centralizadas para todos los PDFs del sistema Chibutech.
 * Modifica aquí para cambiar el look de todos los documentos.
 */

// ── INSTITUCIÓN ────────────────────────────────────────────────────────────────
export const INSTITUCION = {
  nombre: 'Consejo de Gobierno Comunitario Chibuleo-San Francisco',
  subtitulo: 'Sistema de Gestión Comunitaria',
  ruc: 'RUC: 1890001234001',
  direccion: 'Comunidad Chibuleo, Cantón Ambato, Provincia de Tungurahua',
  telefono: 'Tel: (03) 2-345-678',
};

// ── PALETA DE COLORES ──────────────────────────────────────────────────────────
export const COLORS = {
  // Corporativo / Minimalista
  primary:      [30, 41, 59],     // Slate 800 - Principal oscuro
  primaryDark:  [15, 23, 42],     // Slate 900 - Títulos
  primaryLight: [241, 245, 249],  // Slate 100 - Fondos suaves

  // Estado (suavizados para un look empresarial)
  success:  [15, 23, 42],    // Gris oscuro en lugar de verde vibrante
  warning:  [71, 85, 105],   // Slate 600
  danger:   [15, 23, 42],    // Gris oscuro en lugar de rojo
  info:     [30, 41, 59],    // Slate 800

  // Grises / Neutros
  dark:        [15, 23, 42],    
  mediumDark:  [51, 65, 85],    
  medium:      [148, 163, 184], 
  muted:       [100, 116, 139], 
  light:       [203, 213, 225], 
  white:       [255, 255, 255],

  // Filas tabla
  rowEven: [255, 255, 255],    // Fila par
  rowOdd:  [248, 250, 252],    // Fila impar
};

// ── TIPOGRAFÍA ─────────────────────────────────────────────────────────────────
export const FONTS = {
  title:    { size: 18, style: 'bold' },
  subtitle: { size: 11, style: 'normal' },
  section:  { size: 13, style: 'bold' },
  tableHeader: { size: 9, style: 'bold' },
  tableBody:   { size: 9, style: 'normal' },
  footer:   { size: 8, style: 'normal' },
  meta:     { size: 9, style: 'italic' },
};

// ── MÁRGENES Y LAYOUT ──────────────────────────────────────────────────────────
export const LAYOUT = {
  marginLeft:   15,
  marginRight:  15,
  marginTop:    15,
  headerHeight: 45,  // Alto del bloque de header institucional
  footerY:      280, // Posición Y del pie de página (A4 = 297mm)
};

// ── TABLA — CONFIGURACIÓN DEFAULT ─────────────────────────────────────────────
export const TABLE_STYLES = {
  headStyles: {
    fillColor:  [241, 245, 249],  // Fondo gris muy claro
    textColor:  [15, 23, 42],     // Texto casi negro
    fontStyle:  'bold',
    fontSize:   8,
    halign:     'left',
    cellPadding: 4,
    lineColor: [203, 213, 225],
    lineWidth: 0.1,
  },
  alternateRowStyles: {
    fillColor: [250, 250, 250],
  },
  bodyStyles: {
    fontSize:    8,
    textColor:   [51, 65, 85],
    cellPadding: 4,
  },
  styles: {
    overflow:   'linebreak',
    lineColor:  [226, 232, 240],
    lineWidth:  0.1,
  },
};
