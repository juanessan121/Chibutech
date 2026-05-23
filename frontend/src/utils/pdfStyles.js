/**
 * pdfStyles.js
 * Constantes de diseño centralizadas para todos los PDFs del sistema Chibutech.
 * Modifica aquí para cambiar el look de todos los documentos.
 */

// ── INSTITUCIÓN ────────────────────────────────────────────────────────────────
export const INSTITUCION = {
  nombre: 'Junta de Agua Chibuleo',
  subtitulo: 'Sistema de Gestión Comunitaria — Chibutech',
  ruc: 'RUC: 1890001234001',
  direccion: 'Comunidad Chibuleo, Cantón Ambato, Provincia de Tungurahua',
  telefono: 'Tel: (03) 2-345-678',
};

// ── PALETA DE COLORES ──────────────────────────────────────────────────────────
export const COLORS = {
  // Primarios
  primary:      [14, 165, 233],   // #0ea5e9 — Azul principal
  primaryDark:  [3, 105, 161],    // #0369a1 — Azul oscuro
  primaryLight: [186, 230, 253],  // Azul claro (fondo header tabla)

  // Estado
  success:  [16, 185, 129],  // #10b981 — Verde
  warning:  [245, 158, 11],  // #f59e0b — Amarillo
  danger:   [239, 68, 68],   // #ef4444 — Rojo
  info:     [99, 102, 241],  // #6366f1 — Púrpura

  // Grises / Neutros
  dark:        [15, 23, 42],    // Fondo oscuro
  mediumDark:  [30, 41, 59],    // Filas pares
  medium:      [51, 65, 85],    // Bordes
  muted:       [100, 116, 139], // Texto secundario
  light:       [203, 213, 225], // Texto sobre fondo oscuro
  white:       [255, 255, 255],

  // Filas tabla
  rowEven: [248, 250, 252],    // Fila par (blanco suave)
  rowOdd:  [241, 245, 249],    // Fila impar
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
    fillColor:  COLORS.primaryDark,
    textColor:  COLORS.white,
    fontStyle:  'bold',
    fontSize:   9,
    halign:     'left',
    cellPadding: 4,
  },
  alternateRowStyles: {
    fillColor: COLORS.rowOdd,
  },
  bodyStyles: {
    fontSize:    9,
    textColor:   [30, 41, 59],
    cellPadding: 3.5,
  },
  styles: {
    overflow:   'linebreak',
    lineColor:  [203, 213, 225],
    lineWidth:  0.2,
  },
};
