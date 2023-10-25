export interface IBKUList {
  id: number;
  docKey: string;
  nomor: string;
  tanggal: string;
  tanggalStr: string;
  pt: string;
  nilai: number;
  supplier: string;
  cara: string;
  keterangan: string;
  status: string;
  id_ms_supplier: number;
  ketRekening: string;
}

export interface BKUDetailAndIsDownload {
  bkuDetail: IBKUDetail[];
  isDownload: string;
}

export interface IBKUDetail {
  id: string;
  idTransAkun: number;
  idTransSPD: number;
  jenis: string;
  sumber: string;
  nomor: string;
  kodeAkun: string;
  namaAkun: string;
  detail: string;
  harga: number;
  total: number;
}

export interface IAkunList {
  ID_Ac_Akun: number;
  Kode: string;
  Nama: string;
  FlagTitle: string;
  ModifyStatus: string;
}