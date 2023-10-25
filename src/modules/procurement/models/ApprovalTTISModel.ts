export interface ICfg{
    key: any;
    direction: any;
}

export interface IProp{
    products: any;
}
export interface IResultDataListOsTTIS
{
  // dataKaryawan: IKaryawanInfo;
  osTTISList: IOutstandingTTIS[];
}

export interface IOutstandingTTIS{
    id: number;
    pt: string;
    tanggal_ttis: string;
    nomor_ttis: string;
    invoice_supplier: string; 
    mata_uang: string; 
    nilai_invoice: string; 
    ppn: string;
    negosiator: string;
    dok_key: string;
}

export interface IDetailTTIS{
    id: number;
    id_ps_ttis: number;
    pt: string;	
    supplier: string;	
    nomor_ttis: string;	
    tanggal_ttis: string;	
    franco: string;	
    mata_uang: string;	
    nomor_op: string;	
    tanggal_op: string;	
    tipe_op: string;	
    total_op: string;	
    ppn: string;	
    tagihan: string;	
    tanggal_invoice: string;
    status_barang: string;
    waktu_antar: string;
}

export interface ILPBHistory{
    id: number;
    nomor_op: string;	
    tanggal_op: string;	
    total_op: string;	
    ppn: string;	
    nomor_lpb: string;	
    tanggal_lpb: string;	
    total_lpb: string;	
    approval_lpb: string;	
    nomor_ttis: string;	
    skbi: string;	
    total_skbi: string;	
    stbi: string;	
    total_stbi: string;
}

export interface IOPHistory{
    id: number;
    nomor_op: string;	
    tanggal_op: string;	
    nomor_lpb: string;	
    tanggal_lpb: string;	
    total_op: string;	
    pembayaran: string;	
    nomor_ttis: string;	
    tanggal_ttis: string;	
    nomor_bku: string;	
    tanggal_bku: string;	
    nomor_voucher: string;	
    tanggal_voucher: string;
}

