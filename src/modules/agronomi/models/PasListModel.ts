export interface IPasList {
  id_ag_pas: Number;
  id_ms_pengaturanperiode: Number;
  mingguke: Number;
  datedesc: String;
  pt: String;
  isproblemagro: boolean;
  isproblemhrdstrategic: boolean;
  isproblemhrdoperational: boolean;
  isproblemteknik: boolean;
  isproblembnc: boolean;
  pendapatgm: String;
  altsolusiagro: String;
  deskripsiagro: String;
  periode: String;
}

export interface IPASDetailResult {
  pasDetail: IPasDetail[];
  infoKaryawan: IInfoKaryawan;
}

export interface IPasDetail {
  index_id: Number;
  id_ag_pas: Number;
  divisi: string;
  isproblem: string;
  isproblemdesc: string;
  analisadate: string;
  analisaheader: string;
  analisatext: string;
  solusidate: string;
  solusiheader: string;
  solusitext: string;
}

export interface IInfoKaryawan {
  divisi: string;
  jabatan: string;
}

export interface IPasHeader {
  id_ag_pas: Number;
  id_ms_pengaturanperiode: Number;
  id_ms_unitusaha: Number;
  pt: string;
  mingguke: Number;
  periode: string;
  tahun: Number;
  jumlahhari: Number;
  datedesc: string;
  createdtime: string;
  lastmodifiedtime: string;
}

export interface IPasRealisasi {
  id: Number;
  minggu: string;
  janjang: string;
  bjr: string;
  ipb: string;
  rotasi: string;
}

export interface IPasAttachmentDesc {
  atchid: Number;
  deskripsi: string;
}

export interface ProblemOptions {
  readonly value: string;
  readonly label: string;
}

export interface PlwOptions {
  readonly value: string;
  readonly label: string;
}

export interface AgPasOptions {
  value: string;
  label: string;
}

export const problemOptions: readonly ProblemOptions[] = [
  { value: "False", label: "Tidak Ada Problem" },
  { value: "True", label: "Ada Problem" },
];

export const plwOptions: readonly PlwOptions[] = [
  { value: "False", label: "Belum Tepat Solusi" },
  { value: "True", label: "Sudah Terselesaikan" },
];
