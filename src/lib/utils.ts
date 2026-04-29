import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(n: number) {
  return `$${n.toLocaleString()}`
}

export function getClinicsBySpecialty(clinics: any[], specialty: string) {
  return clinics.filter(c =>
    c.specialties.some((s: string) =>
      s.toLowerCase().includes(specialty.toLowerCase())
    )
  )
}