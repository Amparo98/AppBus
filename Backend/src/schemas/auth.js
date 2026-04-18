const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  /*password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')*/
  /*ahora se pone 3 para un control mas facil, pero despues ene le resultado final tiene q ser 6*/
  password: z.string().min(3, 'La contraseña debe tener al menos 3 caracteres')
});

const registerUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(3, 'La contraseña debe tener al menos 3 caracteres')
});

const registerEmpresaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

module.exports = { loginSchema, registerUsuarioSchema, registerEmpresaSchema };