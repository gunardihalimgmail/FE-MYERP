export interface ISPDKirimTerimaList {
  id: number;
  jenis: string;
  nomor: string;
  refId: number;
  perihal: string;
  bagian: string;
  flowType: string;
  pt: string;
  status: number;
  statusTime: string;
  statusBy: number;
  lastNotes: string;
  isRejected: string;
  rejectedBy: number;
  requestTime: string;
  requestTimeFormatDate?: string;
  requestBy: number;
  lastReceivedTime: string;
  lastReceivedBy: number;
  createdBy: number;
  createdTime: string;
  lastModifiedBy: number;
  lastModifiedTime: string;
  requestByName: string;
  requestTimeStr: string;
  lastReceivedByName: string;
  lastReceivedTimeStr: string;
  statusByName: string;
  statusTimeStr: string;
  pic: string;
  mataUang: string;
  nilaiPermintaan: number;
  newNotes: string;
  dirNotes: string;
  rowStatus: string;
  dokKey: string;
  isDownload: string;
}

export interface IKaryawanInfo {
  iD_Ms_Karyawan: number;
  iD_Ms_Divisi: number;
  iD_Ms_Bagian: number;
  iD_Ms_Jabatan: number;
  pt: string;
  bagian: string;
  divisi: string;
  role: string;
}

export interface IResultDataListKirimTerima {
  dataKaryawan: IKaryawanInfo;
  spdKirimTerimaList: ISPDKirimTerimaList[];
}

export interface IOpsiTujuanList {
  label: string;
  value: string;
}

export interface IDirNotes {
  flag: string;
  notes: string;
}

export interface IDokumenFlowStatus {
  id: number;
  level: number;
  keterangan: string;
  tanggal: string;
  status: string;
  levelStyle: string;
}
