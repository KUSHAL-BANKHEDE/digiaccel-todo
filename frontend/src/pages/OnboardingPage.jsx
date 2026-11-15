import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

const ChevronPattern = ({ className = '' }) => (
  <svg viewBox="0 0 280 100" fill="none" aria-hidden="true" className={className}>
    <path
      d="M0 24 28 0l28 24L84 0l28 24L140 0l28 24L196 0l28 24L252 0l28 24"
      stroke="rgba(255,255,255,0.16)"
      strokeWidth="11"
    />
    <path
      d="M0 58 28 34l28 24 28-24 28 24 28-24 28 24 28-24 28 24 28-24 28 24"
      stroke="rgba(255,255,255,0.16)"
      strokeWidth="11"
    />
    <path
      d="M0 92 28 68l28 24 28-24 28 24 28-24 28 24 28-24 28 24 28-24 28 24"
      stroke="rgba(255,255,255,0.16)"
      strokeWidth="11"
    />
  </svg>
);

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col bg-primary">
      <section className="relative min-h-[300px] flex-1 overflow-hidden">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/[0.08]" />
        <div className="absolute -left-16 bottom-16 h-40 w-40 rounded-full border-[22px] border-white/[0.06]" />
        <ChevronPattern className="absolute left-4 top-28 w-56" />
        <ChevronPattern className="absolute -right-6 bottom-8 w-44 rotate-180" />
      </section>

      <section className="safe-bottom relative rounded-t-[34px] bg-white px-6 pb-6 pt-8 shadow-[0_-24px_60px_-30px_rgba(21,26,45,0.45)]">
        <h1 className="max-w-[290px] font-display text-[28px] font-semibold leading-[1.2] tracking-tight text-ink">
          Manage What To Do
        </h1>
        <p className="mt-3 max-w-[310px] text-sm leading-6 text-muted">
          The best way to manage what you have to do, don&apos;t forget your plans.
        </p>
        <Button size="lg" className="mt-7 w-full" onClick={() => navigate('/home')}>
          Get Started
        </Button>
      </section>
    </main>
  );
}
