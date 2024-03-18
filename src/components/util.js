
/**
 * options 스트링을 int 배열로 변환
 * @param {*} options 
 * @returns {[]}
 */
export const convertOptionsIntoArray = (options) => {
    return options.replace(" ", "")
        .split(',')
        .filter(s => !isNaN(parseInt(s)))
        .map(s => parseInt(s));
}


/**
 * options 스트링을 option 가격으로 변환
 * @param {*} options 
 * @param commonTable
 * @returns {number}
 */
export const convertOptionsIntoPrice = (options, commonTable) => {
    const defaultBag = 2019;
    const tmp = convertOptionsIntoArray(options);
    
    console.log('option arr : ' + tmp);
    return tmp
        .reduce((acc, cur) => cur === defaultBag
            ? acc
            : acc + parseInt(commonTable.filter(c => c.code_id === cur)[0].code_value)
            , 0
        );
}

