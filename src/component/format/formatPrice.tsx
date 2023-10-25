
export const formatPrice = (value: number) => {
    let formated = "";
    
    if (value < 0) {
        let dec = (value / 1).toFixed(2).replace('.', ',')
        var regex = dec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        formated = '(' + regex.replace('-', '') + ')'
    } else {
        let dec = (value / 1).toFixed(2).replace('.', ',')
        formated = dec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
    
    return formated;
};