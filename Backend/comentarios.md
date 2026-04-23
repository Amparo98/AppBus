como se desea que la empresa cree el perfil de usuairio y luego el conductor sea quien establezca su propia contraseña se va a utilizar resend que es quien envia los correos de porma automatica, se utilizo esto por lo siguiente:

Plan gratuito de 3.000 emails/mes — más que suficiente para un TFG
SDK oficial para Node.js — muy fácil de integrar, pocas líneas de código
No necesitas configurar SMTP como con Nodemailer
Emails no caen en spam a diferencia de Gmail con Nodemailer
Dashboard donde puedes ver los emails enviados, útil para depurar

para elo tenemos que añadir a la tabla de la base de datos lo siguiente: 
token_activacion
Es un código único y secreto que se genera cuando la empresa crea al conductor. Se manda en el enlace del email:
http://tuapp.com/activar-cuenta?token=a3f8c2d1e9b7...
Cuando el conductor hace clic, el backend busca ese token en la base de datos para saber qué conductor está intentando activar su cuenta. Sin este campo no hay forma de identificar al conductor que viene desde el email.
Una vez activada la cuenta se pone a NULL para que el enlace no pueda usarse dos veces.


cuenta_activada
Es un booleano que indica si el conductor ya estableció su contraseña. Sirve para dos cosas:
Al hacer login — evita que un conductor sin contraseña pueda entrar:
Al activar — evita que alguien use el mismo enlace dos veces:


al ver que se tiene que crear diferentes usuarios y con la anterior no es posible se va optar por usar Nodemailer 




//conductor
repositories-
async function updateConductorPerfil(id_conductor, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE conductor SET ${setClause}
     WHERE id_conductor = $${keys.length + 1}
     RETURNING id_conductor, nombre, apellido, email, telefono, num_trabajador`,
    [...values, id_conductor]
  );
  return rows[0] || null;
}

service-
async function updateConductorPerfil(id_conductor, data) {
  const conductor = await add_ConductorRepository.updateConductorPerfil(id_conductor, data);
  if (!conductor) {
    const error = new Error('Conductor no encontrado');
    error.status = 404;
    error.code = 'CONDUCTOR_NOT_FOUND';
    throw error;
  }
  return conductor;
}

controller-
async function actualizarPerfilConductor(req, res, next) {
  try {
    const conductor = await add_conductorService.updateConductorPerfil(req.user.id, req.body);
    res.status(200).json({ ok: true, message: 'Perfil actualizado correctamente', conductor });
  } catch (error) {
    next(error);
  }
}

schemas-
const actualizarPerfilConductorSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().min(9).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

routes-
router.put('/perfil', authMiddleware, roleMiddleware('conductor'), validate(actualizarPerfilConductorSchema), addConductorController.actualizarPerfilConductor);
