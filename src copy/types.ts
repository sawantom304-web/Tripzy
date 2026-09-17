export interface FlightInquiry {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  passengers: number;
  aircraftType: string;
}

export type SkyTheme = 'day' | 'sunset' | 'night';
