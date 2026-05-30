import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { INSTITUCION, COLORS, FONTS, LAYOUT, TABLE_STYLES } from '../utils/pdfStyles';

// ──────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Reemplazar con llamadas reales a la API cuando esté disponible)
// ──────────────────────────────────────────────────────────────────────────────
const MOCK_PADRON = [
  { cedula: '1801234567', nombre: 'Juan Pérez Masaquiza',      sector: 'Centro',        rol: 'Comunero',   estado: 'Activo',     terreno: 'Lote #12' },
  { cedula: '1809876543', nombre: 'María Ainaguano Lliguin',   sector: 'San Luis',      rol: 'Directiva',  estado: 'Activo',     terreno: 'Lote #07' },
  { cedula: '1804567890', nombre: 'Pedro Jerez Chimborazo',    sector: 'Centro',        rol: 'Comunero',   estado: 'Suspendido', terreno: 'Lote #34' },
  { cedula: '1801112223', nombre: 'Carmen Lliguin Toalombo',   sector: 'San Francisco', rol: 'Comunero',   estado: 'Activo',     terreno: 'Lote #45' },
  { cedula: '1803334445', nombre: 'Luis Toalombo Punina',      sector: 'San Luis',      rol: 'Comunero',   estado: 'Activo',     terreno: 'Lote #22' },
  { cedula: '1805556667', nombre: 'Rosa Punina Masaquiza',     sector: 'Centro',        rol: 'Comunero',   estado: 'Activo',     terreno: 'Lote #18' },
  { cedula: '1807778889', nombre: 'Antonio Chimbo Jerez',      sector: 'San Francisco', rol: 'Comunero',   estado: 'Activo',     terreno: 'Lote #56' },
  { cedula: '1802223334', nombre: 'Elena Masaquiza Amanta',    sector: 'San Luis',      rol: 'Directiva',  estado: 'Activo',     terreno: 'Lote #03' },
  { cedula: '1806667778', nombre: 'Carlos Amanta Quillupangui',sector: 'Centro',        rol: 'Comunero',   estado: 'Inactivo',   terreno: 'Lote #29' },
  { cedula: '1804445556', nombre: 'Josefa Quillupangui Tisalema',sector:'San Francisco',rol: 'Comunero',   estado: 'Activo',     terreno: 'Lote #61' },
];

const MOCK_MOROSOS = [
  { cedula: '1801234567', nombre: 'Juan Pérez Masaquiza',     sector: 'Centro',        concepto: 'Inasistencia Minga',    monto: 15.00, fecha_vence: '2024-10-30', estado: 'En Mora' },
  { cedula: '1804567890', nombre: 'Pedro Jerez Chimborazo',   sector: 'Centro',        concepto: 'Deuda por Servicio',    monto: 45.50, fecha_vence: '2024-09-15', estado: 'Vencido' },
  { cedula: '1806667778', nombre: 'Carlos Amanta Quillupangui',sector:'Centro',         concepto: 'Multa Disciplinaria',   monto: 25.00, fecha_vence: '2024-11-05', estado: 'Pendiente' },
  { cedula: '1807778889', nombre: 'Antonio Chimbo Jerez',     sector: 'San Francisco', concepto: 'Inasistencia Minga',    monto: 15.00, fecha_vence: '2024-10-28', estado: 'En Mora' },
  { cedula: '1801112223', nombre: 'Carmen Lliguin Toalombo',  sector: 'San Francisco', concepto: 'Deuda por Servicio',    monto: 32.80, fecha_vence: '2024-10-01', estado: 'Vencido' },
];

const MOCK_BALANCE = {
  resumen: { ingresos: 2340.50, egresos: 890.00, saldo: 1450.50 },
  ingresos: [
    { fecha: '2024-10-01', concepto: 'Cobro planilla mensual - 45 comuneros', monto: 1350.00 },
    { fecha: '2024-10-05', concepto: 'Multas por inasistencia Minga #12',      monto: 450.00  },
    { fecha: '2024-10-12', concepto: 'Multas disciplinarias varios',           monto: 125.00  },
    { fecha: '2024-10-18', concepto: 'Cuota extraordinaria mantenimiento',     monto: 415.50  },
  ],
  egresos: [
    { fecha: '2024-10-03', concepto: 'Compra materiales limpieza acequia',     monto: 245.00 },
    { fecha: '2024-10-08', concepto: 'Mantenimiento motor bomba principal',    monto: 380.00 },
    { fecha: '2024-10-15', concepto: 'Refrigerios asamblea general',           monto: 120.00 },
    { fecha: '2024-10-22', concepto: 'Pago asistente administrativo parcial',  monto: 145.00 },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────────

/** Dibuja el header institucional en todas las páginas */
function dibujarHeader(doc, titulo, subtituloDoc = '') {
  const pageW = doc.internal.pageSize.getWidth();

  // Fondo del header
  doc.setFillColor(...COLORS.primaryLight);
  doc.rect(0, 0, pageW, LAYOUT.headerHeight, 'F');

  // Línea de acento
  doc.setFillColor(...COLORS.primaryDark);
  doc.rect(0, LAYOUT.headerHeight - 2, pageW, 2, 'F');

  // Nombre institución
  doc.setFont('helvetica', FONTS.title.style);
  doc.setFontSize(FONTS.title.size);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(INSTITUCION.nombre, LAYOUT.marginLeft, 16);

  // Subtítulo sistema
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.mediumDark);
  doc.text(INSTITUCION.subtitulo, LAYOUT.marginLeft, 23);

  // Dirección
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(`${INSTITUCION.direccion} | ${INSTITUCION.telefono}`, LAYOUT.marginLeft, 30);

  // Tipo de documento (derecha)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(titulo.toUpperCase(), pageW - LAYOUT.marginRight, 16, { align: 'right' });

  if (subtituloDoc) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.mediumDark);
    doc.text(subtituloDoc, pageW - LAYOUT.marginRight, 23, { align: 'right' });
  }

  // Fecha de generación
  const hoy = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFontSize(8);
  doc.text(`Generado: ${hoy}`, pageW - LAYOUT.marginRight, 30, { align: 'right' });
}

/** Dibuja el pie de página con numeración */
function dibujarFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageW = doc.internal.pageSize.getWidth();
    doc.setDrawColor(...COLORS.medium);
    doc.setLineWidth(0.3);
    doc.line(LAYOUT.marginLeft, LAYOUT.footerY, pageW - LAYOUT.marginRight, LAYOUT.footerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.footer.size);
    doc.setTextColor(...COLORS.muted);
    doc.text(INSTITUCION.nombre, LAYOUT.marginLeft, LAYOUT.footerY + 5);
    doc.text(`Página ${i} de ${pageCount}`, pageW - LAYOUT.marginRight, LAYOUT.footerY + 5, { align: 'right' });
    doc.text('Documento generado electrónicamente por Chibutech', pageW / 2, LAYOUT.footerY + 5, { align: 'center' });
  }
}

/** Dibuja las líneas de firma al final del documento */
function dibujarFirmas(doc, y) {
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  
  if (y + 40 > pageH - 20) {
    doc.addPage();
    y = LAYOUT.headerHeight + 20;
  } else {
    y += 30;
  }

  doc.setDrawColor(...COLORS.dark);
  doc.setLineWidth(0.4);
  
  const w = 45; 
  const gap = (pageW - LAYOUT.marginLeft - LAYOUT.marginRight - (w * 3)) / 2;
  
  const x1 = LAYOUT.marginLeft;
  const x2 = x1 + w + gap;
  const x3 = x2 + w + gap;

  doc.line(x1, y, x1 + w, y);
  doc.line(x2, y, x2 + w, y);
  doc.line(x3, y, x3 + w, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.dark);
  
  doc.text('PRESIDENTE', x1 + w/2, y + 5, { align: 'center' });
  doc.text('SECRETARIO', x2 + w/2, y + 5, { align: 'center' });
  doc.text('TESORERO', x3 + w/2, y + 5, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.text('Luis Alberto Sisa', x1 + w/2, y + 10, { align: 'center' });
  doc.text('José María Lliguin', x2 + w/2, y + 10, { align: 'center' });
  doc.text('Carmen Toalombo', x3 + w/2, y + 10, { align: 'center' });
}

/** Dibujar bloque de info (clave: valor) en fila horizontal */
function dibujarMetaBloque(doc, items, y) {
  const pageW = doc.internal.pageSize.getWidth();
  const colW = (pageW - LAYOUT.marginLeft - LAYOUT.marginRight) / items.length;
  doc.setDrawColor(...COLORS.light);
  doc.setLineWidth(0.2);
  doc.roundedRect(LAYOUT.marginLeft, y, pageW - LAYOUT.marginLeft - LAYOUT.marginRight, 14, 1, 1, 'S');
  items.forEach((item, idx) => {
    const x = LAYOUT.marginLeft + idx * colW + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(item.label.toUpperCase(), x, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.dark);
    doc.text(String(item.value), x, y + 12);
  });
  return y + 20;
}

// ──────────────────────────────────────────────────────────────────────────────
// HOOK PRINCIPAL
// ──────────────────────────────────────────────────────────────────────────────

export function usePDF() {
  const [isGenerating, setIsGenerating] = useState(false);

  // ── 1. PADRÓN DE USUARIOS ──────────────────────────────────────────────────
  const generarPadron = useCallback(async (filtros = {}, modo = 'download') => {
    setIsGenerating(true);
    try {
      // Filtrar mock data según filtros recibidos
      let datos = [...MOCK_PADRON];
      if (filtros.sector && filtros.sector !== 'todos') {
        const sectorMap = { '1': 'Centro', '2': 'San Luis', '3': 'San Francisco' };
        datos = datos.filter(u => u.sector === sectorMap[filtros.sector]);
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      dibujarHeader(doc, 'PADRÓN DE USUARIOS', `Total registros: ${datos.length}`);

      // Meta info
      let y = dibujarMetaBloque(doc, [
        { label: 'Total Comuneros', value: datos.length },
        { label: 'Activos',         value: datos.filter(u => u.estado === 'Activo').length },
        { label: 'Suspendidos',     value: datos.filter(u => u.estado === 'Suspendido').length },
        { label: 'Sector Filtrado', value: filtros.sector === 'todos' || !filtros.sector ? 'Todos' : filtros.sector },
      ], LAYOUT.headerHeight + 5);

      // Título de sección
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.section.size);
      doc.setTextColor(...COLORS.primaryDark);
      doc.text('Lista de Comuneros Registrados', LAYOUT.marginLeft, y);
      y += 6;

      // Tabla
      autoTable(doc, {
        startY: y,
        head: [['#', 'Cédula', 'Nombre Completo', 'Sector', 'Rol', 'Terreno', 'Estado']],
        body: datos.map((u, i) => [i + 1, u.cedula, u.nombre, u.sector, u.rol, u.terreno, u.estado]),
        ...TABLE_STYLES,
        columnStyles: {
          0: { cellWidth: 8,  halign: 'center' },
          1: { cellWidth: 28 },
          2: { cellWidth: 55 },
          3: { cellWidth: 28 },
          4: { cellWidth: 22 },
          5: { cellWidth: 20 },
          6: {
            cellWidth: 20, halign: 'center',
            // Colorear estado
            didParseCell: (data) => {
              if (data.section === 'body') {
                const estado = data.cell.raw;
                if (estado === 'Activo')     data.cell.styles.textColor = COLORS.success;
                if (estado === 'Suspendido') data.cell.styles.textColor = COLORS.danger;
                if (estado === 'Inactivo')   data.cell.styles.textColor = COLORS.muted;
              }
            }
          },
        },
        didDrawPage: () => {},
      });

      dibujarFirmas(doc, doc.lastAutoTable.finalY);
      dibujarFooter(doc);
      if (modo === 'preview') return doc.output('bloburl');
      doc.save(`padron_usuarios_${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // ── 2. REPORTE DE MOROSIDAD ────────────────────────────────────────────────
  const generarMorosos = useCallback(async (filtros = {}, modo = 'download') => {
    setIsGenerating(true);
    try {
      let datos = [...MOCK_MOROSOS];
      const montoMin = parseFloat(filtros.montoMin) || 0;
      if (montoMin > 0) datos = datos.filter(u => u.monto >= montoMin);

      const totalDeuda = datos.reduce((acc, u) => acc + u.monto, 0);

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      dibujarHeader(doc, 'REPORTE DE MOROSIDAD', `Período: ${new Date().toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}`);

      let y = dibujarMetaBloque(doc, [
        { label: 'Usuarios Morosos', value: datos.length },
        { label: 'Total en Mora',    value: `$${totalDeuda.toFixed(2)}` },
        { label: 'Monto Mínimo',     value: montoMin > 0 ? `$${montoMin}` : 'Sin filtro' },
        { label: 'Fecha Reporte',    value: new Date().toLocaleDateString('es-EC') },
      ], LAYOUT.headerHeight + 5);

      // ⚠️ Banner de alerta si hay deuda alta
      if (totalDeuda > 100) {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(100, 116, 139);
        doc.setLineWidth(0.2);
        doc.roundedRect(LAYOUT.marginLeft, y - 2, doc.internal.pageSize.getWidth() - LAYOUT.marginLeft - LAYOUT.marginRight, 10, 1, 1, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(`ATENCION: La deuda total acumulada supera los $100.00.`, LAYOUT.marginLeft + 4, y + 4);
        y += 14;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.section.size);
      doc.setTextColor(...COLORS.primaryDark);
      doc.text('DETALLE DE DEUDAS PENDIENTES', LAYOUT.marginLeft, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [['#', 'Cédula', 'Nombre', 'Sector', 'Concepto', 'Vence', 'Monto', 'Estado']],
        body: datos.map((u, i) => [
          i + 1,
          u.cedula,
          u.nombre,
          u.sector,
          u.concepto,
          u.fecha_vence,
          `$${u.monto.toFixed(2)}`,
          u.estado,
        ]),
        ...TABLE_STYLES,
        columnStyles: {
          0: { cellWidth: 7,  halign: 'center' },
          1: { cellWidth: 25 },
          2: { cellWidth: 48 },
          3: { cellWidth: 22 },
          4: { cellWidth: 38 },
          5: { cellWidth: 20 },
          6: { cellWidth: 16, halign: 'right', fontStyle: 'bold' },
          7: { cellWidth: 18, halign: 'center' },
        },
        foot: [['', '', '', '', '', 'TOTAL', `$${totalDeuda.toFixed(2)}`, '']],
        footStyles: {
          fillColor: COLORS.primaryLight,
          textColor: COLORS.primaryDark,
          fontStyle: 'bold',
          fontSize: 9,
        },
      });

      dibujarFirmas(doc, doc.lastAutoTable.finalY);
      dibujarFooter(doc);
      if (modo === 'preview') return doc.output('bloburl');
      doc.save(`reporte_morosos_${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // ── 3. BALANCE FINANCIERO ──────────────────────────────────────────────────
  const generarBalance = useCallback(async (filtros = {}, modo = 'download') => {
    setIsGenerating(true);
    try {
      const { resumen, ingresos, egresos } = MOCK_BALANCE;

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const periodo = filtros.periodo || 'Octubre 2024';

      dibujarHeader(doc, 'BALANCE FINANCIERO', `Período: ${periodo}`);

      let y = dibujarMetaBloque(doc, [
        { label: 'Total Ingresos', value: `$${resumen.ingresos.toFixed(2)}` },
        { label: 'Total Egresos',  value: `$${resumen.egresos.toFixed(2)}`  },
        { label: 'Saldo Actual',   value: `$${resumen.saldo.toFixed(2)}`    },
        { label: 'Estado Caja',    value: resumen.saldo > 0 ? 'POSITIVO' : 'DEFICIT' },
      ], LAYOUT.headerHeight + 5);

      // ── Cuadro de resumen visual ──
      const boxW = (pageW - LAYOUT.marginLeft - LAYOUT.marginRight - 8) / 3;

      // Estilo de cuadros minimalistas
      doc.setDrawColor(...COLORS.light);
      doc.setLineWidth(0.2);

      // Ingresos
      doc.roundedRect(LAYOUT.marginLeft, y, boxW, 20, 1, 1, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...COLORS.muted);
      doc.text('INGRESOS TOTALES', LAYOUT.marginLeft + 4, y + 6);
      doc.setFontSize(12); doc.setTextColor(...COLORS.primaryDark);
      doc.text(`$${resumen.ingresos.toFixed(2)}`, LAYOUT.marginLeft + 4, y + 15);

      // Egresos
      doc.roundedRect(LAYOUT.marginLeft + boxW + 4, y, boxW, 20, 1, 1, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...COLORS.muted);
      doc.text('EGRESOS TOTALES', LAYOUT.marginLeft + boxW + 8, y + 6);
      doc.setFontSize(12); doc.setTextColor(...COLORS.primaryDark);
      doc.text(`$${resumen.egresos.toFixed(2)}`, LAYOUT.marginLeft + boxW + 8, y + 15);

      // Saldo
      doc.setFillColor(...COLORS.primaryLight);
      doc.roundedRect(LAYOUT.marginLeft + (boxW + 4) * 2, y, boxW, 20, 1, 1, 'FD');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...COLORS.muted);
      doc.text('SALDO NETO', LAYOUT.marginLeft + (boxW + 4) * 2 + 4, y + 6);
      doc.setFontSize(12); doc.setTextColor(...COLORS.primaryDark);
      doc.text(`$${resumen.saldo.toFixed(2)}`, LAYOUT.marginLeft + (boxW + 4) * 2 + 4, y + 15);

      y += 28;

      // ── Tabla de Ingresos ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.section.size);
      doc.setTextColor(...COLORS.primaryDark);
      doc.text('DETALLE DE INGRESOS', LAYOUT.marginLeft, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [['Fecha', 'Concepto', 'Monto']],
        body: ingresos.map(i => [i.fecha, i.concepto, `$${i.monto.toFixed(2)}`]),
        ...TABLE_STYLES,
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
        },
        foot: [['', 'SUBTOTAL INGRESOS', `$${resumen.ingresos.toFixed(2)}`]],
        footStyles: { fillColor: COLORS.primaryLight, textColor: COLORS.primaryDark, fontStyle: 'bold', fontSize: 9 },
      });

      y = doc.lastAutoTable.finalY + 8;

      // ── Tabla de Egresos ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.section.size);
      doc.setTextColor(...COLORS.primaryDark);
      doc.text('DETALLE DE EGRESOS', LAYOUT.marginLeft, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [['Fecha', 'Concepto', 'Monto']],
        body: egresos.map(e => [e.fecha, e.concepto, `$${e.monto.toFixed(2)}`]),
        ...TABLE_STYLES,
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
        },
        foot: [['', 'SUBTOTAL EGRESOS', `$${resumen.egresos.toFixed(2)}`]],
        footStyles: { fillColor: COLORS.primaryLight, textColor: COLORS.primaryDark, fontStyle: 'bold', fontSize: 9 },
      });

      // ── Saldo final ──
      const finalY = doc.lastAutoTable.finalY + 5;
      doc.setDrawColor(...COLORS.medium);
      doc.setLineWidth(0.3);
      doc.rect(LAYOUT.marginLeft, finalY, pageW - LAYOUT.marginLeft - LAYOUT.marginRight, 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.primaryDark);
      doc.text('SALDO NETO DE CAJA:', LAYOUT.marginLeft + 5, finalY + 7);
      doc.text(`$${resumen.saldo.toFixed(2)}`, pageW - LAYOUT.marginRight - 5, finalY + 7, { align: 'right' });

      dibujarFirmas(doc, finalY + 14);
      dibujarFooter(doc);
      if (modo === 'preview') return doc.output('bloburl');
      doc.save(`balance_financiero_${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generarPadron, generarMorosos, generarBalance, isGenerating };
}
