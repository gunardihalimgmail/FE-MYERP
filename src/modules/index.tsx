import ApprovalOP from './procurement/features/transaksi/approvalop';
import Penutupan from './procurement/features/transaksi/penutupan';
import UnitList from './marketing/features/unitlist/';
import BKUAccounting from './accounting/features/BKUAccounting';
import ApprovalBKU from './finance/features/ApprovalBKU';
import KirimSPD from './finance/features/ApprovalSPD/Kirim';
import TerimaSPD from './finance/features/ApprovalSPD/Terima';
import KirimOutstandingSPD from './finance/features/ApprovalSPD/KirimOutstanding';
import ListPeriodeIni from './agronomi/features/periodeini';
import BuatLaporanVoucher from './finance/features/VoucherApproval/transaksi/buatlapvoucher';
import ApproveLaporanVoucher from './finance/features/VoucherApproval/approval/apvlapvoucher';
import ListLaporanVoucher from './finance/features/VoucherApproval/list/listlapvoucher';
import ListSPD from './finance/features/ApprovalSPD/List';
import ApprovalGrade from './hr/features/pengajuangrade';
import SPDDitolak from './finance/features/ApprovalSPD/Ditolak';
import ListMemo from './memo/features/List/IOM';
import OutstandingMemo from './memo/features/Outstanding';
import BuatMemo from './memo/features/Buat/IOM';
import BuatPengajuan from './memo/features/Buat/Pengajuan';
import ListPengajuan from './memo/features/List/Pengajuan';
import ApprovalTTIS from './procurement/features/transaksi/approvalttis';
import ListOP from './procurement/features/List/ListOP';

export default [ 
    ApprovalOP,
    Penutupan,
    UnitList,
    BKUAccounting,
    ApprovalBKU, 
    KirimSPD, 
    TerimaSPD,
    KirimOutstandingSPD,
    ListPeriodeIni,
    BuatLaporanVoucher,
    ApproveLaporanVoucher,
    ListLaporanVoucher,
    ListSPD, 
    ApprovalGrade, 
    SPDDitolak,
    ListMemo,
    OutstandingMemo,
    BuatMemo,
    BuatPengajuan,
    ListPengajuan,
    ApprovalTTIS,
    ListOP
]; 