const fundCodeListCacheKey = "fund_code_list"
function alertWaraing(content){
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: content,
        showConfirmButton: false,
        timer: 1500
    })
}

function cacheFundCode(fundCode) {
    let codeList = window.localStorage.getItem(fundCodeListCacheKey)
    if(codeList=="" || codeList == null){
        window.localStorage.setItem(fundCodeListCacheKey, fundCode)
    }else {
        let idList = codeList.split(',')
        for(let i=0;i<idList.length;i++){
            if(idList[i]==fundCode){
                return
            }
        }
        window.localStorage.setItem(fundCodeListCacheKey, codeList+ ","+fundCode)
    }
}

function addFundList(fundCode){
    let rowHtml = "<div class=\"row\">\n" +
        "        <div class=\"col-sm\">\n" +
        "            <img src=\"http://j4.dfcfw.com/charts/pic7/"+fundCode+".png?v=0.3680328107704518\" class=\"figure-img img-fluid rounded\">\n" +
        "        </div>\n" +
        "    </div>";

    let singleFund = "<div class=\"col-sm\">\n" +
        "            <img src=\"http://j4.dfcfw.com/charts/pic7/"+fundCode+".png?v=0.3680328107704518\" class=\"figure-img img-fluid rounded\">\n" +
        "        </div>";
    let firstRow = $("#div-fund-list div").first();
    if(firstRow.length==1){
        let firstFundList = firstRow.children();
        if(firstFundList.length < 3){
            firstFundList.prepend(singleFund)
        }
    }else{
        $("#div-fund-list").prepend(rowHtml);
    }

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: '大吉大利，今晚吃鸡',
        showConfirmButton: false,
        timer: 1500
    })
}

function init(){
    let codeListStr = window.localStorage.getItem(fundCodeListCacheKey);
    if(codeListStr != null && codeListStr != ""){
        let codeList = codeListStr.split(',');
        for(let i=0;i<codeList.length;i++){
            addFundList(codeList[i]);
        }
    }
}

function refresh(){
    let codeListStr = window.localStorage.getItem(fundCodeListCacheKey);
    if(codeListStr != null && codeListStr != ""){
        location.reload();
    }
}

function checkExist(code){
    let codeListStr = window.localStorage.getItem(fundCodeListCacheKey);
    if(codeListStr != null && codeListStr != ""){
        let codeList = codeListStr.split(',');
        for(let i=0;i<codeList.length;i++){
            if(code==codeList[i]){
                return true;
            }
        }
    }
    return false;
}

$(document).ready(function(){
    init();
    $("#button-add-fund").click(function () {
        let inputFundVal = $("#input-fund").val();
        if(inputFundVal == null || inputFundVal.length==0){
            alertWaraing('请输入要添加的基金代码')
            return
        }
        if(checkExist(inputFundVal)){
            alertWaraing('老铁你已经添加过该基金了……')
            return
        }

        let search_url = "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=" + inputFundVal;
        $.ajax({
            url: search_url,
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                if(data.Datas.length == 0){
                    alertWaraing('基金['+inputFundVal+']信息未找到')
                }else{
                    let datas = data.Datas;
                    for(let i=0; i< datas.length; i++){
                        let data = datas[i];
                        if(data.CATEGORYDESC == '基金' && data.FundBaseInfo != ""){
                            let fundBaseInfo = data.FundBaseInfo;
                            let code = fundBaseInfo.FCODE;
                            cacheFundCode(code)
                            addFundList(code);
                            $("#input-fund").val('');
                        }
                    }

                }
            }
        });
    });
});

setInterval(function () {
    refresh();
}, 30000)




