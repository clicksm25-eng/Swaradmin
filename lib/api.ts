import axios from 'axios';
import { Booking } from './types';

const AJAX_URL = process.env.NEXT_PUBLIC_WP_AJAX!;
const NONCE_URL = process.env.NEXT_PUBLIC_WP_NONCE_URL!;

let cachedNonce: string | null = null;

export async function getNonce(): Promise<string> {
  if (cachedNonce) return cachedNonce;
  const res = await axios.get(NONCE_URL);
  cachedNonce = res.data.nonce;
  return cachedNonce!;
}

export async function getBookings(): Promise<Booking[]> {
  const nonce = await getNonce();
  const form = new FormData();
  form.append('action', 'sewar_get_bookings');
  form.append('nonce', nonce);
  try {
    const res = await axios.post(AJAX_URL, form);
    if (res.data?.success) {
      return res.data.data?.bookings || [];
    }
    if (res.data?.data?.includes?.('nonce')) {
      cachedNonce = null;
      return getBookings();
    }
    return [];
  } catch {
    return [];
  }
}

export async function updateStatus(bookingId: string, status: string): Promise<void> {
  const nonce = await getNonce();
  const form = new FormData();
  form.append('action', 'sewar_update_status');
  form.append('nonce', nonce);
  form.append('booking_id', bookingId);
  form.append('status', status);
  const res = await axios.post(AJAX_URL, form);
  if (!res.data?.success) {
    if (typeof res.data?.data === 'string' && res.data.data.includes('nonce')) {
      cachedNonce = null;
      return updateStatus(bookingId, status);
    }
    throw new Error('فشل تحديث الحالة');
  }
}
