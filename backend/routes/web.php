<?php

use Illuminate\Support\Facades\Route;

// El frontend (React) compilado vive en public/app/index.html — separado del
// index.php de Laravel para no chocar con él. Cualquier ruta que no sea de la
// API (esas ya están registradas aparte, en routes/api.php) ni un archivo
// real (imágenes, JS, CSS, que Apache sirve directo) cae aquí y devuelve el
// HTML del frontend; React Router se encarga de mostrar la pantalla correcta.
Route::fallback(function () {
    $spa = public_path('app/index.html');

    if (!file_exists($spa)) {
        return response(
            'Frontend no encontrado. Verifica que backend/public/app/index.html exista '
            . '(debe subirse junto con el resto de backend/public/).',
            404
        );
    }

    return response()->file($spa, ['Content-Type' => 'text/html; charset=UTF-8']);
});
