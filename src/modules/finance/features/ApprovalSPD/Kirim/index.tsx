import { useContext, useEffect, useState } from "react";
import MaterialReactTable, {
    MRT_ColumnDef
} from 'material-react-table';
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import SyncLoader from "react-spinners/SyncLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import { FinanceRootStoreContext } from "../../../stores/FinanceRootStore";
import { IOpsiTujuanList, IResultDataListKirimTerima, ISPDKirimTerimaList } from "../../../models/ApprovalSPDModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import Select from 'react-select';
import { useLocation } from "react-router-dom";
import { decryptData } from "../../../../../utils/encrypt";
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography, styled } from "@mui/material";
import { ExpandMore, ArrowForwardSharp, CheckCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import { funcShowCheckedOrAll, loadjs, removeCustomjs } from "../../../../../utils/others";
import { LoadingButton } from "@mui/lab";


const KirimSPD = () => {
    // const AccordionSummary = styled((props: AccordionSummaryProps) => (
    //         <AccordionSummary
    //           expandIcon={<ArrowForwardSharp sx={{ fontSize: '0.9rem' }} />}
    //           {...props}
    //         />
    //       ))(({ theme }) => ({
    //         backgroundColor:
    //           theme.palette.mode === 'dark'
    //             ? 'rgba(255, 255, 255, .05)'
    //             : 'rgba(0, 0, 0, .03)',
    //         flexDirection: 'row-reverse',
    //         '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    //           transform: 'rotate(90deg)',
    //         },
    //         '& .MuiAccordionSummary-content': {
    //           marginLeft: theme.spacing(1),
    //         },
    //       }));

    // const Accordion = styled((props: AccordionProps) => (
    //     <Accordion disableGutters elevation={0} square {...props} />
    //   ))(({ theme }) => ({
    //     border: `1px solid ${theme.palette.divider}`,
    //     '&:not(:last-child)': {
    //       borderBottom: 0,
    //     },
    //     '&:before': {
    //       display: 'none',
    //     },
    //   }));
    
    
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Kirim SPD';

    const [expanded, setExpanded] = React.useState<boolean | false>(true);
    const [showAllOrChecked, setShowAllOrChecked] = React.useState<string>('checked')   // checked or all (posisi button)
    const [showAllCheckStatus, setShowAllCheckStatus] = React.useState<string>('check') // khusus material react table

    // const [modalData, setModalData] = useState<BKUDetailOPLPB>();
    const [loader, setLoader] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const [dataSPDKirim, setDataSPDKirim] = useState<IResultDataListKirimTerima>();
    const [dataOpsiTujuanJKT, setDataOpsiTujuanJKT] = useState<IOpsiTujuanList[]>();
    const [dataOpsiTujuanEST, setDataOpsiTujuanEST] = useState<IOpsiTujuanList[]>();
    const [dataID, setDataID] = useState(0);
    const [dataNomor, setDataNomor] = useState("");
    const [showModalComment, setShowModalComment] = useState(false);
    const [data, setData] = useState<ISPDKirimTerimaList[]>([]);
    
    const handleCloseModalComment = () => {
        setTimeout(() => {
            document.getElementById("btnshowblur")?.blur();
        }, 300)

        setTimeout(() => {
            document.getElementById("focusinput")?.focus();
        }, 300)

        setShowModalComment(false);
    }


    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataSPDKirim, getDataOpsiTujuanJKT, getDataOpsiTujuanEST, kirimDocSpd, tolakDocSpd } = financeRootStore.approvalSPDStore; // , saveComment, kirimDocSpdHO, kirimDocSpdEST

    // var id = new URLSearchParams(useLocation().search);
    // const id_ms_login_link = id.get("idlg");

    // const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    // const id_ms_login_link_decrypt = decryptData(String(id_ms_login_link), salt);


    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();


    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);


    // Select Multiple Doc
    let anchorCheck = document.getElementById("showCheckedRowButton");
    let anchorSort = document.getElementById("sortButton");
    const [stateDocKey, setstateDocKey] = useState<Array<string>>([]);
    const [stateDoc, setstateDoc] = useState<ISPDKirimTerimaList[]>([]);

    const selectDoc = (documentSelected: any, selectedId: string, acctionMethod: string) => {

        if (stateDocKey.includes(selectedId)) {
            const newDocKey = stateDocKey.filter((id) => id !== selectedId);
            const newDoc = stateDoc.filter((id) => id.dokKey !== documentSelected.dokKey);
            setstateDocKey(newDocKey);
            setstateDoc(newDoc);
        }
        else {
            const newDocKey = [...stateDocKey];
            const newDoc = [...stateDoc];
            var replacedString = selectedId.replace("\r", "");

            // documentSelected = dataSPDKirim?.spdKirimTerimaList.filter(x => x.dokKey === replacedString)

            newDocKey.push(replacedString);
            newDoc.push(documentSelected);
            setstateDocKey(newDocKey);
            setstateDoc(newDoc);


            if (acctionMethod == "pressed") {
                anchorCheck?.click()
                anchorSort?.click()
            }
        }
    };

    let column:any = [
        {
            accessorKey: 'id',
            header: 'id',
            size: 40,
            enableHiding: false,  // disable column agar tidak tampil di tabel
        },
        {
            accessorKey: 'nomor', 
            header: 'Nomor',
            size: 200,
            enableColumnOrdering: true,    // enable move column
            enableColumnDragging: true
        },
        {
            accessorKey: 'pt',
            header: 'PT',
            size:100,
            enableColumnOrdering: true
            ,enableColumnDragging: true,
            //   Cell: ({cell})=>new Date(cell.getValue<Date>()).getDate() + " " + new Date(cell.getValue<Date>()).getMonth() + " " + new Date(cell.getValue<Date>()).getFullYear()
        },
        {
            accessorKey: 'perihal',
            header: 'Perihal',
            size:500,
            enableColumnOrdering: true,
            enableColumnDragging: true,
            Cell: ({cell})=>(  // contoh input-an di dalam cell
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.perihal}</span>
            )
        },
        {
            accessorKey: 'nilaiPermintaan',
            header: 'Nilai Permintaan',
            size:200,
            enableColumnOrdering: true,
            enableColumnDragging: true,
            Cell: ({ cell }) => (
                <div style={{ textAlign: 'right' }}>
                    {
                        cell.row.original.nilaiPermintaan ?
                            `Rp ${formatPrice(cell.row.original.nilaiPermintaan)}`
                        : ''  
                    }
                </div>
            ),
        },
        {
            accessorKey: 'lastNotes',
            header: 'Last Notes',
            enableColumnOrdering: true,
            enableColumnDragging: true,
        },
        {
            accessorKey: 'newNotes',
            header: 'Notes',
            enableColumnOrdering: true,
            enableColumnDragging: true,
            size: 230,
            Cell: ({cell}) => (
                <input id="fnote" onBlur={event => addNotes(event.target.value, cell.row.original)} style={{ width: "100%" }}
                    autoComplete="off" type="text" className="form-control" placeholder="Note.." />
            )
        },
        {
            accessorKey: 'ditujukan',
            header: 'Ditujukan',
            size:300,
            Cell: ({cell}) => (
                dataSPDKirim?.dataKaryawan.role == 'ALL' ? cell.row.original.flowType : 
                        cell.row.original.bagian == "JKT" ?
                        <Select
                            className="basic-single react-select-width"
                            classNamePrefix="select"
                            tabSelectsValue={true}
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            options={dataOpsiTujuanJKT}
                            // isLoading={loading}
                            maxMenuHeight={200}
                            // value={"data.flowType"}
                            onChange={(selectedOptionVal) => addOpsiTujuan(selectedOptionVal, cell.row.original)}
                        /> 
                        :
                        <Select
                            className="basic-single react-select-width"
                            classNamePrefix="select"
                            tabSelectsValue={true}
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            options={dataOpsiTujuanEST}
                            // isLoading={loading}
                            maxMenuHeight={200}
                            // value={"data.flowType"}
                            onChange={(selectedOptionVal) => addOpsiTujuan(selectedOptionVal, cell.row.original)}
                        />
            )
        },
        {
            accessorKey: 'requestByName',
            header: 'Request By',
            Cell: ({cell}) => (
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.requestByName}</span>
            )
        },
        {
            accessorKey: 'requestTimeStr',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'requestTimeStr',
            header: 'Request Time',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.requestTimeStr}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        },
        {
            accessorKey: 'lastReceivedByName',
            header: 'Receive By',
            Cell: ({ cell }) => (
                <span style = {{whiteSpace:'normal'}}>
                    {cell.row.original.lastReceivedByName}
                    {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                </span>
            )
        },
        {
            accessorKey: 'lastReceivedTimeStr',
            header: 'Receive Time'
        },

    ]


    // Count scanned row
    function distictCount() {
        const distinctDocKey: string[] = [];
        stateDocKey.map(data => {
            if (distinctDocKey.indexOf(data) === -1) {
                distinctDocKey.push(data)
            }
        });

        return distinctDocKey.length;
    }

    // console.log(dataSPDKirim)
    // console.log(stateDocKey)
    console.log(stateDoc)

    useEffect(() => {

        // var docKeyString = "";
        // var stateDocList: ISPDKirimTerimaList[] = [];
        // function handleKeyPress(event: { keyCode: any; which: any; }) {
        //     docKeyString += String.fromCharCode(event.which)

        //     if (event.keyCode === 13) {
        //         selectDoc(stateDocList, docKeyString, "pressed");
        //         docKeyString = "";
        //     }
        // }

        // window.addEventListener('keypress', handleKeyPress);


        // refresh data setelah transaksi
        loadData();
        loadjs('custom.js');

        return () => {
            // window.removeEventListener("keypress", handleKeyPress);
            removeCustomjs('custom.js')
        }

    }, []); // stateDocKey

    // function loadjs() {
    //     const timer = setTimeout(() => {
    //         removeCustomjs('custom.js')
            

    //         const script = document.createElement("script");
    //         script.src = "js/custom.js";
    //         script.async = true;
    //         document.body.appendChild(script);
    //     }, 300);
    //     return () => {
    //         clearTimeout(timer);
    //     }
    // }

    // Load data list BKU dan Akun
    function loadData() {

        setLoader(true)
        const SPDKirimList = getDataSPDKirim(id_ms_login).then(responseSPDKirim => { // id_ms_login_link_decrypt == null ? id_ms_login : id_ms_login_link_decrypt

            let getDataSPDTerima_Map:any[] = [];

            setDataSPDKirim(responseSPDKirim.result);

            setData(responseSPDKirim.result?.['spdKirimTerimaList'])

            // alert(JSON.stringify(responseSPDKirim.result.spdKirimTerimaList))
            // loadjs('custom.js')
            setLoader(false);
        })

        const OpsiJKT = getDataOpsiTujuanJKT("JKT").then(function (responseOpsiTujuan) {
            setDataOpsiTujuanJKT(responseOpsiTujuan.result);
        })

        const OpsiEST = getDataOpsiTujuanEST("EST").then(function (responseOpsiTujuan) {
            setDataOpsiTujuanEST(responseOpsiTujuan.result);
        })
    }


    function addOpsiTujuan(selectedOptions: any, dokumenSpd: any) {

        // handle ketika option di select
        const selectedValue = selectedOptions === null ? '' : selectedOptions.value
        dokumenSpd.flowType = selectedValue
        console.log(stateDoc)
    }

    function addNotes(strNotes: string, dokumenSpd: any) {

        dokumenSpd.newNotes = strNotes
        console.log(stateDoc)
    }


    function handleKirim() {

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan dikirim", "", "warning");
        } else {
            if (dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 3 ||
                dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 16 || dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 26) {
                    alert(JSON.stringify(stateDoc))
                var nomorDitujukan = "";
                stateDoc.forEach(element => {
                    if (element.flowType == "" || element.flowType == null) {
                        nomorDitujukan += element.nomor + "\n";
                    }
                });

                if (nomorDitujukan.length != 0) {
                    swal("Pilihan ditujukan harus diisi", "Nomor : \n" + nomorDitujukan, "info"); //  
                } else {
                    let param = {
                        id_ms_login: id_ms_login,
                        dokumenKirimTerima: stateDoc
                    };

                    console.log(param)

                    var messageSuccess = "";
                    stateDoc.forEach(element => {
                        messageSuccess += element.nomor + "\n";
                    });


                    const kirimDokumenSPD = kirimDocSpd(param).then(function (response) {
                        if (response?.statusCode === 200 && response?.result == 200) {
                            swal("Berhasil kirim dokumen!", "Nomor : \n" + messageSuccess, "success")
                                .then((value) => {
                                    window.location.reload();
                                });
                            loadData();

                        } else if (response?.result != "") {
                            swal("Gagal kirim dokumen!", response?.result, "error");
                        } else {
                            swal("Gagal approve!", "", "error");
                        }
                    });
                }

            }
            else {
                swal("SPD hanya bisa dikirim oleh Manager / Direktur!", "", "info");
            }

        }
    }


    // Handle tolak
    function handleTolak() {
        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan ditolak", "", "warning");
        } else {
            if (dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 3) {

                var nomorNewnotes = "";
                stateDoc.forEach(element => {
                    if (element.newNotes == "" || element.newNotes == null) {
                        nomorNewnotes += element.nomor + "\n";
                    }
                });

                if (nomorNewnotes.length != 0) {
                    swal("Alasan ditolak harus diisi di Notes", "", "info");
                } else {

                    let param = {
                        id_ms_login: id_ms_login,
                        dokumenKirimTerima: stateDoc
                    };

                    console.log(param)


                    var messageSuccess = "";
                    stateDoc.forEach(element => {
                        messageSuccess += element.nomor + "\n";
                    });

                    const tolakDokumenSPD = tolakDocSpd(param).then(function (response) {
                        if (response?.statusCode === 200 && response?.result == 200) {
                            swal("Berhasil tolak dokumen!", "Nomor : \n" + messageSuccess, "success")
                                .then((value) => {
                                    window.location.reload();
                                });
                            loadData();

                        } else if (response?.result != "") {
                            swal("Gagal tolak dokumen!", response?.result, "error");
                        } else {
                            swal("Gagal tolak!", "", "error");
                        }
                    });
                }

            }
            else {
                swal("SPD hanya bisa ditolak oleh Manager / Direktur!", "", "info");
            }

        }
    }


    function formatPrice(value: number) {
        if (value < 0) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            var aa = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            return '(' + aa.replace('-', '') + ')'
        } else {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
    }

    // Approve Direktur dan SPV (Tanpa Google Authentication)
    // function handleKirimEST() {

    //     if (stateDocKey.length == 0) {
    //         swal("Mohon pilih dokumen yang akan dikirim", "", "warning");
    //     } else {
    //         if (dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 3 ||
    //             dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 16 || dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 26) {

    //             var nomorDitujukan = "";
    //             stateDoc.forEach(element => {
    //                 if (element.flowType == "" || element.flowType == null) {
    //                     nomorDitujukan += element.nomor + "\n";
    //                 }
    //             });

    //             if (nomorDitujukan.length != 0) {
    //                 swal("Pilihan ditujukan harus diisi", "Nomor : \n" + nomorDitujukan, "info"); //  
    //             } else {
    //                 let param = {
    //                     id_ms_login: id_ms_login,
    //                     dokumenKirimTerima: stateDoc
    //                 };

    //                 console.log(param)

    //                 var messageSuccess = "";
    //                 stateDoc.forEach(element => {
    //                     messageSuccess += element.nomor + "\n";
    //                 });


    //                 const kirimDokumenSPD = kirimDocSpdEST(param).then(function (response) {
    //                     if (response?.statusCode === 200 && response?.result == 200) {
    //                         swal("Berhasil kirim dokumen!", "Nomor : \n" + messageSuccess, "success")
    //                             .then((value) => {
    //                                 window.location.reload();
    //                             });
    //                         loadData();

    //                     } else if (response?.result != "") {
    //                         swal("Gagal kirim dokumen!", response?.result, "error");
    //                     } else {
    //                         swal("Gagal approve!", "", "error");
    //                     }
    //                 });
    //             }
    //         }
    //         else {
    //             swal("SPD hanya bisa dikirim oleh Manager / Direktur!", "", "info");
    //         }
    //     }
    // }

    // function handleKirimHO() {


    //     if (stateDocKey.length == 0) {
    //         swal("Mohon pilih dokumen yang akan dikirim", "", "warning");
    //     } else {
    //         if (dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 3 ||
    //             dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 16 || dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 26) {

    //             let param = {
    //                 id_ms_login: id_ms_login,
    //                 dokKey: stateDocKey
    //             };

    //             const kirimDokumenSPD = kirimDocSpdHO(param).then(function (response) {
    //                 if (response?.statusCode === 200 && response?.result == 200) {
    //                     swal("Berhasil kirim dokumen!", "", "success")
    //                         .then((value) => {
    //                             window.location.reload();
    //                         });
    //                     loadData();

    //                 } else if (response?.result != "") {
    //                     swal("Gagal kirim dokumen!", response?.result, "error");
    //                 } else {
    //                     swal("Gagal approve!", "", "error");
    //                 }
    //             });
    //         }
    //         else {
    //             swal("SPD hanya bisa dikirim oleh Manager / Direktur!", "", "info");
    //         }

    //     }
    // }

    // const handleFinalFormSubmitComment = (values: any) => {

    //     const { ...CommentStr } = values;

    //     // Handle Reject
    //     let param = {
    //         ID: dataID,
    //         Nomor: dataNomor,
    //         CommentNotes: CommentStr.commentstr
    //     };

    //     console.log(param)

    //     const saveCommentSpd = saveComment(param).then(function (response) {
    //         if (response?.statusCode === 200) {
    //             swal("Berhasil simpan note!", "", "success");
    //             setShowModalComment(false);
    //             loadData();
    //         } else {
    //             swal("Gagal simpan note!", "", "error");
    //         }
    //     });
    // }

    // function handleShow(id: number, nomor: string) {
    //     setShowModalComment(true);
    //     setDataID(id);
    //     setDataNomor(nomor);
    // }


    // const handleChange =
    //     (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    //         setExpanded(isExpanded ? panel : false);
    //     };

    // function removeCustomjs(){
    //     var scriptElement = document.body.getElementsByTagName("script") 
    //     for (var i = scriptElement.length - 1; i >= 0; i--){
    //         var indexCustom = scriptElement[i].src.lastIndexOf("/custom.js")
    //         if (indexCustom != -1){
    //             scriptElement[i].parentNode?.removeChild(scriptElement[i])
    //         }
    //     }
    // }

    function handleClickShowChecked(status){

        // status antara checked or all
        if (expanded){
            if (status == 'checked' || status == 'all'){

                removeCustomjs('custom.js')
                loadjs('custom.js')

                // removeCustomjs()
                // loadjs()

                // var script = document.createElement("script")
                // script.src = "js/custom.js";
                // script.async = true;
                // document.body.appendChild(script)
            }
        }

        if (status == 'all'){
            // status checked yang di filter
            funcShowCheckedOrAll('checked')
        }else if (status == 'checked'){
            // status all yang di filter
            funcShowCheckedOrAll('all')
        }

        setShowAllOrChecked(status)

    }

    const handleChangeAccordion = 
        (panel:string) => (event: React.SyntheticEvent, isExpanded: boolean) =>
    {
        if (isExpanded){
            // jika terbuka maka reload kembali jquery nya
            removeCustomjs('custom.js')
            loadjs('custom.js')

            if (showAllOrChecked == 'all'){

                funcShowCheckedOrAll('checked')
            //     setTimeout(()=>{
            //         let rows = document.querySelectorAll<HTMLTableRowElement>("#mytableSort tbody tr")
            //         rows.forEach(row=>{
            //             if (!row.classList.contains("showChecked")){
            //                 row.style.display = 'none'
            //             }
            //         })
            //     })
            }
        }
    }

    return (
        <>
            <div>
                {/* <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Kirim SPD</h2>
                    </div>
                </div> */}
                {/* <div className="wrapper wrapper-content animated fadeInRight"> */}
                    {/* <div className="row  border-bottom white-bg dashboard-header"> */}
                        <div style = {{marginBottom:'50px'}}>
                            <MaterialReactTable
                                columns={column}
                                data={data}
                                displayColumnDefOptions={{
                                    'mrt-row-select': {
                                        enableColumnActions: false, // matikan opsi menu titik tiga
                                        header:'Select'
                                    },
                                    // 'mrt-row-actions':{
                                    //     header: 'Detail'
                                    // }
                                }}
                                enableEditing={true}
                                enablePagination={data.length > 0 ? true : false}
                                enableDensityToggle={true}
                                enableColumnResizing={true}
                                enableRowNumbers
                                rowNumberMode="original"
                                // muiSelectCheckboxProps={({row})=>({ // pada saat click check selection
                                //     onClick: (event) => {
                                //         alert(row.original.nomor + " -> " + event.target?.['checked'])
                                //     }
                                // })}
                                // muiTableBodyRowProps={({row})=>({   // pada saat click satu row
                                //     onClick: row.getToggleSelectedHandler(),
                                //     sx:{cursor:'pointer'}
                                // })}
                                enableMultiRowSelection={true}  // multi select
                                initialState={{ 
                                    density: 'compact',
                                    columnVisibility: { id: false, 
                                                detail: (id_ms_login != 2 && id_ms_login != 3 && id_ms_login != 4 && id_ms_login != 1587) ? true : false,
                                                dirNotes: id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ? true : false,
                                            },
                                    showGlobalFilter: true,
                                    columnOrder:[
                                        'mrt-row-numbers',
                                        'detail',
                                        'doc',
                                        'mrt-row-select',
                                        'nomor',
                                        'pt',
                                        'perihal',
                                        'nilaiPermintaan',
                                        'lastNotes',
                                        'newNotes',
                                        'ditujukan',
                                        'requestByName',
                                        'requestTimeStr',
                                        'statusByName',
                                        'statusTimeStr'
                                    ]
                                }}
                                muiTableBottomToolbarProps={{
                                    sx:{
                                        '.MuiInputBase-root':{
                                            marginTop:'-12px'
                                        },
                                        '.MuiTablePagination-displayedRows':{
                                            marginTop:'6px'
                                        },
                                        '.MuiTablePagination-actions': {
                                            marginBottom:'12px'
                                        }
                                    }
                                }}
                                muiTableHeadCellProps={{
                                    sx:{
                                        backgroundColor:'transparent',
                                        color: 'black'
                                    }
                                }}
                                enableColumnFilters={true}
                                muiTableBodyProps={{
                                    sx:{
                                        '& tr:nth-of-type(even)': {
                                            backgroundColor: 'beige'
                                        }
                                    }
                                }}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [5,10,15,20,50, {value: data.length, label: 'All'}],
                                    showFirstButton: true,  
                                    showLastButton: true
                                }}
                                muiTableHeadCellFilterTextFieldProps={{
                                    sx:{
                                        '.MuiInputBase-input':{
                                            color: 'black'
                                        }
                                    },
                                    variant:'standard'  // bentuk filter text
                                }}
                                muiSearchTextFieldProps={{
                                    size:'small',
                                    variant: 'standard',
                                    label: '',
                                    InputLabelProps: { shrink: true }
                                }}  // search global di kanan atas
                                enableSelectAll={false}
                                enableRowSelection = {true}
                                enableGlobalFilterChangeMode={true}
                                enableColumnFilterChangeMode={true}
                                enableColumnOrdering={true}
                                enableRowActions={false}     // kolom 'Actions'
                                state = {{ showSkeletons: loader}}
                                positionToolbarAlertBanner="top"
                                renderTopToolbarCustomActions={({ table }) => {
                                
                                const handleKirim = () => {
                                    if (dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 3 ||
                                        dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 16 || dataSPDKirim?.dataKaryawan.iD_Ms_Divisi == 26) 
                                    {
                                        if(table.getSelectedRowModel().flatRows.length > 0)
                                        {
                                            var messageSuccess = "";
                                            const array: React.SetStateAction<string[]> = [];
                                            const rowSelected: React.SetStateAction<ISPDKirimTerimaList[]> = [];
                                
                                            table.getSelectedRowModel().flatRows.map((row) => {
                                                messageSuccess +=  '\n' + row.getValue('nomor');
                                                array.push(row.original.id.toString());
                                                rowSelected.push(row.original)
                                            });
    
                                            let param = {
                                                id_ms_login: id_ms_login,
                                                dokumenKirimTerima: rowSelected
                                            }
    
                                            console.log(param)
                            
                                            swal({
                                                title: "Kirim SPD",
                                                text: "Apakah Anda Yakin Kirim SPD dengan Nomor" + messageSuccess,
                                                icon: "info",
                                                buttons: [
                                                'Kembali!',
                                                'Kirim!'
                                                ],
                                                dangerMode: true
                                            })
                                            .then(function(isConfirm) {
                                                if (isConfirm) {

                                                    const terimaDokumenSPD = kirimDocSpd(param).then(function (response) {
                                                        var aaa = response.statusCode;
                                                        if (response?.statusCode === 200 && response?.result == 200) {
                                                            swal("Berhasil kirim dokumen!", "Nomor : \n" + messageSuccess, "success")
                                                                .then((value) => {
                                                                    window.location.reload();
                                                                });
                                                            loadData();
                                
                                                        } else if (response?.result != "") {
                                                            swal("Gagal kirim dokumen!", response?.result, "error");
                                                        } else {
                                                            swal("Gagal approve!", "", "error");
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                        else
                                        {
                                            swal("Mohon pilih SPD yang akan di kirim", "", "warning");
                                        }
                                    }
                                    else{
                                        swal("SPD hanya bisa dikirim oleh Manager / Direktur!", "", "info");
                                    }

                                }
                                const handleTolak = () => {
                                    if (dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDKirim?.dataKaryawan.iD_Ms_Jabatan == 3) 
                                    {
                                        if(table.getSelectedRowModel().flatRows.length > 0)
                                        {
                                            var messageSuccess = "";
                                            const array: React.SetStateAction<string[]> = [];
                                            const rowSelected: React.SetStateAction<ISPDKirimTerimaList[]> = [];
                                            let nomorNewNotes = "";
                                
                                            table.getSelectedRowModel().flatRows.map((row) => {
                                                messageSuccess +=  '\n' + row.getValue('nomor');
                                                array.push(row.original.id.toString());
                                                rowSelected.push(row.original)
                                                if (typeof(row.original?.['newNotes']) == undefined || row.original?.['newNotes'] == null)
                                                {
                                                    nomorNewNotes += row.original.nomor + "\n";
                                                }
                                                else if (row.original?.['newNotes'].toString().trim() == "") 
                                                {
                                                    nomorNewNotes += row.original.nomor + "\n";
                                                }
                                                
                                            });

                                            if (nomorNewNotes.length != 0){
                                                swal("Alasan ditolak harus diisi di Notes", "", "info");
                                            } else 
                                            {
                                                let param = {
                                                    id_ms_login: id_ms_login,
                                                    dokumenKirimTerima: rowSelected
                                                }

                                                console.log(param)

                                                swal({
                                                    title: "Tolak SPD",
                                                    text: "Apakah Anda Yakin Tolak SPD dengan Nomor" + messageSuccess,
                                                    icon: "error",
                                                    buttons: [
                                                    'Kembali!',
                                                    'Tolak!'
                                                    ],
                                                    dangerMode: true
                                                })
                                                .then(function(isConfirm) {
                                                    if (isConfirm) {
                                                        alert(JSON.stringify(param))

                                                        const tolakDokumenSPD = tolakDocSpd(param).then(function (response) {
                                                            if (response?.statusCode === 200 && response?.result == 200) {
                                                                swal("Berhasil tolak dokumen!", "Nomor : \n" + messageSuccess, "success")
                                                                    .then((value) => {
                                                                        window.location.reload();
                                                                    });
                                                                loadData();
                                    
                                                            } else if (response?.result != "") {
                                                                swal("Gagal tolak dokumen!", response?.result, "error");
                                                            } else {
                                                                swal("Gagal tolak!", "", "error");
                                                            }
                                                        });
                                                    }
                                                })
                                            }
    
    
                                
                                        }
                                        else
                                        {
                                            swal("Mohon pilih SPD yang akan di tolak", "", "warning");
                                        }
                                    }
                                    else
                                    {
                                        swal("SPD hanya bisa ditolak oleh Manager / Direktur!", "", "info");
                                    }
                                }

                                const handleShow = () => {
                                    setLoader(true); 
                                    // setLoadingShow(true);
                    
                                    var promise = new Promise(function(resolve, reject) {
                                        var show = document.getElementsByClassName('MuiTableRow-root MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
                                        for (var i = 0; i < show.length; i += 1) 
                                        {
                                            show[i].style.visibility = 'visible';
                                        } 
                                        resolve(true);
                                    })
                        
                                    promise.then(bool => setTimeout(function() {
                                        setLoader(false);
                                        setShowAllCheckStatus('check')
                                        // setLoadingShow(false);
                                    }, 1000))
                                };

                                const handleHide = () => {
                                    setLoader(true);
                                    // setLoadingHide(true);
                                    var promise = new Promise(function(resolve, reject) {
                                    var hide = document.getElementsByClassName('MuiTableRow-root MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
                                    var show = document.getElementsByClassName('MuiTableRow-root Mui-selected MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
                                    
                                    for (var i = 0; i < hide.length; i += 1) 
                                    {
                                        hide[i].style.visibility = 'collapse';
                                    }
                        
                                    for (var i = 0; i < show.length; i += 1) 
                                    {
                                        show[i].style.visibility = 'visible';
                                    }
                        
                                    resolve(true);
                                    })

                                    promise.then(bool => setTimeout(function() {
                                        setLoader(false);
                                        setShowAllCheckStatus('all')
                                        // setLoadingHide(false);
                                    }, 100))
                                };

                                return (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <LoadingButton
                                            color="success"
                                            onClick={() => handleKirim()}
                                            // loading={loadingApprove}
                                            disabled={table.getSelectedRowModel().flatRows.length === 0}
                                            startIcon={<CheckCircle />}
                                            variant="contained"
                                            loadingIndicator="Loading…"
                                        >
                                            Kirim
                                        </LoadingButton>
                                        <LoadingButton
                                            color="error"
                                            onClick={() => handleTolak()}
                                            // loading={loadingApprove}
                                            disabled={table.getSelectedRowModel().flatRows.length === 0}
                                            startIcon={<CheckCircle />}
                                            variant="contained"
                                            loadingIndicator="Loading…"
                                        >
                                            Tolak
                                        </LoadingButton>

                                        {
                                            showAllCheckStatus == 'all' && 
                                            (
                                                <LoadingButton
                                                    color="info"
                                                    onClick={() => handleShow()}
                                                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                                                    loading={loadingShow}
                                                    startIcon={<Visibility />}
                                                    variant="outlined"
                                                    loadingIndicator="Loading…"
                                                >
                                                    Show All Row
                                                </LoadingButton>
                                            )
                                        }

                                        {
                                            showAllCheckStatus == 'check' &&
                                            (
                                                <LoadingButton
                                                    color="info"
                                                    onClick={() => {
                                                        handleHide();
                                                    }}
                                                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                                                    // loading={loadingHide}
                                                    startIcon={<VisibilityOff />}
                                                    variant="outlined"
                                                    loadingIndicator="Loading…"
                                                >
                                                    Show Checked Row Only
                                                </LoadingButton>
                                            )
                                        }
                                    </div> 
                                )
                            }}
                            />
                        </div>

                        {/* <div className="col-lg-12"> */}
                            {/* <div className="ibox "> */}
                            {/* <Accordion defaultExpanded={expanded} 
                                        TransitionProps={{ unmountOnExit: true }}
                                        onChange={handleChangeAccordion('panel1')}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <h5>Kirim SPD List</h5>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <div>
                                        {dataSPDKirim?.dataKaryawan.role == 'ALL' ?
                                            <div 
                                                    // className="row"
                                                    className="d-flex justify-content-start"
                                                    style = {{gap:'5px'}}
                                            >
                                                <div 
                                                    // className="col-md-2"
                                                >
                                                    <Button variant="primary" onClick={() => handleKirim()}><i className="fa fa-paper-plane" aria-hidden="false"></i> Kirim</Button>
                                                </div>

                                                <br />
                                                <br />

                                                <div 
                                                    // className="col-md-2"
                                                >
                                                    <Button variant="danger" onClick={() => handleTolak()}>
                                                        <i className="fa fa-times">
                                                            </i> Tolak
                                                    </Button>
                                                </div>


                                                <br />
                                                <br />

                                                <div>

                                                    {showAllOrChecked == 'checked' && 
                                                        <Button variant="secondary" id="showCheckedRowButton-custom" 
                                                            onClick={()=>handleClickShowChecked('all')}>
                                                            Show Checked Row Only</Button> 
                                                    }
                                                    {showAllOrChecked == 'all' && 
                                                        <Button variant="secondary" id="showAll-custom" 
                                                            // style={{ display: "none" }} 
                                                            onClick={()=>handleClickShowChecked('checked')}>Show All Row</Button>
                                                    }
                                                    <Button id="sortButton" style={{ display: "none" }}>Sort</Button>
                                                </div>
                                            </div>

                                            :

                                            <div 
                                                // className="row"
                                                className="d-flex justify-content-start"
                                                style = {{gap:'5px'}}
                                            >

                                                <div 
                                                    // className="col-md-2"
                                                >
                                                    <Button variant="primary" onClick={() => handleKirim()}><i className="fa fa-paper-plane" aria-hidden="false"></i> Kirim</Button>
                                                </div>

                                                <br />
                                                <br />

                                                <div 
                                                    // className="col-md-4"
                                                >
                                                    {showAllOrChecked == 'checked' && 
                                                        <Button variant="secondary" id="showCheckedRowButton-custom"
                                                                onClick={()=>handleClickShowChecked('all')}>Show Checked Row Only</Button>
                                                    }
                                                    {showAllOrChecked == 'all' && 
                                                        <Button variant="secondary" id="showAll-custom" 
                                                                // style={{ display: "none" }}
                                                                onClick={()=>handleClickShowChecked('checked')}>Show All Row</Button>
                                                    }
                                                    <Button id="sortButton" style={{ display: "none" }}>Sort</Button>
                                                </div>
                                            </div>


                                        }

                                        <hr />

                                    </div>

                                    <div className="table-responsive">

                                        <div>
                                            <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />

                                            <h3>Selected row: {distictCount()}</h3>

                                            
                                            <br /><br /><br />
                                            <table id="mytableSort" className="table table-striped table-hover css-serial filterclass">
                                                <thead>
                                                    <tr className="showChecked">
                                                        <th className="bg-primary">#</th>

                                                        <th className="bg-primary">Select</th>
                                                        <th className="bg-primary">Nomor</th>
                                                        <th className="bg-primary">PT</th>
                                                        <th className="bg-primary">Perihal</th>
                                                        <th className="bg-primary">Nilai Permintaan</th>
                                                        <th className="bg-primary">Last Notes</th>
                                                        <th className="bg-primary">Notes</th>
                                                        <th className="bg-primary">Ditujukan</th>

                                                        {
                                                            (dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <th className="bg-primary">Request By</th>
                                                        }
                                                        {
                                                            (dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <th className="bg-primary">Request Time</th>
                                                        }
                                                        {
                                                            (dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <th className="bg-primary">Receive Time</th>
                                                        }
                                                        {
                                                            (dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <th className="bg-primary">Receive by</th>
                                                        }


                                                        {dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202 ?
                                                            <th className="bg-primary">Request By</th> : ''}
                                                        {dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202 ?
                                                            <th className="bg-primary">Request Time</th> : ''}
                                                        {dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202 ?
                                                            <th className="bg-primary">Receive Time</th> : ''}
                                                        {dataSPDKirim?.dataKaryawan.bagian == 'JKT' && id_ms_login != 202 ?
                                                            <th className="bg-primary">Receive by</th> : ''}

                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {dataSPDKirim?.spdKirimTerimaList.map(data => (
                                                        <tr className={stateDocKey.includes(data.dokKey) ? "showChecked" : ""} 
                                                            style={{ backgroundColor: stateDocKey.includes(data.dokKey) ? "#FFCF8B" : "",
                                                                    display: showAllOrChecked == 'all' ? stateDocKey.includes(data.dokKey) ? 'table-row': 'none' : '' }}>
                                                            <td></td>
                                                           
                                                            <td className="text-center" key={data.dokKey}>
                                                                <label className="checkboxcontainer">
                                                                    <input
                                                                        // id="focusinput"
                                                                        value={data.dokKey}
                                                                        onChange={() => selectDoc(data, data.dokKey, "clicked")}
                                                                        type="checkbox"
                                                                        checked={stateDocKey.includes(data.dokKey) ? true : false}
                                                                    />

                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </td>
                                                            <td>{data.nomor}</td>
                                                            <td>{data.pt}</td>
                                                            <td>{data.perihal}</td>
                                                            <td>{data.mataUang} {formatPrice(data.nilaiPermintaan)}</td>
                                                            <td>{data.lastNotes}</td>
                                                            <td>
                                                                <input id="fnote" onBlur={event => addNotes(event.target.value, data)} style={{ width: "200px" }}
                                                                    autoComplete="off" type="text" className="form-control" placeholder="Note.." />

                                                            </td>
                                                            <td>
                                                                {dataSPDKirim.dataKaryawan.role == 'ALL' ?
                                                                    data.flowType
                                                                    :

                                                                    data.bagian == "JKT" ? 
                                                                    
                                                                    <Select
                                                                        className="basic-single react-select-width"
                                                                        classNamePrefix="select"
                                                                        tabSelectsValue={true}
                                                                        isDisabled={false}
                                                                        isClearable={true}
                                                                        isSearchable={false}
                                                                        menuPortalTarget={document.body}
                                                                        options={dataOpsiTujuanJKT}
                                                                        // isLoading={loading}
                                                                        maxMenuHeight={200}
                                                                        // value={"data.flowType"}
                                                                        onChange={(selectedOptionVal) => addOpsiTujuan(selectedOptionVal, data)}
                                                                    /> 
                                                                    
                                                                    : 
                                                                    
                                                                    <Select
                                                                        className="basic-single react-select-width"
                                                                        classNamePrefix="select"
                                                                        tabSelectsValue={true}
                                                                        isDisabled={false}
                                                                        isClearable={true}
                                                                        isSearchable={false}
                                                                        menuPortalTarget={document.body}
                                                                        options={dataOpsiTujuanEST}
                                                                        // isLoading={loading}
                                                                        maxMenuHeight={200}
                                                                        // value={"data.flowType"}
                                                                        onChange={(selectedOptionVal) => addOpsiTujuan(selectedOptionVal, data)}
                                                                    />

                                                                    

                                                                }

                                                            </td>

                                                            {(dataSPDKirim.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <td>{data.requestByName}</td>}
                                                            {(dataSPDKirim.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <td>{data.requestTimeStr}</td>}
                                                            {(dataSPDKirim.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <td>{data.lastReceivedTimeStr}</td>}
                                                            {(dataSPDKirim.dataKaryawan.bagian == 'JKT' && id_ms_login != 202) &&
                                                                <td>{data.lastReceivedByName}</td>}

                                                        </tr>
                                                    ))}

                                                </tbody>

                                            </table>
                                        </div>

                                    </div>


                                </AccordionDetails>
                            </Accordion> */}

                                {/* <div className="ibox-title bg-primary">
                                    <h5>Kirim SPD List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div> */}

                                {/* <div className="ibox-content"> */}

                                    
                                {/* </div> */}

                                {/* <div className="iboxs-content"> */}

                                    
                                {/* </div> */}

                            {/* </div> */}
                            
                        {/* </div> */}
                    {/* </div> */}
                {/* </div> */}
            </div>


            {/* <Modal
                show={showModalComment}
                onHide={handleCloseModalComment}
                centered
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title id="contained-modal-title-vcenter">
                        Berikan Komentar/Note
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">

                        <h3>Comment</h3>
                        <Form
                            onSubmit={handleFinalFormSubmitComment}

                            render={({ handleSubmit }) => (
                                <form className="m-t" method="POST" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <Field name="commentstr">
                                            {({ input, meta }) => {
                                                return (
                                                    <React.Fragment>

                                                        <textarea {...input} autoComplete="off" maxLength={100}
                                                            className="form-control" placeholder="Comment.." rows={4} />


                                                    </React.Fragment>
                                                );
                                            }}
                                        </Field>
                                    </div>

                                    <br /><br />

                                    <button type="submit" className="ladda-button btn btn-success block full-width m-b" data-style="zoom-in" >Simpan</button>

                                </form>
                            )}
                        />

                    </div>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal> */}

        </>
    );
};

export default {
    routeProps: {
        path: '/finance/approval/kirimdokumenspd',
        exact: true,
        component: KirimSPD
    },
    name: 'KirimSPD',
};