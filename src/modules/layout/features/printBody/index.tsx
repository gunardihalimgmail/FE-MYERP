import React from 'react'
import './printBody.scss'

const PrintBody = () => {
  return (
    <>
        <div className='head-paper'>

            <div className='head-sub'>

                <div className='head-left'>
                    Hal 1
                </div>

                <div className='head-right'>
                    <div className='head-logo'></div>

                    <div className='head-subtitle'>
                        <div className='subtitle-1'>
                            <span>Best Agro</span>
                        </div>
                        <div className='subtitle-2'>
                            <span>International</span>
                        </div>
                    </div>

                    <div className='head-subtitle2'>
                        <div className='subtitle-1'>
                            <span>Group Oil Palm Plantation and Milling Industry</span>
                        </div>
                        {/* <div className='subtitle-2'>
                            <span>International</span>
                        </div> */}
                    </div>


                </div>

            </div>


        </div>
    </>
  )
}

export default PrintBody