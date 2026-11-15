import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-[0_10px_24px_-14px_rgba(76,95,245,0.9)] hover:bg-primary-dark active:scale-[0.99]',
  outline: 'border border-line bg-white text-ink hover:bg-canvas',
  ghost: 'text-primary hover:bg-primary-soft',
  danger: 'bg-danger text-white hover:bg-danger/90',
};

const SIZES = {
  sm: 'h-10 rounded-lg px-4 text-sm',
  md: 'h-12 rounded-xl px-5 text-[15px]',
  lg: 'h-[52px] rounded-xl px-6 text-[15px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
