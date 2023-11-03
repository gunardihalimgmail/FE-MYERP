import React, { useEffect, useState } from 'react'
import './breadcrumb.scss'

const BreadCrumb = (props:any) => {
    const [path, setPath] = useState([""]);
    const [active, setActive] = useState(-1);

    // props.path => ["Home","Transaksi","Penjualan"]
    // props.idxActive => 0 / 1 / 2
    // props.lastActive => true / false (index terakhir)
    
    useEffect(()=>{
        if (typeof props?.['path'] != 'undefined' && props?.['path'] != null){
            setPath([...props?.['path']]);

            if (typeof props?.['lastActive'] != 'undefined' && props?.['lastActive'] != null &&
                    props?.['lastActive']){
                setActive(props?.['path'].length - 1)
            }
        }
        else{
            setPath([]);
        }

        // nilai index
        if (typeof props?.['idxActive'] != 'undefined' && props?.['idxActive'] != null){
            setActive(props?.['idxActive'])
        }
        
        // setPath(["Home","Transaksi","Penjualan"])
    }, [])


    return (
        <>
            <div className='breadcrumb'>
                {
                    path.length > 0 && (
                        path.map((val, index)=>{
                            return (
                                <a key = {val} onClick={()=>setActive(index)}
                                    className={`${index == active ? 'active':''}`}
                                >{val}</a>
                            )   
                        })
                    )
                }

                {
                    path.length > 0 && (
                        <a href = ""></a>
                    )
                }

            </div>
        </>
    )
}

export default BreadCrumb