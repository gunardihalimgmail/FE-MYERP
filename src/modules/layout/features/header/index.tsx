import React, { useState } from 'react'
import './header.scss'
import HamburgerMenu from '../hamburgerMenu'

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
                {'Home > Good'}
            </div>
        </>
    )
}

export default HeaderMain