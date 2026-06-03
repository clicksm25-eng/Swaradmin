import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseAmount(str: string): number {
  if (!str) return 0;
  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

export function parsePackageName(pkg: string): string {
  if (!pkg) return '';
  return pkg.split('|')[0].trim();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ar-SA') + ' ريال';
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
