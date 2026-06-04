/**
 * Módulo de validación de entradas en tiempo real.
 * Estas funciones se usan en los eventos onChange para filtrar caracteres no permitidos.
 */

// Solo permite letras, espacios y acentos básicos.
export const allowOnlyLetters = (value) => {
  if (!value) return '';
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

// Solo permite números del 0 al 9.
export const allowOnlyNumbers = (value) => {
  if (!value) return '';
  return value.replace(/[^0-9]/g, '');
};

// Solo permite letras y números, sin espacios ni caracteres especiales.
export const allowAlphanumeric = (value) => {
  if (!value) return '';
  return value.replace(/[^a-zA-Z0-9]/g, '');
};

// Permite letras, números, espacios y signos de puntuación básicos (, . - _ ! ?)
export const allowTextWithPunctuation = (value) => {
  if (!value) return '';
  return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-_\!\?]/g, '');
};

// Permite números y un solo punto o coma decimal para montos o áreas.
export const allowDecimalNumbers = (value) => {
  if (!value) return '';
  // Reemplazar coma por punto para estandarizar
  let val = value.replace(/,/g, '.');
  // Remover cualquier caracter que no sea número o punto
  val = val.replace(/[^0-9.]/g, '');
  
  // Evitar más de un punto decimal
  const parts = val.split('.');
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return val;
};
