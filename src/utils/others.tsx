export const loadjs = (jsname: string) => {

    // const timer = setTimeout(() => {
        const script = document.createElement("script");

        let jsname_final: string = jsname
        if (jsname.lastIndexOf('.js') == -1){
            jsname_final = jsname + '.js'
        }
        script.src = "js/" + jsname_final;
        script.async = true;
        document.body.appendChild(script);
    // }, 300);
    // return () => {
    //     // window.removeEventListener("keypress", handleKeyPress);
    //     clearTimeout(timer);
    // }
}

export const formatDate = (tanggal:any, format:'yyyy/mm/dd') => {
    let tanggal_str:any;
    if (!isNaN(tanggal)){
        switch (format){
            case 'yyyy/mm/dd': 
                    tanggal_str = tanggal.getFullYear() + "/" 
                                    + ("0" + (tanggal.getMonth() + 1)).slice(-2) + "/"
                                    + ("0" + tanggal.getDate()).slice(-2)
                    break;
        }
        return tanggal_str;
    }
    return null
}

export const removeCustomjs = (jsname:string) => {
    let jsname_final: string = jsname
    if (jsname.lastIndexOf('.js') == -1){
        jsname_final = jsname + '.js'
    }

    var scriptElement = document.body.getElementsByTagName("script") 
    for (var i = scriptElement.length - 1; i >= 0; i--){
        var indexCustom = scriptElement[i].src.lastIndexOf("/" + jsname_final)
        if (indexCustom != -1){
            scriptElement[i].parentNode?.removeChild(scriptElement[i])
        }
    }
}

export const funcShowCheckedOrAll = (statusChecked:string) => {

    setTimeout(()=>{
        let rows = document.querySelectorAll<HTMLTableRowElement>("table.filterclass tr")
        rows.forEach(row=>{
            if (statusChecked == 'checked'){
                if (!row.classList.contains("showChecked")){
                    row.style.display = 'none'
                }
            }
            else if (statusChecked == 'all'){
                row.style.display = 'table-row'
            }
        })
    })

}