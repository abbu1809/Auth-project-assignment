import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from './authSlice';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, status, error } = useSelector((state) => state.auth);

  if (accessToken) return <Navigate to="/" replace />;

  const submit = async (values) => {
    const action = isRegister
      ? registerUser(values)
      : loginUser({ email: values.email, password: values.password });
    const result = await dispatch(action);

    if (action.fulfilled.match(result)) navigate('/');
    if (action.rejected.match(result) && result.payload?.fields) {
      Object.entries(result.payload.fields).forEach(([field, message]) => {
        setError(field, { type: 'server', message });
      });
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-intro">
        <p className="eyebrow">A quieter way to sell online</p>
        <h1>Make room for the things people keep.</h1>
        <p className="intro-copy">Mercado is a small product studio for thoughtful inventory, clear decisions, and a shop that feels like yours.</p>
        <div className="intro-mark">M / 01</div>
      </section>
      <section className="auth-panel">
        <div className="form-heading">
          <p className="eyebrow">{isRegister ? 'New account' : 'Welcome back'}</p>
          <h2>{isRegister ? 'Start your shop' : 'Sign in to Mercado'}</h2>
        </div>
        <form onSubmit={handleSubmit(submit)} className="auth-form">
          {isRegister && <Field label="Your name" error={errors.name} {...register('name', { required: 'Name is required' })} />}
          <Field label="Email address" type="email" error={errors.email} {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })} />
          <Field label="Password" type="password" error={errors.password} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
          {isRegister && <Field label="Confirm password" type="password" error={errors.confirmPassword} {...register('confirmPassword', { required: 'Please confirm your password', validate: (value, values) => value === values.password || 'Passwords do not match' })} />}
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={status === 'loading'}>
            {status === 'loading' ? 'Working...' : isRegister ? 'Create account' : 'Enter studio'}
          </button>
        </form>
        <p className="switch-auth">
          {isRegister ? 'Already have an account?' : 'New to Mercado?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link>
        </p>
      </section>
    </main>
  );
}

function Field({ label, error, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} />{error && <small>{error.message}</small>}</label>;
}
