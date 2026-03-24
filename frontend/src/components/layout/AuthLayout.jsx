import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, alternateLink, alternateText }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">DB + Attractor</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
        <p className="mt-5 text-center text-sm text-slate-600">
          {alternateText}{' '}
          <Link to={alternateLink} className="font-medium text-brand-600 hover:underline">
            Go now
          </Link>
        </p>
      </div>
    </div>
  );
}
