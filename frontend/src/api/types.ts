export type Role = 'USER' | 'ADMIN';
export type VehicleType = 'MOTOR' | 'MOBIL';
export type ScheduleStatus = 'SAFE' | 'DUE_SOON' | 'OVERDUE';
export type DocumentStatus = 'SAFE' | 'DUE_SOON' | 'EXPIRED';
export type DocumentType = 'STNK' | 'PAJAK' | 'ASURANSI' | 'GARANSI' | 'LAINNYA';

export type User = { id: string; email: string; name: string; role: Role; createdAt?: string };

export type Vehicle = {
  id: string;
  vehicleName: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  currentOdometer: number;
  notes?: string;
};

export type MaintenanceItem = {
  id: string;
  name: string;
  description?: string;
  defaultIntervalKm: number;
  defaultIntervalMonth: number;
  vehicleType: VehicleType;
};

export type ServiceRecord = {
  id: string;
  vehicle?: Vehicle;
  maintenanceItem?: MaintenanceItem;
  vehicleId: string;
  maintenanceItemId: string;
  serviceDate: string;
  odometerAtService: number;
  workshopName: string;
  cost: string | number;
  notes?: string;
};

export type ServiceSchedule = {
  id: string;
  vehicle?: Vehicle;
  maintenanceItem?: MaintenanceItem;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
  status: ScheduleStatus;
};

export type VehicleDocument = {
  id: string;
  vehicle?: Vehicle;
  vehicleId: string;
  documentType: DocumentType;
  documentName: string;
  documentNumber?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
  status: DocumentStatus;
};
