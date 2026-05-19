import React from 'react';
import './Table.css';

const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-4">
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    <div className="table-actions">
                      {onEdit && (
                        <button className="btn-action edit" onClick={() => onEdit(row)}>
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button className="btn-action delete" onClick={() => onDelete(row)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
