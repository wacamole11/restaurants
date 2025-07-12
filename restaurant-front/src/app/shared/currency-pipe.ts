import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado para formatear monedas en soles peruanos
 * Uso: {{ valor | currency:'PEN' }}
 */
@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currency: string = 'PEN'): string {
    if (value === null || value === undefined || value === '') {
      return 'S/ 0.00';
    }

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numericValue)) {
      return 'S/ 0.00';
    }

    // Formatear con separadores de miles y 2 decimales
    const formattedValue = numericValue.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `S/ ${formattedValue}`;
  }
} 