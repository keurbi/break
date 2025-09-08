import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3100';

export async function createCheckoutAndRedirect(amountCents: number) {
  const res = await fetchWithAuth(`${API_BASE}/api/payments/checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountCents }),
  });
  if (!res) return;
  if (!res.ok) {
    try {
      const data = await res.json();
      throw new Error(data?.error || 'Erreur de paiement');
    } catch {
      throw new Error('Erreur de paiement');
    }
  }
  const data = await res.json();
  if (data?.url) {
    window.location.href = data.url;
  } else {
    throw new Error('URL Stripe manquante');
  }
}
