export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export enum CompanyCategory {
  FOOD_AND_BEVERAGE = 'FOOD_AND_BEVERAGE',
  RETAIL = 'RETAIL',
  SERVICES = 'SERVICES',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  TECHNOLOGY = 'TECHNOLOGY',
  CONSTRUCTION = 'CONSTRUCTION',
  TRANSPORT = 'TRANSPORT',
  TOURISM_AND_HOSPITALITY = 'TOURISM_AND_HOSPITALITY',
  BEAUTY_AND_AESTHETICS = 'BEAUTY_AND_AESTHETICS',
  AUTOMOTIVE = 'AUTOMOTIVE',
  REAL_ESTATE = 'REAL_ESTATE',
  FINANCIAL = 'FINANCIAL',
  ENTERTAINMENT = 'ENTERTAINMENT',
  FASHION_AND_APPAREL = 'FASHION_AND_APPAREL',
  SPORTS_AND_FITNESS = 'SPORTS_AND_FITNESS',
  PET_SERVICES = 'PET_SERVICES',
  LEGAL = 'LEGAL',
  CONSULTING = 'CONSULTING',
  MANUFACTURING = 'MANUFACTURING',
  AGRICULTURE = 'AGRICULTURE',
  ENERGY = 'ENERGY',
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS',
  MEDIA_AND_ADVERTISING = 'MEDIA_AND_ADVERTISING',
  NON_PROFIT = 'NON_PROFIT',
  OTHER = 'OTHER',
}

export class Company {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly cnpj: string,
    public readonly name: string,
    public readonly category: CompanyCategory,
    public readonly status: CompanyStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === CompanyStatus.ACTIVE;
  }

  isInactive(): boolean {
    return this.status === CompanyStatus.INACTIVE;
  }

  isPending(): boolean {
    return this.status === CompanyStatus.PENDING;
  }

  canReceiveFeedback(): boolean {
    return this.isActive();
  }
}
