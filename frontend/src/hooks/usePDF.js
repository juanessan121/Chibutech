import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { INSTITUCION, COLORS, FONTS, LAYOUT, TABLE_STYLES } from '../utils/pdfStyles';

import axios from '../services/axiosConfig';

// ──────────────────────────────────────────────────────────────────────────────
// API DATA FETCHERS
// ──────────────────────────────────────────────────────────────────────────────


// ──────────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────────

/** Dibuja el header institucional en todas las páginas */
function dibujarHeader(doc, titulo, subtituloDoc = '') {
  const pageW = doc.internal.pageSize.getWidth();

  // Fondo del header
  doc.setFillColor(...COLORS.primaryLight);
  doc.rect(0, 0, pageW, LAYOUT.headerHeight, 'F');

  // Línea de acento inferior
  doc.setFillColor(...COLORS.primaryDark);
  doc.rect(0, LAYOUT.headerHeight - 2, pageW, 2, 'F');

  // ── COLUMNA IZQUIERDA ────────────────────────────────────────────
  // Nombre institución — dos líneas para evitar solapamiento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('Consejo de Gobierno Comunitario', LAYOUT.marginLeft, 12);

  doc.setFontSize(11);
  doc.text('Chibuleo-San Francisco', LAYOUT.marginLeft, 19);

  // Subtítulo sistema
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.mediumDark);
  doc.text(INSTITUCION.subtitulo, LAYOUT.marginLeft, 27);

  // Dirección | teléfono
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(`${INSTITUCION.direccion} | ${INSTITUCION.telefono}`, LAYOUT.marginLeft, 34);

  // ── COLUMNA DERECHA ──────────────────────────────────────────────
  // Tipo de documento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(titulo.toUpperCase(), pageW - LAYOUT.marginRight, 12, { align: 'right' });

  // Período / subtítulo del documento
  if (subtituloDoc) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.mediumDark);
    doc.text(subtituloDoc, pageW - LAYOUT.marginRight, 20, { align: 'right' });
  }

  // Fecha de generación
  const hoy = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generado: ${hoy}`, pageW - LAYOUT.marginRight, subtituloDoc ? 28 : 20, { align: 'right' });
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
    // Línea 1: nombre institución (izq) + número de página (der)
    doc.text('Consejo de Gobierno Comunitario Chibuleo-San Francisco', LAYOUT.marginLeft, LAYOUT.footerY + 5);
    doc.text(`Página ${i} de ${pageCount}`, pageW - LAYOUT.marginRight, LAYOUT.footerY + 5, { align: 'right' });
    // Línea 2: leyenda electrónica (centrada)
    doc.setFontSize(6.5);
    doc.text('Documento generado electrónicamente — Sistema de Gestión Comunitaria', pageW / 2, LAYOUT.footerY + 10, { align: 'center' });
  }
}

/** Dibuja las líneas de firma al final del documento */
function dibujarFirmas(doc, y, directiva = []) {
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

  // Buscar nombres en la directiva activa
  const getNombreCargo = (nombreCargo, defecto) => {
    if (!directiva || directiva.length === 0) return defecto;
    const miembro = directiva.find(m => m.cargo && m.cargo.toLowerCase().includes(nombreCargo.toLowerCase()));
    return miembro ? miembro.nombre : defecto;
  };

  doc.text(getNombreCargo('Presidente', '_________________'), x1 + w/2, y + 10, { align: 'center' });
  doc.text(getNombreCargo('Secretario', '_________________'), x2 + w/2, y + 10, { align: 'center' });
  doc.text(getNombreCargo('Tesorero', '_________________'), x3 + w/2, y + 10, { align: 'center' });
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
      // 1. Obtener datos reales de la API
      const [resPadron, resDirectiva] = await Promise.all([
        axios.get('/reportes/padron'),
        axios.get('/directiva/actual').catch(() => ({ data: { data: [] } }))
      ]);
      let datos = resPadron.data.data;
      const directivaActiva = resDirectiva.data.data;

      // 2. Aplicar filtros jerárquicos: sector específico > todos de la zona > sin filtro
      if (filtros.nombreSector) {
        datos = datos.filter(u => u.sector === filtros.nombreSector);
      } else if (filtros.sectoresDeLaZona?.length > 0) {
        datos = datos.filter(u => filtros.sectoresDeLaZona.includes(u.sector));
      }

      const filtroTexto = filtros.nombreSector
        ? filtros.nombreSector
        : filtros.nombreZona
          ? `Zona ${filtros.nombreZona} (todos los sectores)`
          : 'Todos los sectores';

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      dibujarHeader(doc, 'PADRÓN DE USUARIOS', `Total registros: ${datos.length}`);

      // Meta info
      let y = dibujarMetaBloque(doc, [
        { label: 'Total Registros', value: datos.length },
        { label: 'Vivos',           value: datos.filter(u => u.estado === 'Vivo').length },
        { label: 'Fallecidos',      value: datos.filter(u => u.estado === 'Fallecido').length },
        { label: 'Filtro Aplicado', value: filtroTexto },
      ], LAYOUT.headerHeight + 5);

      // Título de sección
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.section.size);
      doc.setTextColor(...COLORS.primaryDark);
      doc.text('Lista de Propietarios y Terrenos', LAYOUT.marginLeft, y);
      y += 6;

      // Tabla
      autoTable(doc, {
        startY: y,
        head: [['#', 'Cédula', 'Nombre Completo', 'Sector', 'Clave Catastral', 'Área (m²)', 'Estado']],
        body: datos.map((u, i) => [i + 1, u.cedula, u.nombre, u.sector, u.clave_catastral || 'S/C', u.area_m2, u.estado]),
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
                if (estado === 'Vivo')      data.cell.styles.textColor = COLORS.success;
                if (estado === 'Fallecido') data.cell.styles.textColor = COLORS.danger;
              }
            }
          },
        },
        didDrawPage: () => {},
      });

      dibujarFirmas(doc, doc.lastAutoTable.finalY, directivaActiva);
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
      const queryParams = new URLSearchParams();
      if (filtros.fechaDesde) queryParams.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) queryParams.append('fechaHasta', filtros.fechaHasta);
      
      const endpoint = `/reportes/morosos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const [resMorosos, resDirectiva] = await Promise.all([
        axios.get(endpoint),
        axios.get('/directiva/actual').catch(() => ({ data: { data: [] } }))
      ]);
      let datos = resMorosos.data.data;
      const directivaActiva = resDirectiva.data.data;
      
      const montoMin = parseFloat(filtros.montoMin) || 0;
      if (montoMin > 0) datos = datos.filter(u => parseFloat(u.monto) >= montoMin);

      const totalDeuda = datos.reduce((acc, u) => acc + parseFloat(u.monto), 0);

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
          `$${parseFloat(u.monto).toFixed(2)}`,
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

      dibujarFirmas(doc, doc.lastAutoTable.finalY, directivaActiva);
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
      const periodo = filtros.periodo || 'este_mes';
      const [resBalance, resDirectiva] = await Promise.all([
        axios.get(`/reportes/balance?periodo=${periodo}`),
        axios.get('/directiva/actual').catch(() => ({ data: { data: [] } }))
      ]);
      const { resumen, ingresos, egresos } = resBalance.data.data;
      const directivaActiva = resDirectiva.data.data;

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const periodoTexto = periodo === 'este_mes' ? 'Mes Actual' : periodo;

      dibujarHeader(doc, 'BALANCE FINANCIERO', `Período: ${periodoTexto}`);

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

      dibujarFirmas(doc, finalY + 14, directivaActiva);
      dibujarFooter(doc);
      if (modo === 'preview') return doc.output('bloburl');
      doc.save(`balance_financiero_${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generarPadron, generarMorosos, generarBalance, isGenerating };
}
