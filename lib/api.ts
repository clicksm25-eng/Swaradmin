import axios from 'axios';
import { Booking } from './types';

const AJAX_URL = '/api/wp/ajax';
const NONCE_URL = '/api/wp/nonce';

let cachedNonce: string | null = null;

export async function getNonce(): Promise<string> {
  if (cachedNonce) return cachedNonce;
  const res = await axios.get(NONCE_URL);
  if (!res.data?.nonce) throw new Error('nonce missing');
  cachedNonce = res.data.nonce;
  return cachedNonce!;
}

export async function getBookings(): Promise<Booking[]> {
  const nonce = await getNonce();
  const form = new FormData();
  form.append('action', 'sewar_get_bookings');
  form.append('nonce', nonce);
  const res = await axios.post(AJAX_URL, form);
  if (res.data?.success) {
    return res.data.data?.bookings || [];
  }
  if (typeof res.data?.data === 'string' && res.data.data.includes('nonce')) {
    cachedNonce = null;
    return getBookings();
  }
  throw new Error('فشل تحميل الحجوزات');
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

export async function updateBooking(
  bookingId: string,
  fields: Partial<Pick<Booking, 'name' | 'phone' | 'date' | 'persons' | 'notes' | 'status'>>
): Promise<void> {
  const nonce = await getNonce();
  const form = new FormData();
  form.append('action', 'sewar_update_booking');
  form.append('nonce', nonce);
  form.append('booking_id', bookingId);
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined) form.append(k, String(v));
  });
  const res = await axios.post(AJAX_URL, form);
  if (!res.data?.success) {
    if (typeof res.data?.data === 'string' && res.data.data.includes('nonce')) {
      cachedNonce = null;
      return updateBooking(bookingId, fields);
    }
    throw new Error('فشل تحديث بيانات الحجز');
  }
}
