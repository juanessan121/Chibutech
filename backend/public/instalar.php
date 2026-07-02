<?php
/**
 * Instalador de un solo uso — Chibutech ERP (hosting compartido / cPanel)
 *
 * Uso:
 *   1. Sube backend/ completo al hosting (incluida la carpeta vendor/).
 *   2. Crea la base de datos en cPanel → MySQL® Databases (no hace falta
 *      importar el SQL a mano si usas este instalador; si ya lo importaste
 *      por phpMyAdmin, no pasa nada, este instalador no lo duplica).
 *   3. Visita: https://api.mi-dominio.com/instalar.php?token=TOKEN
 *      (el token está más abajo, en la constante TOKEN).
 *   4. Llena el formulario con los datos reales de tu base de datos.
 *   5. Cuando termine, BORRA ESTE ARCHIVO del servidor. No lo dejes ahí.
 */

const TOKEN = '41e63afb15c07232c2b7353d587d8955';

$lockFile = __DIR__ . '/../storage/instalado.lock';
$vendorAutoload = __DIR__ . '/../vendor/autoload.php';

function h($s) { return htmlspecialchars($s ?? '', ENT_QUOTES); }

function pagina($titulo, $contenido) {
    echo "<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\">";
    echo "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
    echo "<title>$titulo</title><style>
        body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 20px;background:#0f172a;color:#e2e8f0}
        h1{font-size:1.4rem} label{display:block;font-weight:600;margin-top:12px}
        input{width:100%;padding:8px;margin:4px 0;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#fff;box-sizing:border-box}
        button{padding:10px 20px;background:#0ea5e9;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;margin-top:16px}
        .error{background:#7f1d1d;padding:10px;border-radius:6px;margin-bottom:10px}
        .ok{background:#14532d;padding:16px;border-radius:6px}
        code{background:#1e293b;padding:2px 6px;border-radius:4px}
    </style></head><body><h1>🚀 Instalador — Chibutech</h1>$contenido</body></html>";
    exit;
}

// ── 1. Seguridad básica: token obligatorio ──────────────────────────────
if (($_GET['token'] ?? '') !== TOKEN) {
    http_response_code(403);
    pagina('Acceso denegado', '<p>Token inválido o faltante. Revisa la URL — debe terminar en <code>?token=...</code>.</p>');
}

// ── 2. No repetir si ya se instaló antes ─────────────────────────────────
if (file_exists($lockFile) && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    pagina('Ya instalado', '<div class="ok"><p>Este sistema ya fue instalado anteriormente (existe <code>storage/instalado.lock</code>).</p>
    <p>Si de verdad necesitas repetir la instalación (por ejemplo cambiaste de base de datos), borra ese archivo desde el Administrador de Archivos y vuelve a cargar esta página.</p>
    <p><strong>Si todo funciona bien, borra este archivo <code>instalar.php</code> del servidor ahora mismo.</strong></p></div>');
}

// ── 3. Verificar que composer install ya se corrió (vendor/ subido) ─────
if (!file_exists($vendorAutoload)) {
    pagina('Falta vendor/', '<div class="error">No se encontró <code>backend/vendor/</code>. Sube esa carpeta completa junto con el resto de <code>backend/</code> antes de continuar (es el resultado de <code>composer install</code>, generado en tu computadora).</div>');
}
require $vendorAutoload;

$errors = [];
$exito = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = trim($_POST['db_host'] ?? 'localhost');
    $dbName = trim($_POST['db_name'] ?? '');
    $dbUser = trim($_POST['db_user'] ?? '');
    $dbPass = trim($_POST['db_pass'] ?? '');
    $appUrl = rtrim(trim($_POST['app_url'] ?? ''), '/');
    $frontendUrl = rtrim(trim($_POST['frontend_url'] ?? ''), '/');

    if (!$dbName || !$dbUser || !$appUrl || !$frontendUrl) {
        $errors[] = 'Completa todos los campos obligatorios.';
    }

    if (!$errors) {
        try {
            new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
        } catch (\PDOException $e) {
            $errors[] = 'No se pudo conectar a la base de datos con esos datos: ' . $e->getMessage();
        }
    }

    if (!$errors) {
        // ── Generar/actualizar .env ──────────────────────────────────────
        $envPath = __DIR__ . '/../.env';
        $envExamplePath = __DIR__ . '/../.env.example';
        $env = file_exists($envPath) ? file_get_contents($envPath) : file_get_contents($envExamplePath);

        $appKey = 'base64:' . base64_encode(random_bytes(32));

        $replacements = [
            'APP_ENV' => 'production',
            'APP_DEBUG' => 'false',
            'APP_KEY' => $appKey,
            'APP_URL' => $appUrl,
            'FRONTEND_URL' => $frontendUrl,
            'DB_CONNECTION' => 'mysql',
            'DB_HOST' => $dbHost,
            'DB_PORT' => '3306',
            'DB_DATABASE' => $dbName,
            'DB_USERNAME' => $dbUser,
            'DB_PASSWORD' => $dbPass,
        ];

        foreach ($replacements as $key => $value) {
            $needsQuotes = $value === '' || preg_match('/\s|#/', $value);
            $line = $key . '=' . ($needsQuotes ? '"' . str_replace('"', '\\"', $value) . '"' : $value);
            $pattern = '/^' . preg_quote($key, '/') . '=.*$/m';
            $env = preg_match($pattern, $env)
                ? preg_replace($pattern, $line, $env, 1)
                : $env . "\n" . $line;
        }

        file_put_contents($envPath, $env);

        // ── Arrancar Laravel y aplicar migraciones pendientes ────────────
        try {
            $app = require __DIR__ . '/../bootstrap/app.php';
            $kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
            $kernel->call('config:clear');
            $kernel->call('cache:clear');
            // Solo aplica migraciones NUEVAS — si ya importaste el SQL completo
            // por phpMyAdmin, la tabla `migrations` ya las tiene registradas
            // y Laravel las salta automáticamente (no duplica nada).
            $kernel->call('migrate', ['--force' => true]);
            $kernel->call('storage:link');
        } catch (\Throwable $e) {
            $errors[] = 'Se guardó la configuración pero falló un paso posterior: ' . $e->getMessage();
        }

        // ── Permisos ──────────────────────────────────────────────────────
        @chmod(__DIR__ . '/../storage', 0775);
        @chmod(__DIR__ . '/../bootstrap/cache', 0775);

        if (!$errors) {
            file_put_contents($lockFile, date('c') . " — instalado desde " . ($_SERVER['REMOTE_ADDR'] ?? '?'));
            $exito = true;
        }
    }
}

if ($exito) {
    pagina('Instalación completa', '<div class="ok">
        <h2>✅ ¡Listo!</h2>
        <p>Se creó <code>backend/.env</code> con tus datos, se generó la clave de la aplicación y se aplicaron las migraciones pendientes.</p>
        <p><strong>Borra este archivo (<code>instalar.php</code>) del servidor ahora mismo</strong> — ya cumplió su función y dejarlo público es un riesgo de seguridad.</p>
        <p>Prueba entrar al sistema con usuario <code>admin</code> / contraseña <code>admin</code>, y cambia esa contraseña cuanto antes.</p>
    </div>');
}

$errorHtml = '';
foreach ($errors as $e) { $errorHtml .= '<div class="error">' . h($e) . '</div>'; }

pagina('Instalar Chibutech', $errorHtml . '
<p>Completa los datos reales de tu base de datos (los mismos que creaste en cPanel → <strong>MySQL® Databases</strong>) y de tus dominios.</p>
<form method="post">
    <label>Host de la base de datos</label>
    <input name="db_host" value="' . h($_POST['db_host'] ?? 'localhost') . '">

    <label>Nombre de la base de datos</label>
    <input name="db_name" value="' . h($_POST['db_name'] ?? '') . '" placeholder="tuusuario_basechi" required>

    <label>Usuario de la base de datos</label>
    <input name="db_user" value="' . h($_POST['db_user'] ?? '') . '" placeholder="tuusuario_dbuser" required>

    <label>Contraseña de la base de datos</label>
    <input type="password" name="db_pass" value="">

    <label>URL de esta API (con https://, sin barra al final)</label>
    <input name="app_url" value="' . h($_POST['app_url'] ?? '') . '" placeholder="https://api.mi-dominio.com" required>

    <label>URL del frontend (con https://, sin barra al final)</label>
    <input name="frontend_url" value="' . h($_POST['frontend_url'] ?? '') . '" placeholder="https://mi-dominio.com" required>

    <button type="submit">Instalar</button>
</form>
<p style="margin-top:24px;font-size:0.85rem;color:#94a3b8">Si ya habías importado la base de datos por phpMyAdmin, no pasa nada al usar este instalador: no borra ni duplica datos, solo configura la conexión y aplica lo que falte.</p>');
