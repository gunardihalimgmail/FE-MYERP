import React, {useRef, useState, useEffect} from 'react'
import './printBody.scss'
import {useReactToPrint} from 'react-to-print'
import {jsPDF} from 'jspdf';
import 'jspdf-autotable'
import { UserOptions } from 'jspdf-autotable'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas';
import { table } from 'console';

interface jsPDFCustom extends jsPDF {
    autoTable: (options: UserOptions) => void;
}

// import 'pagedjs/dist/paged.polyfill'

const PrintBody = () => {

    const componentRef = useRef(null);
    const headerRef = useRef(null);
    const contentRef = useRef(null);

    const [pageNumber, setPageNumber] = useState(1);
    const handlePageChange = () => {
        setPageNumber((prevPageNumber)=>prevPageNumber + 1)
    }

    const footerRef = useRef<HTMLTableSectionElement | null>(null);
    // const footerRef = useRef(1);

    let pageCount = 1;
    
    
    // Check if in print preview mode
    // const inPrintPreview = () => {
    //     return window.matchMedia && window.matchMedia('print').matches;
    // };

    const updatePageNumbers = () => {
        // const pageCounters = footerRef.current?.querySelectorAll('[data-counter]');
        const pageCounters = document.querySelectorAll('[data-counter]');
        console.log(pageCounters)
        pageCounters.forEach((counter, index) => {
            counter.setAttribute('data-counter', `Page Counter : ${index + 1}`);
          });
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
        // onBeforePrint:() => {
        //     updatePageNumbers();
        // },
        // onAfterPrint:() => {
        //     // updatePageNumbers();
        // },
    })


    useEffect(()=>{
        // const pageCounters = document.querySelectorAll('[data-counter]');
        // pageCounters.forEach((counter, index) => {
        //     counter.setAttribute('data-counter', `Page Counter : ${index + 1}`);
        // });

        // const updatePageNumbers = () => {
        //     // const pageCounters = footerRef.current?.querySelectorAll('[data-counter]');
        //     const pageCounters = document.querySelectorAll('[data-counter]');
        //     alert('halo')
        //     pageCounters.forEach((counter, index) => {
        //         counter.setAttribute('data-counter', `Page Counter : ${index + 1}`);
        //       });
        //     // if (pageCounters)
        //     // {
        //     // }
        // };

        const mediaQueryList = window.matchMedia('print');
        const mediaQueryChangeHandler = (event) => {
            if (event.matches) {
              // Entering print mode
              updatePageNumbers();
            }
          };

        const beforePrintHandler = () => {
            pageCount = 1;
            updatePageNumbers();
        };
        const afterPrintHandler = () => {
            pageCount = 1;
            updatePageNumbers();
        };

        // mediaQueryList.addEventListener('change', mediaQueryChangeHandler);

        window.addEventListener('beforeprint', beforePrintHandler);
        window.addEventListener('afterprint', afterPrintHandler);

        // const mediaQueryChangeHandler = () => {
        //     if (inPrintPreview()) {
        //       pageCount++;
        //       updatePageNumbers();
        //     }
        // };

        // window.addEventListener('beforeprint', beforePrintHandler);
        // window.addEventListener('afterprint', afterPrintHandler);
        // window.addEventListener('mediaqueryresultchange', mediaQueryChangeHandler);

        return () => {
            window.removeEventListener('beforeprint', beforePrintHandler);
            window.removeEventListener('afterprint', afterPrintHandler);
            // mediaQueryList.removeEventListener('change', mediaQueryChangeHandler);

            // window.removeEventListener('beforeprint', beforePrintHandler);
            // window.removeEventListener('afterprint', afterPrintHandler);
            // window.removeEventListener('mediaqueryresultchange', mediaQueryChangeHandler);
        };
            



        // const mediaQueryList = window.matchMedia('print');
        // mediaQueryList.addListener((mql) => {
        //   if (mql.matches) {
        //     // User started print preview
        //     handleBeforePrint();
        //   }
        // });

        // return () => {
        //     mediaQueryList.removeListener(handleBeforePrint);
        //   };

    }, [])
  
    const generatePdf = async() => {
        const doc = new jsPDF();
        // const doc = new jsPDF() as jsPDFCustom;
        // doc.autoTable({html:'#content-to-pdf'})
        // doc.save('hasilini.pdf')
    
        
        // const tableElement = document.getElementById("content-to-pdf");
        const tableElement = contentRef.current;

        // if (tableElement){
        //     pdf.autoTable
        //     pdf.save("hasil.pdf")
        // }

        const headerIdElement = document.getElementById("header-id");
        // const haloIdElement = document.createElement("div");
        // haloIdElement.innerHTML = "<div> HANYA TES SAJA </div>"
        
        // const pdf = new jsPDF({orientation:'landscape', unit: 'cm', format:[21,14]});

    
        
        // if (tableElement)
        // {
            // pdf({
            //     startY: 1,
            //     html: tableElement,
            //     theme: 'plain',
            //     // styles: {overflow:'linebreak'}
            // })

        // }
        // pdf.save("from_autoTable.pdf")
    
        // if (componentRef.current){
        //     pdf.html(componentRef.current, {
        //         callback: (doc)=>{
        //             doc.save("from_jspdf.pdf")
        //         },
        //         // margin:[1,1,1,1]
        //     })
        // }


        // alert(doc.internal.pageSize.height)
        // ==valid 
        // alert(doc.getNumberOfPages())
        
        const pdfOptions = {
            // margin:1.6,
            margin: [11,1,3,1], 
            filename: 'from_html2pdf.pdf',
            image: {type: 'jpeg', quality: .9},
            html2canvas: {scale: 2.5},
            jsPDF: { 
                    orientation: 'portrait', unit: 'cm', format: 'legal'},
                    // orientation: 'landscape', unit: 'cm', format: [21,14]},
        }

        const headerref = headerRef.current;
        let data;
        if (headerref){
            const canvas = await html2canvas(headerref, {scale: 2.5});
            data = canvas.toDataURL('image/png');
        }

        html2pdf().from(tableElement).set(pdfOptions).toPdf().get('pdf').then(function(pdf){
            let totalPages = pdf.internal.getNumberOfPages();

            for (var i=1; i<=totalPages; i++)
            {
                pdf.setPage(i);
                // pdf.setFillColor(255, 0, 255);
                // pdf.rect(0, 0, pdf.internal.pageSize.width, 4, 'F')
                
                // Append individual elements to the container
                // headerContainer.appendChild(headerText);

                // const headerElement = pdf.internal.htmlElementToContainer(headerContainer);

                // pdf.internal.writeHTML(headerElement.outerHTML, i);

                // header.className = "report-header";
                // header.innerHTML = `
                //     <thead>
                //         <tr>
                //             <th>
                //                           
                //             </th>
                //         </tr>
                //     </thead>
                //     `

                // header.style.marginBottom = "10px";
                
                
                pdf.addImage(data, 'JPEG', .5, -1, pdf.internal.pageSize.getWidth()-.5, 12);

                pdf.setFontSize(8);
                pdf.setTextColor(0,0,0);
                pdf.text(`--- Halaman ${i} of ${totalPages} ---`,pdf.internal.pageSize.getWidth() / 2,
                        pdf.internal.pageSize.getHeight() - 1);
            }
            pdf.save("generated_pages.pdf");
        });
        // html2pdf(componentRef.current, pdfOptions).then((pdfData)=>{
        //     doc.addImage(pdfData, 'JPEG', 0,0, 21, 14);
        //     doc.save();
        // })  
        
        // doc.text("Halo, Welcome", 1, 1);
        // doc.save("generated.pdf")
    }

    return (
        <>
            {/* <ReactToPrint
                content={()=>componentRef}
                trigger={() => <button className='btn btn-sm btn-success mb-1'>Print</button>}
            /> */}
            <div className='button-print'>
                <button onClick={handlePrint} className='btn w-100 btn-outline btn-sm btn-success mb-1'>Print</button>
            </div>

            {/* <div ref={componentRef}>
                <table className="report-container">
                    <thead className="report-header">
                    <tr>
                        <th className="report-header-cell">
                            <div className="header-info">
                                header content....
                            </div>
                        </th>
                    </tr>
                    </thead>

                    <tfoot className="report-footer">
                    <tr>
                        <td className="report-footer-cell">
                            <div className="footer-info">
                                <div className={"page-footer"}>
                                    footer content.... Tes Halo
                                    
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tfoot>

                    <tbody className="report-content">
                    <tr>
                        <td className="report-content-cell">
                            <div className="main">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto odit deserunt similique fugiat maiores aut molestias et unde asperiores earum eum, reiciendis labore voluptate amet incidunt optio, laboriosam quas magni aperiam velit fuga animi, deleniti laborum magnam. Asperiores provident saepe tenetur sequi assumenda maiores veritatis autem corporis quidem voluptatem vero eveniet quas cum, dolores molestiae unde perspiciatis velit reprehenderit expedita maxime non iste suscipit in alias. Eos beatae at 
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div> */}
            
            {/* best agro */}
            <button onClick={generatePdf} className='btn w-100 btn-outline btn-danger mb-3'>Generate PDF</button> 

            <div ref={componentRef} className = "head-main" >
                <div id="header-id" ref={headerRef} style = {{visibility:'visible', width:'100%'}}>

                    <div className='head-paper'>
                        <div className='head-subpaper'>
                            <div className='head-sub'>

                                <div className='head-left'>
                                    <div className='head-subtitle'>
                                        RATEL
                                    </div>
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
                                    </div>


                                </div>

                            </div>
                            <div className='head-sub-perihal'>

                                <table className='tabel-head-sub-perihal'>
                                    <tbody>
                                        <tr>
                                            <td className='tabel-col-1'>Kepada</td>
                                            <td>:</td>
                                            <td className='tabel-col-3'>GM, KTU, Manager Verifikasi, Asisten VIP, Asisten Verifikasi</td>
                                        </tr>
                                        <tr>
                                            <td className='tabel-col-1'>Dari</td>
                                            <td>:</td>
                                            <td className='tabel-col-3'>TIS Departement</td>
                                        </tr>
                                        <tr>
                                            <td className='tabel-col-1'>Perihal</td>
                                            <td>:</td>
                                            <td className='tabel-col-3'>Aplikasi E-Sensus</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                            <div className='head-equals'>
                                <div className='equals-1'></div>
                                <div className='equals-2'></div>
                            </div>

                        </div>
                    </div>
                </div>


                <div className='head-paper-content' 
                        id = "content-to-pdf"
                        ref={contentRef}
                >

                    <div className='head-subpaper'>
                        <table className='report-container'> 

                            {/* <thead className='report-header'>
                                <tr>
                                    <th>
                                        <div className='head-sub'>

                                            <div className='head-left'>
                                                <div className='head-subtitle'>
                                                    RATEL
                                                </div>
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
                                                </div>


                                            </div>

                                        </div>
                                        <div className='head-sub-perihal'>

                                            <table className='tabel-head-sub-perihal'>
                                                <tbody>
                                                    <tr>
                                                        <td className='tabel-col-1'>Kepada</td>
                                                        <td>:</td>
                                                        <td className='tabel-col-3'>GM, KTU, Manager Verifikasi, Asisten VIP, Asisten Verifikasi</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='tabel-col-1'>Dari</td>
                                                        <td>:</td>
                                                        <td className='tabel-col-3'>TIS Departement</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='tabel-col-1'>Perihal</td>
                                                        <td>:</td>
                                                        <td className='tabel-col-3'>Aplikasi E-Sensus</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                        <div className='head-equals'>
                                            <div className='equals-1'></div>
                                            <div className='equals-2'></div>
                                        </div>
                                            
                                    </th>
                                </tr>
                            </thead> */}

                            <tbody>
                                <tr>
                                    <td>
                                        <div>
                                            <div className='content-body'
                                                // style={{color:'#000', textAlign:'justify'}}
                                                >
                                                <p className='content-p'>
                                                    Dengan hormat,
                                                    <br /><br />
                                                    <span className='main-content-text'>
                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut esse illum dolores officiis expedita suscipit delectus ab illo velit atque excepturi minima, deleniti amet! Libero vero omnis unde inventore odit? Aperiam earum eaque blanditiis suscipit veniam amet porro aut et, culpa id aliquam libero fugiat mollitia adipisci laboriosam dignissimos ab modi omnis iure sunt quaerat ex. Qui ab earum maxime sed quaerat omnis. Provident nisi sapiente qui sed delectus minima dicta illum accusantium officia. Saepe, quia. Pariatur, quo eveniet ipsum laborum delectus molestiae velit sint in voluptate officia deserunt minus eaque voluptatibus? Saepe ratione adipisci vitae aliquid voluptatem praesentium alias consequatur quos illo consequuntur. Consectetur obcaecati vero inventore at corrupti perspiciatis temporibus, quam mollitia incidunt deserunt accusamus quidem? Enim, ab beatae excepturi, impedit nihil cumque aliquam a accusamus architecto facilis totam, id earum. Ex, architecto eius? In sed nisi, blanditiis perferendis voluptatum quod asperiores sit laborum suscipit rerum consectetur tempore neque non maxime, rem accusantium itaque reprehenderit eaque molestias culpa earum veritatis, tenetur et quam? Voluptates labore, officiis quis sunt, soluta quia asperiores eum quas exercitationem a, voluptas placeat commodi pariatur amet. Neque, ea quae veniam illum natus eos facere exercitationem blanditiis eius dolor assumenda vero nostrum sint adipisci ex debitis, nihil atque recusandae itaque dolorum. Odit eius eaque iure molestias maxime eos corrupti animi fuga, quod vel placeat commodi deleniti dolorem accusamus ratione reprehenderit nemo. Sit iusto atque, quisquam porro mollitia excepturi nulla deserunt, voluptatem illum saepe odit tempore sunt. In illum ipsa nulla sint officia rerum debitis eligendi dicta architecto perspiciatis eos cum et exercitationem magnam ad odit nemo perferendis dignissimos cupiditate, animi voluptates placeat quos? Consectetur ex porro sint eius totam quis, officiis impedit accusamus ad, dolore nulla vel itaque cum ipsam adipisci minus suscipit nihil iste beatae neque, fugiat unde pariatur! Amet explicabo ipsa quos rem molestiae consectetur soluta architecto numquam nemo odit corporis quae ipsum, mollitia quaerat cupiditate labore voluptatem facere. Modi hic, similique cumque libero dolores rerum nesciunt? Quisquam magni natus, itaque debitis possimus quo neque alias adipisci autem doloribus officia ipsam consequuntur minima nostrum! Incidunt vero non nemo iusto hic dolorum reprehenderit illum quaerat accusamus accusantium, aut porro id tempore, obcaecati officiis consequuntur ad numquam minima quo culpa odit quisquam voluptatibus! Soluta minima autem, repellendus nihil placeat omnis sed voluptatibus sequi. Deleniti, illum ab ad sed, placeat quidem nisi, libero soluta distinctio enim accusamus fugit. Animi asperiores incidunt fugit magnam voluptas! Aut nostrum quia nulla, quasi repellendus minima eveniet, sed alias totam sit dolor praesentium reprehenderit autem laudantium similique deleniti consequuntur a nisi earum, sint animi natus. Laboriosam, provident natus dolorem illum, sint cumque quos quibusdam deleniti aperiam ipsam saepe expedita vel ipsa! Odio maxime suscipit, unde id ad quas impedit eius? Facere officiis ex aliquam, rerum pariatur consequatur reiciendis delectus debitis maxime est ab fugiat esse error consequuntur quam hic aperiam magnam inventore. Rerum neque tenetur qui architecto reprehenderit doloribus quibusdam, ipsam voluptatum laboriosam? Quos, commodi dolorum! Hic ipsam veritatis eaque suscipit a dolores voluptatum minus incidunt, dicta maiores quas corrupti sed dolorem voluptates voluptatibus atque consequatur harum ratione cupiditate necessitatibus quam eius dolor assumenda. Iste excepturi ad exercitationem, facilis quis sit ipsa temporibus sequi iusto debitis, placeat nulla saepe laudantium. Modi similique illum est corporis, repellat molestiae expedita distinctio consectetur rerum omnis recusandae ut nobis odio mollitia iste necessitatibus cumque quas at. Mollitia qui repellendus magni nesciunt eveniet saepe. Repudiandae, nesciunt. Quae corporis minima ipsam facere explicabo repellat necessitatibus quam animi, minus at cumque laboriosam enim ipsum temporibus nulla iste consequuntur possimus rerum unde. Velit, reiciendis laborum! Assumenda aliquid, necessitatibus hic facilis commodi dicta voluptatibus perspiciatis impedit. Sed laborum labore facilis officia commodi perspiciatis mollitia. Atque magni aperiam facilis, et laboriosam, ex sint voluptate nisi eaque labore aliquid? Architecto ipsam eaque et facilis impedit voluptates, beatae suscipit est, rem, pariatur culpa? Fugiat eveniet ex ea officia quia recusandae ipsum, iste eligendi delectus rem, nemo veritatis deserunt voluptas minus velit soluta. Illum in, eveniet laudantium corrupti animi provident. Officia, minima odio. Cum enim deserunt adipisci possimus quas laboriosam rem velit. Ab omnis distinctio atque, iste aperiam odit sint. Alias magnam ad saepe recusandae vitae vero? Modi laborum laudantium quaerat deleniti corporis at id magni consequuntur magnam consectetur minus esse numquam pariatur sapiente, saepe error iste voluptate dolore sint cupiditate! Earum molestias adipisci sit pariatur totam labore libero ipsum. Voluptatibus numquam quis, atque sequi nisi repellendus eveniet id explicabo commodi, ducimus nihil dignissimos ipsum! Tenetur reiciendis numquam ut dolorem natus, assumenda minus cupiditate neque dolore pariatur odit sint nesciunt, similique praesentium. Nihil aut, libero iste provident ipsam quos voluptate quaerat corrupti nulla omnis quo id alias praesentium quia autem deleniti est fuga dicta exercitationem. Accusantium doloribus voluptate dolor quam cumque maxime, ut velit facilis saepe dolorum, quia, impedit beatae perspiciatis atque possimus dolorem necessitatibus earum nostrum quasi. Quibusdam qui commodi, numquam nulla ducimus asperiores, voluptatibus minima, facilis non quo veniam est fuga quod veritatis maxime distinctio tempora enim pariatur. Iste laborum delectus alias voluptas dolor ex ea sapiente qui! Eius consequuntur numquam sapiente eum in atque eveniet quasi vero illum deleniti, unde natus! Ex pariatur voluptate doloribus iusto eaque voluptas quo sequi, quis perferendis placeat laboriosam deleniti dicta maxime nihil eius dolor necessitatibus? Quasi reprehenderit quia vitae tenetur atque necessitatibus numquam aspernatur iste molestias dicta amet, et maxime repellendus deserunt? Perferendis laudantium beatae laboriosam nisi magnam rerum? Dolor quidem id aut! Quidem esse placeat reiciendis in officia, cum architecto aspernatur quod molestiae et asperiores quasi nemo, voluptatum possimus rem sint, consequuntur corporis perspiciatis voluptatem odio. Enim, laudantium quisquam modi debitis iste voluptatibus delectus eos accusantium deserunt ut dolores dolor, sunt suscipit praesentium aperiam? Quod nemo accusantium totam fugiat sequi provident ab dolorem unde nisi. Quo aliquid itaque beatae, sunt qui optio, incidunt fuga consequatur nisi rerum sit laboriosam nesciunt labore aut cupiditate saepe. Voluptas, architecto nam ipsam possimus laudantium mollitia dignissimos nobis tempora. Molestias, corrupti omnis. Eius repellendus dicta dolores voluptates ratione omnis! Inventore saepe esse deserunt corporis culpa, nobis amet optio perspiciatis placeat eveniet harum aspernatur, ea iste non rerum fugit debitis?
                                                    </span>
                                                    <br /><br />
                                                    <span>Demikian kami sampaikan atas perhatian dan kerjasamanya kami ucapkan terima kasih.</span>

                                                    <br /><br />
                                                    <span>Jakarta, 21 November 2023</span>
                                                </p>
                                            </div>


                                            <div className='footer-content'>

                                                <div className='footer-content-1'>
                                                    <div className='footer-1'>
                                                        Dibuat,
                                                    </div>

                                                    <div className='footer-2'>
                                                        <span><u>Dany Naurma</u></span>
                                                        <br />
                                                        <span>Staff TIS</span>
                                                    </div>
                                                </div>

                                                <div className='footer-content-2'>
                                                    <div className='footer-1'>
                                                        Diketahui,
                                                    </div>

                                                    <div className='footer-2'>
                                                        <span><u>Masyogi Handoko</u></span>
                                                        <br />
                                                        <span>Manager TIS</span>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                            
                            <tfoot className='tfoot-page-footer'    
                            >
                                <tr>
                                    <td>
                                        <div className='footer-content-div' ref={footerRef} data-counter="page"></div>
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}

export default PrintBody