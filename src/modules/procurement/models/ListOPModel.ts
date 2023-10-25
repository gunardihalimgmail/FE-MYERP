export interface IOPList {
    id: number;
    franco: string;
    isApproved:string;
    isApprovedBy:number;
    isApprovedByName:string;
    isApprovedTime:string;
    isApprovedTimeStr:string;
    jatuhTempo:number;
    jenis:string;
    nomorOp:string;
    opKey:string;
    pt: string;
    supplier: string;
    tipeOP: string;
}
export interface IOPListDetail {
    id: number;
    isApproved:string;
    isApprovedByName:string;
    isApprovedTimeStr:string;
    keterangan:string;
    keteranganApproved:string;
    level:string;
    levelStyle:string;
    nomor:string;
    supplier: string;
    tanggalStr:string;
}


export interface ISPDList {
    id: number;
    nomor: string;
    perihal: string;
    flowType: string; // Ditujukan
    requestByName: string;
    requestTimeStr: string;
    pic: string;
    jenis: string;
    statusTimeStr: string;
    lastReceivedByName: string
    lastReceivedTimeStr: string
    lastNotes: string
    isRejected: number
}

export interface ISPDListDetail {
    id: number;
    level: number;
    keterangan: string;
    tanggal: string;
    receivedTime: Date;
    status: string;
}
