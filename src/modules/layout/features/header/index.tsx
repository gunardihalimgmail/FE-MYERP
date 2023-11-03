import React, { useState, useEffect } from 'react'
import './header.scss'
import HamburgerMenu from '../hamburgerMenu'
import BreadCrumb from '../breadcrumb'

const HeaderMain = (props:any) => {

    return (
        <>
            <nav className='header-nav'>
                <div className='blok-nav'>
                    <div className='label-menu'>

                        <HamburgerMenu />

                        <div className='text title'>Dashboard</div>
                    </div>
                </div>
            </nav>

            <div className='header-subnav'>
                <BreadCrumb 
                    path = {["Home", "Transaksi", "Penjualan"]}
                    lastActive = {true}
                    // idxActive = {2}
                />
            </div>
        </>
    )
}

export default HeaderMain