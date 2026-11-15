import { AlertCircle } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load your tasks. Check your connection and try again.',
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 px-5 py-6 text-center">
      <AlertCircle className="mx-auto h-6 w-6 text-danger" />
      <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
