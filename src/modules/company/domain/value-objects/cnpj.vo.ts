export class Cnpj {
  private constructor(private readonly value: string) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 14) {
      throw new Error('CNPJ must contain exactly 14 digits');
    }
    if (!this.isValid(cleaned)) {
      throw new Error('Invalid CNPJ');
    }
  }

  static create(value: string): Cnpj {
    return new Cnpj(value);
  }

  getValue(): string {
    return this.value.replace(/\D/g, '');
  }

  getFormatted(): string {
    const cleaned = this.getValue();
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }

  equals(other: Cnpj): boolean {
    return this.getValue() === other.getValue();
  }

  private isValid(cnpj: string): boolean {
    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === parseInt(digits.charAt(1));
  }
}
