export interface IPenutupanList{
    id_ps_penutupan: number;
    id: number; //id_ps_spp || id_ps_op || ID_Inv_PengeluaranBarangKeCabangLain
    jenis: string; 
    referensi: string;
    tanggal: string;
    kodeGolongan: number;
    namaGolongan: string;
    assignee: string;
}
export interface IDetailPenutupan{
    id: number;
    flag: string;
    kodeBarang: string; 
    namaBarang: string;
    jumlah1: number;
    jumlah2: number;
    selisih: number;
    remark: string;
    pembuat: string;
    negosiator: string;
    perihalPenutupan: string;
    alasanPenutupan: string;
}