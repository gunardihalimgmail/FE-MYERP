export interface IApprovalPenjualanUnitList {
    id: number;
    nomor: string;
    tanggalPengajuan: string;
    nomorPolisi: string;
    flagJenisUnit: string;
    jenisUnit: string;
}

export interface IApprovalPenjualanUnitDetail {
    id: number;
    jenisVRA: string;
    kodeVRA: string;
    nomorPolisi: string;
    nomorSTNK: string;
    masaBerlakuSTNK: string;
    tanggalBerlakuPajak: string;
    nomorMesin: string;
    nomorRangka: string;
    tipe: string;
    merk: string;
    nilaiAsset: number;
    nilaiBuku: number;
    tanggalPengajuan: string;
    pengajuanPenjualan: string;
    approveByAccounting: string;
    approveBySPVDept: string;
    approveByManagerDept: string;
}

export interface IApprovalPenjualanUnitDetailDocument {
    id: number;
    fileData: any;
}