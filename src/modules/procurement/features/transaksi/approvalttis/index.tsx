import React, { useEffect, useContext, useMemo, useState } from 'react';

import MaterialReactTable, {
  MRT_ColumnDef,
} from 'material-react-table';
import { LoadingButton } from '@mui/lab';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import swal from "sweetalert";

import { IOutstandingTTIS, IResultDataListOsTTIS } from "../../../models/ApprovalTTISModel";
import { ProcurementRootStoreContext } from "../../../stores/ProcurementRootStore";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";

import ResponsiveModal from './ResponsiveModal';

const ApprovalTTIS = () => {
  const modulName = 'procurement';
  const formName = 'Approval TTIS';

  const procurementRootStore = useContext(ProcurementRootStoreContext);
  const { getOutstandingTTIS, approveMultipleTTIS } = procurementRootStore.approvalTTISStore;  
  const [data, setData] = React.useState<IOutstandingTTIS[]>([]);
  const [id, setId] = useState(0);

  const [modal, setModal] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingShow, setLoadingShow] = useState(false);
  const [loadingHide, setLoadingHide] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [reload, setReload] = useState(false);

  // Decrypt Login Data untuk get is_ms_login
  const id_ms_login: Number = getIdLogin();

  // Decrypt menu untuk get user akses
  const user_access: any = getUserAccess(modulName, formName);

  useEffect(() => {
      const loadData = new Promise(function(resolve, reject) {
        getOutstandingTTIS(id_ms_login).then(function (response) {        
          console.log(response)
          if (response?.statusCode === 200) {
            const ttis: IResultDataListOsTTIS  = {
              osTTISList:response.result
            }
            setData(ttis.osTTISList);
            resolve(true);
          } else {
            reject(false);
          }
        })
      })

      loadData.then((message) => {
        setTimeout(function() {
          setIsLoading(false);
          console.log('isLoading' );
        }, 500)
      }).catch((message) => { });

  }, []);

  useEffect(() => {
  }, [id, modal, isLoading, loadingShow, loadingHide])

  useEffect(() => {
    if(reload) {
      setIsLoading(true);
      const loadData = new Promise(function(resolve, reject) {
        getOutstandingTTIS(id_ms_login).then(function (response) {        
          console.log(response)
          if (response?.statusCode === 200) {
            const ttis: IResultDataListOsTTIS  = {
              osTTISList:response.result
            }
            setData(ttis.osTTISList);
            resolve(true);
          } else {
            reject(false);
          }
        })
      })

      loadData.then((message) => {
        setTimeout(function() {
          setReload(false);
          setIsLoading(false);
          console.log('isLoading' );
        }, 500)
      }).catch((message) => { });
    }    
  }, [reload])
  
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'id',
          header: 'id',
          size: 40,
        },
        {
          accessorKey: 'nomor_ttis', 
          header: 'Nomor',
          filterFn: 'contains'
        },
        {
          accessorKey: 'tanggal_ttis',
          header: 'Tanggal',
          filterFn: 'contains'
        },
        {
          accessorKey: 'mata_uang',
          header: 'Mata Uang',
          size: 40,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right' }}>
              {cell.getValue<string>()}
            </div>
          ),
          filterFn: 'contains'
        },
        {
          accessorKey: 'nilai_invoice',
          header: 'Nilai Invoice',
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right' }}>
              {cell.getValue<string>()}
            </div>
          ),
          filterFn: 'contains'
        },
        {
          accessorKey: 'ppn',
          header: 'PPN',
          Cell: ({ cell }) => (                
            <div style={{ textAlign: 'right' }}>
                {cell.getValue<string>()}
            </div>
          ),
          filterFn: 'contains'
        },
        {
          accessorKey: 'negosiator',
          header: 'Negosiator',
          filterFn: 'contains'
        },
        {
          accessorKey: 'invoice_supplier',
          header: 'Supplier',
          filterFn: 'contains'
        },
      ] as MRT_ColumnDef<IOutstandingTTIS>[],
    [],
  );
  
  // function loadData() {
  //   const OsTTISList = getOutstandingTTIS(id_ms_login).then(function (response) {   
  //       const ttis: IResultDataListOsTTIS  = {
  //           osTTISList:response.result
  //       }
  //       setData(ttis.osTTISList);
  //   })
  // }

  // const loadData = new Promise(function(resolve, reject) {
  //   getOutstandingTTIS(id_ms_login).then(function (response) {        
  //     console.log(response)
  //     if (response?.statusCode === 200) {
  //       const ttis: IResultDataListOsTTIS  = {
  //         osTTISList:response.result
  //       }
  //       setData(ttis.osTTISList);
  //       resolve(true);
  //     } else {
  //       reject(false);
  //     }
  //   })
  // })

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        filterFns={{
          customFn: (row, _columnIds, filterValue) => {
            console.info('customFn', row, _columnIds, filterValue);
            return row
              .getValue<string>('state')
              .toLowerCase()
              .startsWith(filterValue.toLowerCase());
          },
        }}
        enablePagination={false}
        initialState={{ density: 'compact', 
          columnVisibility: { id: false },
          showGlobalFilter: true,
        }}
        enableGlobalFilterChangeMode ={true}
        muiSearchTextFieldProps={{
          size:'small',
          variant: 'outlined',
          label: 'Search',
          placeholder: '',
          InputLabelProps: { shrink: true },
        }}
        enableColumnFilterChangeMode={true}
        enableColumnOrdering={true}
        enableSelectAll={false}
        enableRowSelection={true}
        enableFullScreenToggle={false}
        state={{ isLoading }}
        positionToolbarAlertBanner="top"
        enableRowActions={true}
        renderRowActions={({ row }) => (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem', }}
          >
            <Button color="success"
              onClick={() => {setModal(true);
              setId(row.original.id);}}
            >
              <i className="fa fa-info" aria-hidden="true"></i>
            </Button>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => {
          const handleActivate = () => {
            if(table.getSelectedRowModel().flatRows.length > 0)
            {
              var messageSuccess = "";
              const array: React.SetStateAction<string[]> = [];

              table.getSelectedRowModel().flatRows.map((row) => {
                messageSuccess +=  '\n' + row.getValue('nomor_ttis');
                array.push(row.original.id.toString());
              });

              swal({
                  title: "Approve TTIS",
                  text: "Apakah Anda Yakin Untuk Menyetujui TTIS dengan Nomor" + messageSuccess,
                  icon: "warning",
                  buttons: [
                  'Kembali!',
                  'Approve!'
                  ],
                  dangerMode: true,
              })
              .then(function(isConfirm) {
                  if (isConfirm) {
                      let param = {
                          id_ms_login: id_ms_login,
                          ttisID: array
                      };

                      const approveTTIS = approveMultipleTTIS(param).then(function (response) {
                          if (response?.statusCode === 200 && response?.result == 200) {
                            setReload(true);
                            swal("Berhasil Menyetujui TTIS!", "Nomor :" + messageSuccess, "success");
                            table.resetRowSelection();
                          } else if (response?.statusCode === 200 && response?.result != "") {
                            swal("Gagal Menyetujui TTIS!", response?.result, "error");
                          } else {
                            swal("Gagal Menyetujui!", "", "error");
                          }
                      });
                  }
              })
            }
            else
            {
              swal("Mohon pilih TTIS yang akan di approve", "", "warning");
            }
          }

          const handleShow = () => {
            setIsLoading(true); setLoadingShow(true);

            var promise = new Promise(function(resolve, reject) {
              var show = document.getElementsByClassName('MuiTableRow-root MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
              for (var i = 0; i < show.length; i += 1) 
              {
                show[i].style.visibility = 'visible';
              } resolve(true);
            })

            promise.then(bool => setTimeout(function() {
              setIsLoading(false);setLoadingShow(false);
            }, 1000))
          };

          const handleHide = () => {
            setIsLoading(true);setLoadingHide(true);
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
              setIsLoading(false);setLoadingHide(false);
            }, 1000))
            
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
                  Approve
                </LoadingButton>
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
            </div>
          );
        }}
      />
      <div>
        { modal && 
          <ResponsiveModal 
            id={id} 
            modal={modal} 
            setReload={setReload}
            setModal={setModal}
            >
          </ResponsiveModal> 
        }
     </div> 
    </>
  );
};

export default {
  routeProps: {
      path: '/procurement/transaksi/approvalttis',
      exact: true,
      component: ApprovalTTIS
  },
  name: 'ApprovalTTIS',
};
