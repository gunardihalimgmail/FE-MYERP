// MyERP
import React from 'react'
import './main.scss'
import HeaderMain from '../../../layout/features/header'
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar'
import { svgCustom } from '../../../../utils/svgcustom'

const MainPage = () => {
  return (
    <>
      <div className='main-page-wrapper'>

          <div className='sub-wrapper'>

            <div className='side-left'>
                <div>
                    <Sidebar
                      className='sidebarClasses'
                      backgroundColor='rgb(249,249,249,0.5)'
                      collapsed={false}
                    >
                        <Menu
                          menuItemStyles={{
                            button: ({ level, active, disabled }) => {
                              if (level === 0)
                              {
                                  return {
                                      // color: disabled ? '#f5d9ff' : '#d359ff',
                                      backgroundColor: active ? '#eecef9' : undefined,
                                      fontWeight: 600,
                                      paddingLeft:'25px',
                                      ['&:hover']:{
                                        backgroundColor:'rgb(197, 228, 255)',
                                        color:'rgb(68, 89, 110)',
                                        borderRadius:'0'
                                      },
                                      ['&.active']: {
                                        backgroundColor: '#13395e',
                                        color: '#b6c8d9',
                                      },
                                      // ketika menu item level 0 lagi open
                                      ['&.ps-open']:{
                                        fontWeight: 'bold' 
                                      }
                                  }
                              }
                              else
                              {
                                return {
                                  ['&']:{
                                    backgroundColor:'rgba(249, 249, 249, 0.5)',  // background menu item
                                    paddingLeft:'50px',
                                  },
                                  ['&:hover']:{
                                    backgroundColor:'rgb(197, 228, 255)',
                                    color:'rgb(68, 89, 110)',
                                    borderRadius:'0'
                                  },
                                  [`&.active`]: {
                                    backgroundColor: '#13395e',
                                    color: '#b6c8d9',
                                  }
                                }
                              }
                            },
                                // button:{
                                  
                                //   // when hover menu item
                                //   ['&:hover']:{
                                //     backgroundColor:'rgb(197, 228, 255)',
                                //     color:'rgb(68, 89, 110)'
                                //   },
                                //   // the active class will be added automatically by react router
                                // // so we can use it to style the active menu item
                                // [`&.active`]: {
                                //   backgroundColor: '#13395e',
                                //   color: '#b6c8d9',
                                // }
                              // }
                          }}
                        >
                          <div className='pre-title-submenu'>
                            <p>General</p>
                          </div>

                            <SubMenu label="Charts" defaultOpen={true} icon={svgCustom('searchengin', 'rgb(0, 152, 229)', 18)}>
                                <MenuItem>Pie Charts</MenuItem>
                                <MenuItem>Line Charts</MenuItem>
                            </SubMenu>
                            <MenuItem icon={svgCustom('rectangle-list', 'rgb(0, 152, 229)', 18)}>Dashboard</MenuItem>
                            <SubMenu label="Transaksi" defaultOpen ={true} icon={svgCustom('file-lines', 'rgb(0, 152, 229)', 18)}>
                                <MenuItem>Sales</MenuItem>
                                <MenuItem>Purchase</MenuItem>
                            </SubMenu>
                        </Menu>
                    </Sidebar>
                </div>
            </div>
            <div className='side-right'>
                <HeaderMain></HeaderMain>
                <div style = {{height:'300%', padding: '2rem'}}>body</div>
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