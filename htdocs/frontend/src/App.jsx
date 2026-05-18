import React from 'react';
import './App.css'; 

function App() {
return (
    <div className="container">
      {/* 1. Título de Bienvenida claro y grande */}
    <header style={{ padding: '40px 20px' }}>
        <h1>Bienvenidos a la Comunidad Chibuleo</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        Un espacio creado para honrar nuestra cultura y facilitar el acceso a la información para todos.
        </p>
    </header>

      {/* 2. Sección de Impacto Visual */}
    <section className="galeria-comunidad">
        <img 
        src="https://scontent.fatf6-1.fna.fbcdn.net/v/t39.30808-6/549766587_1523762829061070_244675907634113662_n.jpg?stp=cp6_dst-jpg_s720x720_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=39oh-bcNA24Q7kNvwHry__w&_nc_oc=AdoEU3hxuIo2hVUDF-24E6IJid8h4Tob7ADBiMQP30lOSqpW6rpimZNDeZ3XQYwQcB4&_nc_zt=23&_nc_ht=scontent.fatf6-1.fna&_nc_gid=pZQJWzU8gj2-_xXnHbt9mg&_nc_ss=7a289&oh=00_Af4UdRbnBoY22bNtsvoPmGY7c2XqtqI_u2q4V1PLpSPu-w&oe=6A106EDB" 
        alt="Paisaje de la Comunidad Chibuleo" 
        style={{ width: '100%', display: 'block' }}
        />
    </section>

      {/* 3. Botones "A prueba de fallos" con Iconos y Texto */}
    <main style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '20px' }}>
        
        {/* Usamos lenguaje directo como "Enviar información"  */}
        <button className="btn-chibuleo">
        Inicio
        </button>

        <button className="btn-chibuleo">
        Nuestra Cultura
        </button>

        <button className="btn-chibuleo">
        Enviar información
        </button>

    </main>

    <footer style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '14px' }}>
        © 2026 Comunidad Chibuleo - Diseño Accesible para Todos
    </footer>
    </div>
    );
}

export default App;