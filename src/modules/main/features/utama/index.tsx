// MyERP
import React from 'react'
import './main.scss'
import HeaderMain from '../../../layout/features/header'

const MainPage = () => {
  return (
    <>
      <div className='main-page-wrapper'>
          <HeaderMain></HeaderMain>
          {/* <div>Halo</div>
          <div>Keep</div> */}
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