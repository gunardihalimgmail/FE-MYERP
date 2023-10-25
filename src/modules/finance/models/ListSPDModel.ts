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
