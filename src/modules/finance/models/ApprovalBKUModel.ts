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
  ketRekening: string;
  isDownload : string;
}

export interface BKUDetailOPLPB {
  bkuDetail: IBKUDetail[];
  bkuOpLpbDetail: IBKUOPLPBDetail[];
  bkuDetailHistory: IDetailBKUHistory;
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

export interface IBKUOPLPBDetail {
  id: string;
  nomorOP: string;
  tanggalOP: string;
  nomorLPB: string;
  tanggalLPB: string;
  tagihan: string;
  type: string;
}

export interface IDetailBKUHistory {
  id: string;
  approvalSPVFinance: string;
  approvalManagerFinance: string;
  approvalManagerBNC: string;
  approvalDir1: string;
  approvalDir2: string;
}
