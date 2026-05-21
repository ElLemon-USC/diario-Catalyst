// =====================================================
// SISTEMA DE WARNINGS + BLOQUEO TEMPORAL
// =====================================================

// QUE HACE:
// Da advertencias automáticas al usuario.
//
// Si acumula demasiadas advertencias:
// se bloquea temporalmente.
//
// Este sistema sirve para:
// - spam
// - insultos
// - lenguaje ofensivo
// - demasiados reportes
// - comportamiento sospechoso



// =====================================================
// BACKEND
// =====================================================



// =====================================================
// USER.MODEL.JS
// =====================================================

// Agregar esto al modelo User

warnings: {
  type: Number,
  default: 0
},

blockedUntil: {
  type: Date,
  default: null
},



// =====================================================
// AUTH.CONTROLLER.JS
// =====================================================

// Evitar login si sigue bloqueado

if (
  user.blockedUntil &&
  user.blockedUntil > new Date()
) {

  return res.status(403).json({
    message: "Usuario bloqueado temporalmente"
  });
}



// =====================================================
// DIARY.CONTROLLER.JS
// =====================================================

// EJEMPLO:
//
// Detectar palabras prohibidas
// o spam sospechoso

const bannedWords = [
  "hack",
  "virus",
  "spam"
];

const lowerContent =
 content.toLowerCase();

const suspicious =
 bannedWords.some(word =>
   lowerContent.includes(word)
 );



// =====================================================
// AUMENTAR WARNINGS
// =====================================================

if (suspicious) {

  user.warnings += 1;



  // =====================================================
  // BLOQUEAR SI LLEGA AL LIMITE
  // =====================================================

  if (user.warnings >= 3) {

    // bloquear 1 minuto

    user.blockedUntil =
      new Date(Date.now() + 60000);

    // reiniciar warnings

    user.warnings = 0;
  }

  await user.save();

  return res.status(400).json({
    message:
    "Contenido sospechoso detectado"
  });
}



// =====================================================
// FRONTEND
// =====================================================

// Mostrar mensaje del backend

alert(
 error.response?.data?.message
);



// =====================================================
// IDEAS EXTRA
// =====================================================

// Cambiar duración del bloqueo:
//
// 60000 = 1 minuto
// 300000 = 5 minutos
// 3600000 = 1 hora


