import { useEffect, useState } from 'react'
import { useAuth, type AuthView } from '../context/AuthContext'
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
} from '../lib/passwordValidation'

function AuthShell({ children, title, subtitle }: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💪</div>
          <h1 className="text-3xl font-black text-white">FitDex</h1>
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mt-1">
            Secure Trainer Account
          </p>
        </div>

        <div className="rounded-3xl bg-surface-raised border border-slate-700 p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          <p className="text-slate-400 text-sm mb-6">{subtitle}</p>
          {children}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
          Passwords are hashed and never stored in this app.
          Game data is protected by row-level security — only you can access your save.
        </p>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl bg-surface-overlay border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
      />
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
      {message}
    </div>
  )
}

function SuccessBox({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
      {message}
    </div>
  )
}

export function AuthScreen() {
  const { signIn, signUp, resetPassword, updatePassword, configured } = useAuth()
  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [needsPasswordUpdate, setNeedsPasswordUpdate] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setNeedsPasswordUpdate(true)
    }
  }, [])

  if (!configured) {
    return (
      <AuthShell
        title="Cloud accounts unavailable"
        subtitle="Supabase is not configured for this deployment."
      >
        <p className="text-slate-400 text-sm">
          Add <code className="text-cyan-400">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-cyan-400">VITE_SUPABASE_ANON_KEY</code> as GitHub Actions secrets.
          See README for setup.
        </p>
      </AuthShell>
    )
  }

  if (needsPasswordUpdate) {
    return (
      <AuthShell title="Set new password" subtitle="Choose a strong password for your account.">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            const pwCheck = validatePassword(password)
            if (!pwCheck.valid) {
              setError(`Password requirements: ${pwCheck.errors.join(', ')}`)
              return
            }
            if (password !== confirmPassword) {
              setError('Passwords do not match.')
              return
            }
            setLoading(true)
            try {
              await updatePassword(password)
              setSuccess('Password updated. You can continue playing.')
              setNeedsPasswordUpdate(false)
              window.history.replaceState(null, '', window.location.pathname)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not update password')
            } finally {
              setLoading(false)
            }
          }}
          className="space-y-4"
        >
          {error && <ErrorBox message={error} />}
          {success && <SuccessBox message={success} />}
          <Field id="new-password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          <Field id="confirm-password" label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold disabled:opacity-50">
            {loading ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </AuthShell>
    )
  }

  const switchView = (next: AuthView) => {
    setView(next)
    setError(null)
    setSuccess(null)
    setPassword('')
    setConfirmPassword('')
  }

  if (view === 'forgot') {
    return (
      <AuthShell title="Reset password" subtitle="We'll email you a secure reset link.">
        <form onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          if (!validateEmail(email)) { setError('Enter a valid email address.'); return }
          setLoading(true)
          try {
            await resetPassword(email)
            setSuccess('If an account exists for that email, a reset link has been sent.')
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not send reset email')
          } finally {
            setLoading(false)
          }
        }} className="space-y-4">
          {error && <ErrorBox message={error} />}
          {success && <SuccessBox message={success} />}
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold disabled:opacity-50">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
          <button type="button" onClick={() => switchView('login')} className="w-full text-sm text-slate-400 hover:text-white">
            Back to sign in
          </button>
        </form>
      </AuthShell>
    )
  }

  if (view === 'signup') {
    return (
      <AuthShell title="Create account" subtitle="Start your trainer journey with a secure cloud save.">
        <form onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          if (!validateDisplayName(displayName)) { setError('Trainer name must be 2–32 characters.'); return }
          if (!validateEmail(email)) { setError('Enter a valid email address.'); return }
          const pwCheck = validatePassword(password)
          if (!pwCheck.valid) { setError(`Password requirements: ${pwCheck.errors.join(', ')}`); return }
          if (password !== confirmPassword) { setError('Passwords do not match.'); return }
          setLoading(true)
          try {
            const { needsConfirmation } = await signUp(email, password, displayName)
            if (needsConfirmation) {
              setSuccess('Account created! Check your email to confirm before signing in.')
              switchView('login')
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed')
          } finally {
            setLoading(false)
          }
        }} className="space-y-4">
          {error && <ErrorBox message={error} />}
          {success && <SuccessBox message={success} />}
          <Field id="display-name" label="Trainer name" value={displayName} onChange={setDisplayName} autoComplete="nickname" placeholder="Ash" />
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          <Field id="confirm-password" label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
          <p className="text-xs text-slate-500">8+ chars, uppercase, lowercase, and a number.</p>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50">
            {loading ? 'Creating...' : 'Create account'}
          </button>
          <button type="button" onClick={() => switchView('login')} className="w-full text-sm text-slate-400 hover:text-white">
            Already have an account? Sign in
          </button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Sign in" subtitle="Access your cloud save from any device.">
      <form onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        if (!validateEmail(email)) { setError('Enter a valid email address.'); return }
        setLoading(true)
        try {
          await signIn(email, password)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Sign in failed')
        } finally {
          setLoading(false)
        }
      }} className="space-y-4">
        {error && <ErrorBox message={error} />}
        {success && <SuccessBox message={success} />}
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={() => switchView('forgot')} className="text-slate-400 hover:text-cyan-400">
            Forgot password?
          </button>
          <button type="button" onClick={() => switchView('signup')} className="text-slate-400 hover:text-cyan-400">
            Create account
          </button>
        </div>
      </form>
    </AuthShell>
  )
}
