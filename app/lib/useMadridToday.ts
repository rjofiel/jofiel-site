import { useSearchParams } from 'react-router';
import { madridDate } from '@/lib/time';

export function useMadridToday(): string {
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV ? params.get('today') : null;
  return preview ?? madridDate(new Date());
}
