import { parsePhoneNumber, CountryCode } from 'libphonenumber-js/max';

export function normalizePhoneNumber(phoneNumber: string, countryCode?: CountryCode): string | null {
     try {
          // Eliminar todo menos dígitos y el símbolo +
          let cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');

          // Si no empieza con +, agregarlo
          if (!cleanedNumber.startsWith('+')) {
               cleanedNumber = '+' + cleanedNumber;
          }

          const parsedPhoneNumber = parsePhoneNumber(cleanedNumber, countryCode);

          if (parsedPhoneNumber && parsedPhoneNumber.isPossible()) {
               return parsedPhoneNumber.format('E.164').replace('+', '');
          }

          return null;
     } catch (error) {
          console.error('Error normalizing phone number:', phoneNumber, error);
          return null;
     }
}
