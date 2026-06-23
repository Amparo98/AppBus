import { useState } from 'react'
import img from '../assets/logo.png'
import { loginCompany } from '../services/authService'
import { IconLock, IconShieldCheck, IconFingerprint, IconEye, IconEyeOff, IconMail, IconKey} from '@tabler/icons-react'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  const isSecure = window.location.protocol === 'https:';


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const securityItems = [
    {Icon: IconLock, label: isSecure ? 'Conexión cifrada (HTTPS)' : 'Conexión no cifrada', active: isSecure,},
    {Icon: IconShieldCheck, label: 'Acceso por roles', active: true,},
    {Icon: IconFingerprint, label: 'Contraseñas protegidas con bcrypt', active: true,},
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const result = await loginCompany({ email, password })
      console.log('Login exitoso:', result)
    } catch (err) {
      const backendMessage = err.response?.data?.message
      setError(backendMessage || 'No se ha podido iniciar sesión. Revisa tus credenciales.')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      {/* Panel izquierdo */}
      <aside className="hidden lg:flex w-1/2 h-full flex-col justify-center bg-white px-12 lg:px-16 overflow-y-auto py-8">
        <div className="max-w-xl mx-auto w-full">
          <img
            src={img}
            alt="AppBus"
            className="w-full max-w-[280px] mx-auto object-contain mb-6"
          />

          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Plataforma de gestión de transporte urbano
            </h1>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Administrar líneas, trayectos, horarios, autobuses, conductores e incidencias dentro de una red de transporte público.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-slate-900 text-xs font-bold uppercase tracking-widest">
                Seguridad del sistema
              </p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-2">
              {securityItems.map(({ Icon, label, active  }) => (
                <div key={label}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon className="text-blue-600" size={20} />
                  </div>
                  <span className="text-slate-800 text-sm font-medium">{label}</span>
                  <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${
                    active ? 'bg-green-50 text-green-600' : 'bg-[#F79B48]/10 text-[#F79B48]'}`}>
                    {active ? 'Activo' : 'Mantenimiento'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Panel derecho */}
      <main className="w-full lg:w-1/2 h-full flex items-center justify-center bg-[#0f172a] px-8">
        <section className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-white">
              Login
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Accede con tus credenciales corporativas
            </p>

            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-5" />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Correo corporativo
              </label>

               <div className="relative">
                   <IconMail
                     size={18}
                     className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                   />
                   <input
                     id="email"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="nombre@empresa.com"
                     autoComplete="username"
                     required
                     className="input input-bordered w-full bg-[#111c33] border-slate-600 text-white placeholder:text-slate-400 pl-11"
                   />
                 </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-white">
                  Contraseña
                </label>

                <a href="/forgot-password" className="text-xs text-blue-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="relative">
                <IconKey size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="input input-bordered w-full bg-[#111c33] border-slate-600 text-white placeholder:text-slate-400 pl-11 pr-12"                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="checkbox checkbox-primary checkbox-sm rounded-md"
                checked={rememberDevice}
                onChange={() => setRememberDevice(!rememberDevice)}
              />

              <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                Mantener sesión iniciada 30 días
              </label>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full rounded-xl text-white font-bold disabled:opacity-60">
              {isSubmitting ? 'Accediendo...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            ¿Tu empresa aún no tiene cuenta?{' '}
            <a href="/registerPage" className="text-blue-400 hover:underline font-medium">
              Regístrate aquí
            </a>
          </p>

          <p className="mt-8 text-center text-xs text-slate-500">
            AppBus Platform v1.0.0
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage