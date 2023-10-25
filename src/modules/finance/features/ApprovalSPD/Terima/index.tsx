import { useContext, useEffect, useMemo, useState } from "react";
import MaterialReactTable, {
    MRT_ColumnDef
} from 'material-react-table';
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import React from "react";
import { FinanceRootStoreContext } from "../../../stores/FinanceRootStore";
import { IDirNotes, IOpsiTujuanList, IResultDataListKirimTerima, ISPDKirimTerimaList } from "../../../models/ApprovalSPDModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import Select from "react-select";
import { formatDate, funcShowCheckedOrAll, loadjs, removeCustomjs } from "../../../../../utils/others";
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, MenuItem, ThemeProvider, createMuiTheme, createTheme } from "@mui/material";
import { CheckCircle, EmailOutlined, ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { $mobx } from "mobx";
import $ from 'jquery'
import { IApprovalOP } from "../../../../procurement/models/ApprovalOPModel";
import { ProcurementRootStore, ProcurementRootStoreContext } from "../../../../procurement/stores/ProcurementRootStore";
import { LoadingButton } from "@mui/lab";


const TerimaSPD = () => {

    let [finishLoad,setFinishLoad] = useState();


    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Terima SPD';

    const [expanded, setExpanded] = React.useState<boolean | false>(true);
    const [showAllOrChecked, setShowAllOrChecked] = React.useState<string>('checked')   // checked or all (posisi button)
    const [showAllCheckStatus, setShowAllCheckStatus] = React.useState<string>('check') // khusus material react table

    let [dataSPDTerima, setDataSPDTerima] = useState<IResultDataListKirimTerima>();
    const [dataOpsiTujuanJKT, setDataOpsiTujuanJKT] = useState<IOpsiTujuanList[]>([]);
    const [dataOpsiTujuanEST, setDataOpsiTujuanEST] = useState<IOpsiTujuanList[]>([]);
    const [modalData, setModalData] = useState<IDirNotes[]>();
    const [loadingApprove, setLoadingApprove] = useState(false);

    const [show, setShow] = useState(false);

    // for testing
    const procurementRootStore = useContext(ProcurementRootStoreContext)
    const { getDataOP, approvalOP } = procurementRootStore.approvalOPStore;
    const [data, setData] = useState<ISPDKirimTerimaList[]>([]);
    // ... end testing

    const [loader, setLoader] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const [loadingHide, setLoadingHide] = useState(false);

    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataSPDTerima, getDataOpsiTujuanEST, getDataOpsiTujuanJKT, getDirNotes, terimaDocSpd, tolakDocSpd } = financeRootStore.approvalSPDStore; // , updateDitujukan

    const handleClose = () => {
        setShow(false);
    }

    // var id = new URLSearchParams(useLocation().search);
    // const id_ms_login_link = id.get("id_ms_login");
    
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
            const newDoc = stateDoc.filter((id) => id !== documentSelected);
            setstateDocKey(newDocKey);
            setstateDoc(newDoc);
        }
        else {
            const newDocKey = [...stateDocKey];
            const newDoc = [...stateDoc];
            var replacedString = selectedId.replace("\r", "");

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


    console.log(stateDocKey)
    console.log(stateDoc)


    // Using React component
    type SelectProps = React.ComponentProps<typeof Select>;

    let MySelectJKT = ({
        onChange,
        defaultValue
    }: Pick<SelectProps, "onChange" | "defaultValue">) => {
        return <Select
            className="basic-single react-select-width"
            classNamePrefix="select"
            tabSelectsValue={true}
            isDisabled={false}
            isClearable={false}
            isSearchable={true}
            menuPortalTarget={document.body}
            // styles={{
            //     // Fixes the overlapping problem of the component
            //     menu: provided => ({ ...provided, zIndex: 9999 })
            //   }}
            menuPosition={'fixed'} 
            maxMenuHeight={200}
            options={dataOpsiTujuanJKT}
            // options={[{value:'wfe',label:'asd'}]}
            {...{ onChange, defaultValue }} />;
    };

    const MySelectEST = ({
        onChange,
        defaultValue
    }: Pick<SelectProps, "onChange" | "defaultValue">) => {
        return <Select
            className="basic-single react-select-width"
            classNamePrefix="select"
            tabSelectsValue={true}
            isDisabled={false}
            isClearable={false}
            isSearchable={true}
            menuPortalTarget={document.body}
            maxMenuHeight={200}
            options={dataOpsiTujuanEST}
            {...{ onChange, defaultValue }} />;
    };

    // function removeCustomjs(){
    //     var scriptElement = document.body.getElementsByTagName("script") 
    //     for (var i = scriptElement.length - 1; i >= 0; i--){
    //         var indexCustom = scriptElement[i].src.lastIndexOf("/custom.js")
    //         if (indexCustom != -1){
    //             scriptElement[i].parentNode?.removeChild(scriptElement[i])
    //         }
    //     }
    // }

    const handleChangeAccordion = 
        (panel:string) => (event: React.SyntheticEvent, isExpanded: boolean) =>
    {
        if (isExpanded){
            // jika terbuka maka reload kembali jquery nya
            removeCustomjs('custom.js')
            loadjs('custom.js')

            // posisi sekarang 'all' waktu expand, berarti data yang muncul ter-checked
            if (showAllOrChecked == 'all'){
                
                funcShowCheckedOrAll('checked')
                // const rows = $("#mytableSort tr")
                // setTimeout(()=>{
                //     let rows = document.querySelectorAll<HTMLTableRowElement>("#mytableSort tbody tr")
                //     rows.forEach(row=>{
                //         if (!row.classList.contains("showChecked")){
                //             row.style.display = 'none'
                //         }
                //     })
                // })

                // var black = rows.filter(".showChecked").show();
                // rows.not(black).hide();


            }
        }
    }

    let column:any;

    column = [
        {
            accessorKey: 'id',
            header: 'id',
            size: 40,
            enableHiding: false,  // disable column agar tidak tampil di tabel
          },
          {
              accessorKey: 'detail',
              header: 'Detail',
              size:60,
              enableResizing:false,
              enableSorting: false,
              enableColumnActions: false,
              enableColumnOrdering: false,
              Cell: ({cell}) => (
                  <div className="btn-group">
                     <Button variant="success"
                          style = {{height:'30px'}}
                          onClick={() => {handleShow(cell.row.original.nomor); }}
                      >
                          <i className="fa fa-info" aria-hidden="true"></i>
                      </Button>
                  </div>
              )
          },
          {
              accessorKey: 'doc',
              header: 'Doc',
              size: 60,
              enableResizing:false,
              enableSorting: false,
              enableColumnActions: false,
              enableColumnOrdering: false,
              Cell: ({cell}) => (
                  <div className="btn-group">
                      <Button
                          style = {{height:'30px', display:'flex',justifyContent:'center',alignItems:'center'}}
                          variant={cell.row.original.isDownload == "1" ? "success" : "danger"} 
                          disabled={cell.row.original.isDownload == "1" ? false : true}
                          onClick={() => handleDownload(cell.row.original.refId, cell.row.original.nomor)} type="button"
                      >
                          <i className="fa fa-cloud-download" aria-hidden="true"></i>
                      </Button>
                  </div>
              )
          },
          {
            accessorKey: 'nomor', 
            header: 'Nomor',
            size: 200,
            enableColumnOrdering: true    // enable move column
            ,enableColumnDragging: true
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
            //   <div>
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.perihal}</span>
                //   {<input type = "text" className="form-control form-control-sm" onChange={(e)=>{getdataChange(e, cell)}} /> }
            //   </div>
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
            accessorKey: 'dirNotes',
            header: 'Notes Direktur',
            enableColumnOrdering: true,
            enableColumnDragging: true,
            Cell: ({cell}) => (
                (id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ) &&
                <div>
                    <input id="fnote" onBlur={event => addNotes(event.target.value, cell.row.original)} style={{ width: "200px" }}
                        autoComplete="off" type="text" className="form-control" placeholder="Note.." />
                </div>
            )
          },
          {
            accessorKey: 'ditujukan',
            header: 'Ditujukan',
            size:300,
            Cell: ({cell}) => (
          
              id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
                  cell.row.original.flowType
                  :
                  cell.row.original.bagian == "JKT" ? 
                  <MySelectJKT
                      {...{
                          onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, cell.row.original),
                          defaultValue: dataOpsiTujuanJKT.find(item => item.value === cell.row.original.flowType)
                      }}
                  /> 
                  :
                  <MySelectEST
                      {...{
                          onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, cell.row.original),
                          defaultValue: dataOpsiTujuanEST.find(item => item.value === cell.row.original.flowType)
                      }}
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
            accessorKey: 'statusByName',
            header: 'Send By',
            Cell: ({ cell }) => (
                <span style = {{whiteSpace:'normal'}}>
                    {cell.row.original.statusByName}
                    {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                </span>
            )
          },
          {
            accessorKey: 'statusTimeStr',
            header: 'Send Time'
          },
    ]

    // function LoadColumnsMemo(){
    //     columns = useMemo(
    //         () =>
    //           [
    //             {
    //               accessorKey: 'id',
    //               header: 'id',
    //               size: 40,
    //               enableHiding: false,  // disable column agar tidak tampil di tabel
    //             },
    //             {
    //                 accessorKey: 'detail',
    //                 header: 'Detail',
    //                 size:30,
    //                 enableColumnActions: false,
    //                 enableColumnOrdering: false,
    //                 Cell: ({cell}) => (
    //                     <div className="btn-group">
    //                        <Button variant="success"
    //                             style = {{height:'30px'}}
    //                             onClick={() => {handleShow(cell.row.original.nomor); }}
    //                         >
    //                             <i className="fa fa-info" aria-hidden="true"></i>
    //                         </Button>
    //                     </div>
    //                 )
    //             },
    //             {
    //                 accessorKey: 'doc',
    //                 header: 'Doc',
    //                 size: 30,
    //                 enableColumnActions: false,
    //                 enableColumnOrdering: false,
    //                 Cell: ({cell}) => (
    //                     <div className="btn-group">
    //                         <Button
    //                             style = {{height:'30px', display:'flex',justifyContent:'center',alignItems:'center'}}
    //                             variant={cell.row.original.isDownload == "1" ? "success" : "danger"} 
    //                             disabled={cell.row.original.isDownload == "1" ? false : true}
    //                             onClick={() => handleDownload(cell.row.original.refId, cell.row.original.nomor)} type="button"
    //                         >
    //                             <i className="fa fa-cloud-download" aria-hidden="true"></i>
    //                         </Button>
    //                     </div>
    //                 )
    //             },
    //             {
    //               accessorKey: 'nomor', 
    //               header: 'Nomor',
    //               enableColumnOrdering: true    // enable move column
    //               ,enableColumnDragging: true
    //             },
    //             {
    //               accessorKey: 'pt',
    //               header: 'PT',
    //               enableColumnOrdering: true
    //               ,enableColumnDragging: true,
    //               size:20
    //             //   Cell: ({cell})=>new Date(cell.getValue<Date>()).getDate() + " " + new Date(cell.getValue<Date>()).getMonth() + " " + new Date(cell.getValue<Date>()).getFullYear()
    //             },
    //             {
    //               accessorKey: 'perihal',
    //               header: 'Perihal',
    //               enableColumnOrdering: true,
    //               enableColumnDragging: true
    //             //   Cell: ({cell})=>(  // contoh input-an di dalam cell
    //             //     <div>
    //             //         <input type = "text" className="form-control form-control-sm" onChange={(e)=>{getdataChange(e, cell)}} />
    //             //     </div>
    //             //   )
    //             },
    //             {
    //               accessorKey: 'nilaiPermintaan',
    //               header: 'Nilai Permintaan',
    //               enableColumnOrdering: true,
    //               enableColumnDragging: true,
    //                 Cell: ({ cell }) => (
    //                     <div style={{ textAlign: 'right' }}>
    //                         {
    //                             cell.getValue<Number>() ?
    //                                 `Rp ${formatPrice(cell.getValue<number>())}`
    //                             : ''
    //                         }
    //                     </div>
    //                 ),
    //             },
    //             {
    //               accessorKey: 'lastNotes',
    //               header: 'Last Notes',
    //               enableColumnOrdering: true
    //               ,enableColumnDragging: true,
                
    //             },
    //             {
    //               accessorKey: 'ditujukan',
    //               header: 'Ditujukan',
    //               Cell: ({cell}) => (
    
    //                 // <Select
    //                 //     // className="basic-single react-select-width"
    //                 //     // classNamePrefix="select"
    //                 //     tabSelectsValue={true}
    //                 //     isDisabled={false}
    //                 //     isClearable={false}
    //                 //     isSearchable={true}
    //                 //     menuPortalTarget={document.body}
    //                 //     // styles={{
    //                 //     //     // Fixes the overlapping problem of the component
    //                 //     //     menu: provided => ({ ...provided, zIndex: 9999 })
    //                 //     // }}
    //                 //     maxMenuHeight={200}
    //                 //     // options={[{value:'good',label:'Good'}]}
    //                 //     options={setDataOpsiTujuanJKT}
    //                 //     />
    
    //                 <MySelectJKT
    //                         {...{
    //                             onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, cell.row.original),
    //                             defaultValue: dataOpsiTujuanJKT.find(item => item.value === cell.row.original.flowType)
    //                         }}
    //                     />
                
    //                 // id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
    //                 //     cell.row.original.flowType
    //                 //     :
    //                 //     cell.row.original.bagian == "JKT" ? 
    //                 //     <MySelectJKT
    //                 //         {...{
    //                 //             onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, cell.row.original),
    //                 //             defaultValue: dataOpsiTujuanJKT.find(item => item.value === cell.row.original.flowType)
    //                 //         }}
    //                 //     /> 
    //                 //     :
    //                 //     <span>halo</span>
    //                 //     // <MySelectEST
    //                 //     //     {...{
    //                 //     //         onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, cell.row.original),
    //                 //     //         defaultValue: dataOpsiTujuanEST.find(item => item.value === cell.row.original.flowType)
    //                 //     //     }}
    //                 //     // />
    //               )
    //             },
    //             {
    //               accessorKey: 'requestByName',
    //               header: 'Request By'
    //             },
    //             {
    //                 accessorKey: 'requestTimeStr',
    //                 // accessorFn for sorting and filtering
    //                 // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
    //                 id: 'requestTimeStr',
    //                 header: 'Request Time',
    //                 Cell: ({ cell }) => (
    //                         <span>
    //                             {cell.getValue<string>()}
    //                             {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
    //                         </span>
    //                 )
    //             },
    //             {
    //               accessorKey: 'statusByName',
    //               header: 'Send By'
    //             },
    //             {
    //               accessorKey: 'statusTimeStr',
    //               header: 'Send Time'
    //             },
    //           ] as MRT_ColumnDef<ISPDKirimTerimaList>[],
    //         [],
    //       );
    // }


    useEffect(() => {

        // LoadColumnsMemo()
        // var docKeyString = "";
        // var stateDocList: ISPDKirimTerimaList[] = [];

        // function handleKeyPress(event: { keyCode: any; which: any; }) {
        //     docKeyString += String.fromCharCode(event.which)

        //     if (event.keyCode === 13) {
        //         stateDocList.push(dataSPDTerima?.spdKirimTerimaList.find(x => x.dokKey === docKeyString)! )

        //         selectDoc(stateDocList, docKeyString, "pressed");
        //         docKeyString = "";
        //     }
        // }

        // window.addEventListener('keypress', handleKeyPress);

        // refresh data setelah transaksi

        loadData();
        // loadDataNew();
        loadjs('custom.js');
        
        return () => {
            removeCustomjs('custom.js');
        }

    }, []);

    // function loadDataNew() {
    //     setLoader(true);
    
    //     const OPList = getDataOP(id_ms_login).then(function (response) {
    //         setData(response.result);
    //         setTimeout(() => {
    //             setLoader(false);
    //         }, 1000);  
    //     })
    // }

    const getdataChange = (e,cell) => {
        console.log(e.target.value)
        // console.log(cell.column.id)
        // console.log(cell.row.original.id)
        // console.log(cell)
    }

    


    // function loadjs() {

    //     const timer = setTimeout(() => {
    //         const script = document.createElement("script");
    //         script.src = "js/custom.js";
    //         script.async = true;
    //         document.body.appendChild(script);
    //     }, 300);
    //     return () => {
    //         // window.removeEventListener("keypress", handleKeyPress);
    //         clearTimeout(timer);
    //     }
    // }

    // Load data list BKU dan Akun
    function loadData() {
        setLoader(true)

        const SPDKirimList = getDataSPDTerima(id_ms_login).then(responseSPDTerima => { // id_ms_login_link == null ? id_ms_login : id_ms_login_link

            setDataSPDTerima(responseSPDTerima.result);
            
            let getDataSPDTerima_Map:any[] = [];
        

            if (responseSPDTerima.result?.['spdKirimTerimaList'] != null &&
                    Array.isArray(responseSPDTerima.result?.['spdKirimTerimaList'])){
                

                getDataSPDTerima_Map = responseSPDTerima.result?.['spdKirimTerimaList'].map((obj, idx)=>{
                            return {
                                ...obj,
                                requestTimeFormatDate: formatDate(new Date(new Date(obj?.['requestTime']).setHours(0,0,0)),'yyyy/mm/dd')
                            }
                })
                console.log(getDataSPDTerima_Map)

            }

            
            // setData(responseSPDTerima.result?.['spdKirimTerimaList'])
            setData(getDataSPDTerima_Map)
            setLoader(false)
            // loadjs();
        })

        const TujuanEST = getDataOpsiTujuanEST("EST").then(function (responseOpsiTujuan) {
            setDataOpsiTujuanEST(responseOpsiTujuan.result);
        })
        
        const TujuanJKT = getDataOpsiTujuanJKT("JKT").then(function (responseOpsiTujuan) {
            setDataOpsiTujuanJKT(responseOpsiTujuan.result);  
        })

    }


    function handleChangeOpsiTujuan(selectedOptions: any, dokumenSpd: any) {

        // handle ketika option di select
        const selectedValue = selectedOptions === null ? '' : selectedOptions.value
        dokumenSpd.flowType = selectedValue
        console.log(dokumenSpd)

        // let param = {
        //     ditujukanStr: selectedValue,
        //     ID: dokumenSpd.id,
        //     Nomor: dokumenSpd.nomor
        // };

        // console.log(param)

        // const updateDitujukanSPD = updateDitujukan(param).then(function (response) {

        //     if (response?.statusCode === 200 && response?.result == 200) {
        //         swal("Berhasil ubah ditujukan!", "", "success");
        //         loadData();

        //     } else {
        //         swal("Gagal ubah!", "", "error");
        //     }
        // });
    }

    function addNotes(strNotes: string, dokumenSpd: any) {
        if (id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587) {
            dokumenSpd.dirNotes = strNotes
        }else{
            dokumenSpd.newNotes = strNotes
        }
        
    }


    // Show modal BKU detail
    function handleShow(nomor: string) {

        // Dijadikan seperti ini supaya pakai method GET
        nomor = nomor.replaceAll("/", "%2F");
        const dirNotes = getDirNotes(nomor).then(function (response) {
            setModalData(response.result);
        });

        setShow(true);

    }



    // Terima SPD
    function handleTerima() {

        // let param = {
        //     id_ms_login: id_ms_login,
        //     dokumenKirimTerima: stateDoc
        // };

        // console.log(param)

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan diterima", "", "warning");
        } else {
            if (dataSPDTerima?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDTerima?.dataKaryawan.iD_Ms_Jabatan == 3 ||
                dataSPDTerima?.dataKaryawan.iD_Ms_Divisi == 16 || dataSPDTerima?.dataKaryawan.iD_Ms_Divisi == 26) {

                var nomorDitujukan = "";
                stateDoc.forEach(element => {
                    if (element.flowType == "" || element.flowType == null) {
                        nomorDitujukan += element.nomor + "\n";
                    }
                });

                if (nomorDitujukan.length != 0) {
                    swal("Pilihan ditujukan harus diisi", "Nomor : \n" + nomorDitujukan, "info");
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

                    const terimaDokumenSPD = terimaDocSpd(param).then(function (response) {
                        var aaa = response.statusCode;
                        if (response?.statusCode === 200 && response?.result == 200) {
                            swal("Berhasil terima dokumen!", "Nomor : \n" + messageSuccess, "success")
                                .then((value) => {
                                    window.location.reload();
                                });
                            loadData();

                        } else if (response?.statusCode === 200 && response?.result != "") {
                            swal("Gagal terima dokumen!", response?.result, "error");
                        } else {
                            swal("Gagal approve!", "", "error");
                        }
                    });
                }

            }
            else {
                swal("SPD hanya bisa diterima oleh Manager / Direktur!", "", "info");
            }

        }
    }


    // Handle tolak
    function handleTolak() {

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan ditolak", "", "warning");
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


    // Download dokumen SPD
    function handleDownload(id_fn_spd: number, filename: any) {

        const token = window.localStorage.getItem('token');
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = `http://192.168.1.121:9009/api/ApprovalSPD/downloadspdscn/${id_fn_spd}/${id_ms_login}`; //https://192.168.1.121:9009/

        let headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);

        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                let objectUrl = window.URL.createObjectURL(blobby);

                anchor.href = objectUrl;
                anchor.download = filename;
                anchor.click();

                window.URL.revokeObjectURL(objectUrl);
            });
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

    function handleClickShowChecked(status){

        // status antara checked or all (status di sini adalah posisi button setelah diklik)
        // misal posisi sekarang checked, maka button 'all' yang selanjutnya tampil
        // sebaliknya posisi sekarang all, maka button 'checked' yang selanjutnya tampil
        // expanded dari 'accordion'
        if (expanded){
            if (status == 'checked' || status == 'all'){

                removeCustomjs('custom.js')
                loadjs('custom.js')
            }

            // waktu tombol posisi sekarang "checked" di klik (posisi nya akan ke "all")
            // if (status == 'all'){
                // checked
                // var checkClick = document.getElementById("showCheckedRowButton");
                // checkClick?.click()
            // }
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

    return (
        <>
            <div>
                {/* <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Terima SPD</h2>
                    </div>
                </div> */}

                {/* <div className="wrapper wrapper-content animated fadeInRight"> */}
                    {/* <div className="row border-bottom white-bg dashboard-header"> */}
                        
                        {/* <div className="col-lg-12"> */}
                            <div style={{width:'100%', marginBottom:'50px'}}>
                                
                            {/* <MySelectJKT
                                    {...{
                                        onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, cell.row.original),
                                        defaultValue: dataOpsiTujuanJKT.find(item => item.value === cell.row.original.flowType)
                                    }}
                                />  */}
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
                                        // pagination:{pageSize:10, pageIndex: 1}, // setting page index dan size di awal
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
                                            'dirNotes',
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
                                    // renderRowActions={({ row, table }) => (
                                    //     <Box>
                                    //         <Button onClick={()=>{alert(row.original.nomor)}}>
                                                
                                    //         </Button>
                                    //     </Box>

                                        // <MenuItem key="edit" onClick={() => console.info('Edit')}>
                                        // Edit
                                        // </MenuItem>,
                                        // <MenuItem key="delete" onClick={() => console.info('Delete')}>
                                        // Delete
                                        // </MenuItem>,
                                    // )}
                                    // renderRowActions={({row}) => {
                                    //     <Box sx={{
                                    //             display: 'flex',
                                    //             alignItems: 'center',
                                    //             gap: '1rem'
                                    //     }}>
                                    //         <IconButton color = "primary"
                                    //                 onClick={()=>{alert("good")}}>
                                    //             <EmailOutlined />
                                    //         </IconButton>
                                    //         {/* <Button color="success" 
                                    //                 size="sm" 
                                    //             onClick={()=> {}}>
                                    //             <i className="fa fa-info" aria-hidden="true"></i>
                                    //         </Button> */}
                                    //     </Box>
                                    // }}
                                    renderTopToolbarCustomActions={({ table }) => {
                                        const handleActivate = () => {
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
                                                title: "Terima SPD",
                                                text: "Apakah Anda Yakin Terima SPD dengan Nomor" + messageSuccess,
                                                icon: "warning",
                                                buttons: [
                                                'Kembali!',
                                                'Terima!'
                                                ],
                                                dangerMode: true
                                            })
                                            .then(function(isConfirm) {
                                                if (isConfirm) {
                                
                                                    const terimaDokumenSPD = terimaDocSpd(param).then(function (response) {
                                                        var aaa = response.statusCode;
                                                        if (response?.statusCode === 200 && response?.result == 200) {
                                                            swal("Berhasil terima dokumen!", "Nomor : \n" + messageSuccess, "success")
                                                                .then((value) => {
                                                                    window.location.reload();
                                                                });
                                                            loadData();
                                
                                                        } else if (response?.statusCode === 200 && response?.result != "") {
                                                            swal("Gagal terima dokumen!", response?.result, "error");
                                                        } else {
                                                            swal("Gagal approve!", "", "error");
                                                        }
                                                    });
                                                }
                                            })
                                            }
                                            else
                                            {
                                                swal("Mohon pilih OP yang akan di approve", "", "warning");
                                            }
                                        }

                                        const handleShow = () => {
                                            setLoader(true); setLoadingShow(true);
                            
                                            var promise = new Promise(function(resolve, reject) {
                                                var show = document.getElementsByClassName('MuiTableRow-root MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
                                                for (var i = 0; i < show.length; i += 1) 
                                                {
                                                show[i].style.visibility = 'visible';
                                                } resolve(true);
                                            })
                                
                                            promise.then(bool => setTimeout(function() {
                                                setLoader(false);setLoadingShow(false);
                                                setShowAllCheckStatus('check')
                                            }, 1000))
                                        };

                                        const handleHide = () => {
                                            setLoader(true);setLoadingHide(true);
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
                                                setLoader(false);setLoadingHide(false);
                                                setShowAllCheckStatus('all')
                                            }, 100))
                                        };

                                        return (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <LoadingButton
                                                    color="success"
                                                    onClick={() => handleActivate()}
                                                    loading={loadingApprove}
                                                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                                                    startIcon={<CheckCircle />}
                                                    variant="contained"
                                                    loadingIndicator="Loading…"
                                                >
                                                    Terima
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
                                                            loading={loadingHide}
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
                        {/* </div> */}

                        <div 
                            // className="col-lg-12"
                        >

                            {/* <Accordion defaultExpanded={expanded} 
                                        TransitionProps={{ unmountOnExit: true }}
                                        onChange={handleChangeAccordion('panel1')}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <h5>Terima SPD List</h5>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <div>
                                        {id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
                                            <div 
                                                className="d-flex justify-content-start"
                                                style = {{gap:'5px'}}
                                            >
                                                <div 
                                                >
                                                    <Button variant="primary" onClick={() => handleTerima()}><i className="fa fa-check" aria-hidden="true"></i> Terima</Button>
                                                </div>

                                                <br />
                                                <br />

                                                <div 
                                                >
                                                    <Button variant="danger" onClick={() => handleTolak()}>
                                                        <i className="fa fa-times" aria-hidden="false">
                                                            </i> Tolak
                                                    </Button>
                                                </div>


                                                <br />
                                                <br />

                                                <div>
                                                    {showAllOrChecked == 'checked' && 
                                                        <Button variant="secondary" 
                                                                id="showCheckedRowButton-custom"
                                                                onClick={()=>handleClickShowChecked('all')}>
                                                                Show Checked Row Only
                                                        </Button>
                                                    }

                                                    {showAllOrChecked == 'all' && 
                                                        <Button variant="secondary" id="showAll-custom" 
                                                                // style={{ display: "none" }}
                                                                onClick={()=>handleClickShowChecked('checked')}>
                                                            Show All Row
                                                        </Button>
                                                    }   
                                                    <Button id="sortButton" style={{ display: "none" }}>Sort</Button>
                                                </div>
                                            </div>

                                            :

                                            <div 
                                                className="d-flex justify-content-start"
                                                style = {{gap:'5px'}}>
                                                <div 
                                                >
                                                    <Button variant="primary" onClick={() => handleTerima()}><i className="fa fa-check" aria-hidden="true"></i> Terima</Button>
                                                </div>

                                                <br />
                                                <br />

                                                <div 
                                                >
                                                    {showAllOrChecked == 'checked' && 
                                                        <Button variant="secondary" id="showCheckedRowButton-custom"
                                                            onClick={()=>handleClickShowChecked('all')}>Show Checked Row Only</Button>
                                                    }
                                                    {showAllOrChecked == 'all' && 
                                                        <Button variant="secondary" id="showAll-custom" 
                                                                    onClick={()=>handleClickShowChecked('checked')}>Show All Row</Button>
                                                    }
                                                    <Button id="sortButton" style={{ display: "none" }}>Sort</Button>
                                                </div>
                                            </div>

                                        }

                                        <hr />

                                        <div className="table-responsive">

                                            <div>
                                                <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                    className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />

                                                <h3>Selected row: {distictCount()}</h3>

                                                <br /><br /><br />
                                                <table id="mytableSort" className="table table-striped table-hover css-serial filterclass">
                                                    <thead>
                                                        <tr className="showChecked">
                                                            untuk Generate Nomor Urut .css-serial td:first-child:before ("public/css/style")
                                                            <th className="bg-primary">#</th>
                                                            {
                                                                (id_ms_login != 2 && id_ms_login != 3 && id_ms_login != 4 && id_ms_login != 1587) &&
                                                                    <th className="text-right bg-primary">Detail</th>
                                                            }

                                                            <th className="bg-primary">Doc</th>
                                                            <th className="bg-primary">Select</th>
                                                            <th className="bg-primary">Nomor</th>
                                                            <th className="bg-primary">PT</th>
                                                            <th className="bg-primary">Perihal</th>
                                                            <th className="bg-primary">Nilai Permintaan</th>
                                                            <th className="bg-primary">Last Notes</th>

                                                            {
                                                                (id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587) &&
                                                                    <th className="bg-primary">Notes Direktur</th>
                                                            }

                                                            <th className="bg-primary">Ditujukan</th>
                                                            <th className="bg-primary">Request By</th>
                                                            <th className="bg-primary">Request Time</th>
                                                            <th className="bg-primary">Sent by</th>
                                                            <th className="bg-primary">Sent Time</th>

                                                        </tr>
                                                    </thead>

                                                    <tbody id="myTable">
                                                        {dataSPDTerima?.spdKirimTerimaList.map(data => (

                                                            <tr key = {data.dokKey} className={stateDocKey.includes(data.dokKey) ? "showChecked" : ""} 
                                                                style={{ backgroundColor: stateDocKey.includes(data.dokKey) ? "#FFCF8B" : "" ,
                                                                        display: showAllOrChecked == 'all' ? stateDocKey.includes(data.dokKey) ? 'table-row': 'none' : ''
                                                                        }}>
                                                                <td></td>

                                                                {
                                                                    (id_ms_login != 2 && id_ms_login != 3 && id_ms_login != 4 && id_ms_login != 1587) &&
                                                                        <td className="text-right">
                                                                            <div className="btn-group">
                                                                                <Button variant="success"
                                                                                    onClick={() => handleShow(data.nomor)}
                                                                                >
                                                                                    <i className="fa fa-info" aria-hidden="true"></i>
                                                                                </Button>
                                                                            </div>
                                                                        </td>
                                                                }

                                                                <td>
                                                                    <div className="btn-group">
                                                                        <Button
                                                                            variant={data.isDownload == "1" ? "success" : "danger"} disabled={data.isDownload == "1" ? false : true}
                                                                            onClick={() => handleDownload(data.refId, data.nomor)} type="button"
                                                                        >
                                                                            <i className="fa fa-cloud-download" aria-hidden="true"></i>
                                                                        </Button>
                                                                    </div>

                                                                </td>
                                                                <td className="text-center" key={data.dokKey}>
                                                                    <label className="checkboxcontainer">
                                                                        <input
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
                                                                <td style = {{minWidth: data.perihal != null ? '300px' : ''}}>{data.perihal}</td>

                                                                <td style = {{
                                                                                width: (data.mataUang && " " && data.nilaiPermintaan) != null ? 'auto' : '',
                                                                                whiteSpace: (data.mataUang && " " && formatPrice(data.nilaiPermintaan)) != null ? 'nowrap' : undefined
                                                                            }}>
                                                                            {data.mataUang} {formatPrice(data.nilaiPermintaan)}
                                                                </td>

                                                                <td>{data.lastNotes}</td>

                                                                {
                                                                    (id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ) &&
                                                                        <td>
                                                                            <input id="fnote" onBlur={event => addNotes(event.target.value, data)} style={{ width: "200px" }}
                                                                                autoComplete="off" type="text" className="form-control" placeholder="Note.." />
                                                                        </td>
                                                                }

                                                                <td>
                                                                    {id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
                                                                        data.flowType
                                                                        :

                                                                        data.bagian == "JKT" ? 
                                                                        <MySelectJKT
                                                                            {...{
                                                                                onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, data),
                                                                                defaultValue: dataOpsiTujuanJKT.find(item => item.value === data.flowType)
                                                                            }}
                                                                        /> 
                                                                        : 
                                                                        <MySelectEST
                                                                            {...{
                                                                                onChange: selectedOptions => handleChangeOpsiTujuan(selectedOptions, data),
                                                                                defaultValue: dataOpsiTujuanEST.find(item => item.value === data.flowType)
                                                                            }}
                                                                        />
                                                                        
                                                                    }
                                                                </td>

                                                                <td>{data.requestByName}</td>
                                                                <td>{data.requestTimeStr}</td>
                                                                <td>{data.statusByName}</td>
                                                                <td>{data.statusTimeStr}</td>

                                                            </tr>
                                                        ))}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>

                                    </div>
                                </AccordionDetails>
                            </Accordion> */}

                            {/* <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Terima SPD List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">
            
                                </div>

                                <div className="ibox-content">
                                    
                                </div>

                            </div> */}
                        </div>
                    {/* </div> */}
                {/* </div> */}
            </div>


            <Modal centered show={show} size="xl" fullscreen="xl-down" onHide={handleClose} keyboard={false} scrollable={true}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title> Note </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="container">
                        <table className="table table-striped table-bordered table-hover css-serial" >
                            <thead>
                                <tr>
                                    <th className="bg-primary">#</th>
                                    <th className="bg-primary">Flag</th>
                                    <th className="bg-primary">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalData?.map((bkudetail, idx) => (
                                    <tr key = {idx} className="gradeX">
                                        <td></td>
                                        <td>{bkudetail.flag}</td>
                                        <td>{bkudetail.notes}</td>

                                    </tr>
                                ))}


                            </tbody>
                        </table>

                    </div>


                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>


        </>
    );
};

export default {
    routeProps: {
        path: '/finance/approval/terimadokumenspd',
        exact: true,
        component: TerimaSPD
    },
    name: 'TerimaSPD',
};