// MyERP
import React, { useEffect } from 'react'
import './main.scss'
import HeaderMain from '../../../layout/features/header'
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar'
import { svgCustom } from '../../../../utils/svgcustom'
import SideMenu from '../../../layout/features/sideMenu'
import PrintBody from '../../../layout/features/printBody'

const MainPage = () => {

  useEffect(()=>{
    fetch('https://192.168.16.19:8100/tes_https',{
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then((response)=>response.json())
      // .then((actualData)=> alert(JSON.stringify(actualData)))
      .catch((error)=>{console.log('error')})
  },[])

  return (
    <>
      <div className='main-page-wrapper'>

          <div className='sub-wrapper'>

            <div className='side-left'>
                <SideMenu></SideMenu>
            </div>
            <div className='side-right'>
                <HeaderMain></HeaderMain>
                <div style = {{height:'300%', padding: '2rem'}}>
                    {/* Body Content */}
                    <PrintBody />
                </div>
            </div>

          </div>

      </div>
    </>
  )
}

export default {
    routeProps:{
        path: '/main',
        exact: true,
        component: MainPage
    },
    name:'Main'
}