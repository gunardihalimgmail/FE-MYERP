export interface IApprovalOP{
    id: number;
    nomor: string;
    tanggal: string; 
    golonganBarang: string;
    supplier: string;
    grandTotal: number;
    mataUang: string;
    dokKey: string;
}

export interface IApprovalOPDetailCompare{
    opapprovaldetail: IDetailOP[];
    opcompareharga: ICompareOP[];
    opcomparehargaspesifikasi: ICompareOP[];
    ophistoryspec: IHistorySpec[];
}

export interface IDetailOP{
    id: number;
    iD_Ps_OP: number;
    nomorOP: string;
    iD_Ps_SPP: number;
    nomorSPP: string;
    iD_Ms_Barang: number;
    namaBarang: string; 
    satuan: string;
    spesifikasi: string;
    jumlah: number;
    hargaSatuan: number;
    totalHarga: number;
    totalOP: number;
    ppn: number;
    grandTotalOP: number;
    negosiator: string;
    catatan: string;
    mataUang: string;
    supplier: string;
    remarks: string;
    timeline: string;
    alasan: string;
    incoterm: string;
    statusBarang: string;
    jadwalKirim: string;
    pembayaran: string;
}

export interface ICompareOP{
    id: number;
    kodeBarang: string;
    namaBarang: string; 
    compare1: string;
    compare2: string;
    compare3: number;
    compare4: string;
    compare5: string;
}

export interface IHistorySpec{
    nomor_OP:string;
    nomor_SPP:string;
    iD_Ms_GolonganBarang: number;
    id_Ms_Barang:number;
    nama_Barang:string;
    nama_Golongan_Barang:string;
    id_Barang_SubLama:number;
    nama_Spek_Lama:string;
    id_Barang_SubDiv:number;
    nama_Spek_Div:string;
    id_Barang_SubBnC:number;
    nama_Spek_BnC:string;
    id_Barang_SubNego:number;
    nama_Spek_Nego:string;
}