export interface AssetsDTO {
  id: number;
  lastModified: Date;
  modifiedBy: number;
  proceedingsId: number;
}

export interface FinancialInstrumentsDTO {
  id: number;
  assetId: number;
  selectedBank: string;
}

export interface BusinessParticipationDTO {
  id: number;
  assetId: number;
  ico: string;
}

export interface CarDTO {
  id: number;
  assetId: number;
  brand: string;
  registrationYear: number;
  typeDetail: string;
}

export interface ValuableDTO {
  id: number;
  assetId: number;
  description: string;
}

export interface OtherDTO {
  id: number;
  assetId: number;
  description: string;
}

export interface AssetsAllDTO {
  generalInfo: AssetsDTO;
  financialInstruments: FinancialInstrumentsDTO[];
  businessParticipations: BusinessParticipationDTO[];
  cars: CarDTO[];
  valuables: ValuableDTO[];
  others: OtherDTO[];
}

export interface CreateAssetsAllDTO {
  generalInfo: Omit<AssetsDTO, 'id'>;
  financialInstruments: Omit<FinancialInstrumentsDTO, 'id' | 'assetId'>[];
  businessParticipations: Omit<BusinessParticipationDTO, 'id' | 'assetId'>[];
  cars: Omit<CarDTO, 'id' | 'assetId'>[];
  valuables: Omit<ValuableDTO, 'id' | 'assetId'>[];
  others: Omit<OtherDTO, 'id' | 'assetId'>[];
}
