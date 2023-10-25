export interface IVouApvDtl{
    id: number;
    unitusaha: string;
    keuangan: string;
    tanggal: string;
    bku: string;
    giro: string;
    voucher: string;
    nominal: number;
    supplier: string;
    keterangan: string;
}

export interface IVouApv{
    id: number;
    tanggal: string;
    keterangan: string;
    mgrapvtime: string;
}

export interface IVouLbr{
    id: number;
    id_ms_unitusaha: number;
    kodept: string;
    namapt: string;
    rekening: string;
    totalnominal: number;
    totallembar: string;
}

export interface IVouPT{
    id: number;
    kodept: string;
    namapt: string;
    komentar: string;
}

export interface IOpsiPT{
    id: number;
    kodept: string;
    namapt: string;
}