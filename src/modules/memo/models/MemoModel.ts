export interface SelectListOptions {
  value: string;
  label: string;
}

export interface IJenisDokumen {
  jenisDokumen: SelectListOptions[];
}

export const statusDokumenOptions: readonly SelectListOptions[] = [
  { value: "ALL", label: "ALL" },
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
];

export const divisiOptions: readonly SelectListOptions[] = [
  { value: "3", label: "Finance" },
  { value: "4", label: "HRD" },
  { value: "5", label: "FAC" },
  { value: "6", label: "Marketing" },
  { value: "7", label: "BNC" },
  { value: "8", label: "Funding" },
  { value: "9", label: "Legal" },
  { value: "10", label: "Audit" },
  { value: "11", label: "Accounting" },
  { value: "12", label: "Procurement" },
  { value: "13", label: "Agronomi" },
  { value: "14", label: "Transport" },
  { value: "15", label: "Technic" },
  { value: "17", label: "Pajak" },
  { value: "18", label: "TIS" },
  { value: "21", label: "HRD-Kesehatan" },
  { value: "22", label: "Marketing Permutihan" },
  { value: "24", label: "HRD Operation" },
  { value: "25", label: "HRD Strategic" },
  { value: "28", label: "HRD Keamanan" },
];

export const unitUsahaOptions: readonly SelectListOptions[] = [
  { value: "6", label: "W1" },
  { value: "7", label: "W2" },
  { value: "8", label: "B1" },
  { value: "9", label: "B2" },
  { value: "32", label: "B3" },
  { value: "10", label: "H1" },
  { value: "11", label: "H2" },
  { value: "12", label: "T1" },
  { value: "13", label: "T2" },
  { value: "14", label: "T3" },
  { value: "15", label: "SC1" },
  { value: "28", label: "SC2" },
  { value: "16", label: "KL" },
  { value: "19", label: "BA" },
  { value: "20", label: "BE" },
];

export interface ListDokumenResult {
  idDokumen: number;
  kategori: string;
  subKategori: string;
  subject: string;
  nomor: string;
  jenisDokumen: string;
  scopeDokumen: string;
  statusDokumen: string;
  tanggal: string;
  rejectedBy: number;
  rejectName: string;
  rejectNote: string;
  isReject: number;
  idRejector: number;
}

export interface DetailDokumenResult {
  kategoriDokumen: string;
  subKategoriDokumen: string;
  subject: string;
  nomor: string;
  jenisDokumen: string;
  flagDokumen: string;
  tanggalAwalBerlaku: string;
  tanggalAkhirBerlaku: string;
  fileData: any;
  divisi: string;
  statusDokumen: string;
  rejectNote: string;
  bagian: string;
  idDivisi: number;
}