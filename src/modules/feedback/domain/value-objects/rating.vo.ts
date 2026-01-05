export class Rating {
  private constructor(private readonly value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
  }

  static create(value: number): Rating {
    return new Rating(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Rating): boolean {
    return this.value === other.value;
  }
}
