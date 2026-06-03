export interface Booking {
  id: string;
  time: string;
  name: string;
  phone: string;
  date: string;
  persons: string;
  package: string;
  total: string;
  deposit: string;
  pay_type: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
