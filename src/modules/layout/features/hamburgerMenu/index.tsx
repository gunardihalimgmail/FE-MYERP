import React, { useState } from 'react'
import './hamburgerMenu.scss'

const HamburgerMenu = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className={`hamburger-menu ${open ? 'active' : ''}`} onClick={()=>setOpen(!open)}
                    title={`${!open ? 'Show Menu':'Collapse Menu'}`}>
                <div className={`submenu ${open ? 'active':''}`}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </>
    )
}

export default HamburgerMenu