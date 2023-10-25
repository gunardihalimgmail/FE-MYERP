export interface IPengajuanGradeList {
    id: number;
    kodePT: string;
    jenis: string;
    tahun: number;
    bulan: number;
    nomorSurat: string;
    userRequest: string;
    tanggalRequest: Date;
    tanggalRequestStr: string;
    keterangan: string
    status: string
}

export interface IPengajuanGradeKaryawanDetail {
    id_Ms_ReqUpdateGradeDetail: number;
    id_Ms_ReqUpdateGrade: number;
    jenis: string;
    nomorSurat: string;
    id_Ms_KaryawanKebun: number;
    nomorKaryawan: string;
    namaKaryawan: string;
    tanggalBergabung: string;
    tingkatanUpahLast: string;
    tingkatanUpahReq: string;
    tingkatanUpahApp: string;
    jabatan: string;
    jabatanReq: string;
    jabatanApp: string;
    jenisKaryawan: string;
    jenisKaryawanReq: string;
    jenisKaryawanApp: string;
    unitUsahaLast: string;
    unitUsahaReq: string;
    unitUsahaApp: string;
    departemen: string;
    departemenReq: string;
    departemenApp: string;
    divisi: string;
    divisiReq: string;
    divisiApp: string;
    golongan: string;
    golonganReq: string;
    golonganApp: string;
    keterangan: string;
}

// export interface IPengajuanGradeKaryawanDetailModal {
//     isSelected: boolean;
//     id_Ms_ReqUpdateGradeDetail: number;
//     id_Ms_ReqUpdateGrade: number;
//     jenis: string;
//     nomorSurat: string;
//     id_Ms_KaryawanKebun: number;
//     nomorKaryawan: string;
//     namaKaryawan: string;
//     tanggalBergabung: string;
//     tingkatanUpahLast: string;
//     tingkatanUpahReq: string;
//     tingkatanUpahApp: string;
//     jabatan: string;
//     jabatanReq: string;
//     jabatanApp: string;
//     jenisKaryawan: string;
//     jenisKaryawanReq: string;
//     jenisKaryawanApp: string;
//     unitUsahaLast: string;
//     unitUsahaReq: string;
//     unitUsahaApp: string;
//     departemen: string;
//     departemenReq: string;
//     departemenApp: string;
//     divisi: string;
//     divisiReq: string;
//     divisiApp: string;
//     golongan: string;
//     golonganReq: string;
//     golonganApp: string;
//     keterangan: string;
// }

// export interface IApprovalPenjualanUnitDetail {
//     id: number;
//     jenisVRA: string;
//     kodeVRA: string;
//     nomorPolisi: string;
//     nomorSTNK: string;
//     masaBerlakuSTNK: string;
//     tanggalBerlakuPajak: string;
//     nomorMesin: string;
//     nomorRangka: string;
//     tipe: string;
//     merk: string;
//     nilaiAsset: number;
//     nilaiBuku: number;
//     tanggalPengajuan: string;
//     pengajuanPenjualan: string;
//     approveByAccounting: string;
//     approveBySPVDept: string;
//     approveByManagerDept: string;
// }

// export interface IApprovalPenjualanUnitDetailDocument {
//     id: number;
//     fileData: any;
// }