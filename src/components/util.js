
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
    //가방에 기본값
    const defaultBag = 2019;
    // options 에 String => int 배열로 변환
    const tmp = convertOptionsIntoArray(options);
    return tmp
        .reduce((acc, cur) => cur === defaultBag
            ? acc
            : acc + parseInt(commonTable.filter(c => c.code_id === cur)[0].code_value)
            , 0
        );
}
/* 
    .reduce() 함수는 배열에 모든 요소를 더해 하나의 누적 값을 만든다.
    acc:누적 가격 
    cur : tmp 
    ? cur이 defaultBag인 경우 acc 이고
    : 아니면 acc 기본 누적 가격에 coommontable 필터해서 c.code_id ===cur 이랑 같은값에
    code_value 값을 가져와서 더한다.
*/