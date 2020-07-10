function alertWaraing(content){
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: content,
        showConfirmButton: false,
        timer: 1500
    })
}
$(document).ready(function(){
    $("#button-add-fund").click(function () {
        let inputFundVal = $("#input-fund").val();
        if(inputFundVal == null || inputFundVal.length==0){
            alertWaraing('请输入要添加的基金代码')
            return
        }
        let search_url = "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=" + inputFundVal;
        $.ajax({
            url: search_url,
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                console.log(data.Datas)
                if(data.Datas.length == 0){
                    alertWaraing('基金['+inputFundVal+']信息未找到')
                }else{
                    let datas = data.Datas;
                    for(let i=0; i< datas.length; i++){
                        let data = datas[i];
                        if(data.CATEGORYDESC == '基金' && data.FundBaseInfo != ""){
                            let fundBaseInfo = data.FundBaseInfo;
                            let name = data.NAME;
                            let fund_key = 'fund_info_'+data.CODE;
                            window.localStorage.setItem(fund_key, name)
                            let ls_data = window.localStorage.getItem(fund_key)
                            alert(ls_data)

                        }
                    }

                }
            }
        });
    });
});





