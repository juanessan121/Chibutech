import React from 'react';
import { Users, Droplets, Receipt, Banknote, Activity } from 'lucide-react';
import CardStat from '../components/CardStat';
import Table from '../components/Table';
import EmptyState from '../components/EmptyState';
import { mockDashboard } from '../data/dashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { totalSocios, mingasActivas, multasPendientes, ingresosMes, egresosMes, actividadReciente } = mockDashboard;

  const activityColumns = [
    { header: 'Descripción', accessor: 'descripcion' },
    { header: 'Tiempo', accessor: 'tiempo' }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard General</h1>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Activity size={18} />
            Generar Reporte
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <CardStat title="Total Socios" value={totalSocios} icon={Users} colorClass="stat-turquoise" />
        <CardStat title="Mingas Activas" value={mingasActivas} icon={Droplets} colorClass="stat-green" />
        <CardStat title="Multas Pendientes" value={multasPendientes} icon={Receipt} colorClass="stat-red" />
        <CardStat title="Ingresos (Mes)" value={`$${ingresosMes.toFixed(2)}`} icon={Banknote} colorClass="stat-yellow" />
      </div>

      <div className="dashboard-charts">
        <div className="content-card">
          <div className="content-header">
            <h3>Actividad Reciente</h3>
          </div>
          {actividadReciente.length > 0 ? (
             <Table columns={activityColumns} data={actividadReciente} />
          ) : (
            <EmptyState title="Sin actividad" message="No hay actividad reciente registrada en el sistema." />
          )}
        </div>
        
        <div className="content-card">
          <div className="content-header">
            <h3>Estado Financiero</h3>
          </div>
          <div className="finance-summary">
             <div className="finance-item success">
               <span>Ingresos</span>
               <h4>${ingresosMes.toFixed(2)}</h4>
             </div>
             <div className="finance-item danger">
               <span>Egresos</span>
               <h4>${egresosMes.toFixed(2)}</h4>
             </div>
             <div className="finance-item info">
               <span>Balance</span>
               <h4>${(ingresosMes - egresosMes).toFixed(2)}</h4>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
