export const mockCaja = [
  { id: 1, fecha: '2026-05-01', tipo: 'Ingreso', concepto: 'Aporte Mensual Socios', monto: 1200.00, balance: 5200.00 },
  { id: 2, fecha: '2026-05-05', tipo: 'Egreso', concepto: 'Compra Materiales Minga', monto: -300.00, balance: 4900.00 },
  { id: 3, fecha: '2026-05-12', tipo: 'Ingreso', concepto: 'Pago Multas Retrasadas', monto: 150.00, balance: 5050.00 },
  { id: 4, fecha: '2026-05-18', tipo: 'Egreso', concepto: 'Mantenimiento Herramientas', monto: -100.00, balance: 4950.00 },
];

export const resumenCaja = {
  ingresosTotales: 15500.00,
  egresosTotales: 10550.00,
  balanceActual: 4950.00
};
