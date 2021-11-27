const fundCodeListCacheKey = "fund_code_list";
const app = new Vue({
    el: '#app',
    data: {
        hiddenFundNameList: true,
        inputFundCode: null,
        imageSrcList: [],
        fundNameList: [],
        selectFundList: [],
        newAddSelectedFundList: []
    },
    methods: {
        alertWarn(content) {
            swal({
                title: content,
                icon: "warning",
                timer: 1500,
                buttons: false
            })
        },
        checkExist(code) {
            let codeListStr = window.localStorage.getItem(fundCodeListCacheKey);
            if (codeListStr) {
                let codeList = codeListStr.split(',');
                for (let i = 0; i < codeList.length; i++) {
                    if (code === codeList[i]) {
                        return true;
                    }
                }
            }
            return false;
        },
        loadFund() {
            let codeListStr = window.localStorage.getItem(fundCodeListCacheKey)
            if (codeListStr != null && codeListStr !== "") {
                this.imageSrcList = [];
                let codeList = codeListStr.split(',').reverse();
                for (let i = 0; i < codeList.length; i++) {
                    let src = "http://j4.dfcfw.com/charts/pic7/" + codeList[i] + ".png?v=" + Math.random();
                    this.imageSrcList.push(src)
                }
            }else {
                this.imageSrcList = [];
                this.hiddenFundNameList = true;
                this.fundNameList = [];
            }
        },
        cacheFundCode(fundCode) {
            let codeList = window.localStorage.getItem(fundCodeListCacheKey)
            if (!codeList) {
                window.localStorage.setItem(fundCodeListCacheKey, fundCode)
            } else {
                let idList = codeList.split(',')
                for (let i = 0; i < idList.length; i++) {
                    if (idList[i] === fundCode) {
                        return
                    }
                }
                window.localStorage.setItem(fundCodeListCacheKey, codeList + "," + fundCode)
            }
            this.loadNameList();
            this.loadFund();
        },
        closeSelectWindow() {
            this.newAddSelectedFundList = [];
        },
        showSelectWindow() {
            if (!this.inputFundCode) {
                this.alertWarn('请输入基金代码或名称');
                return;
            }
            if (this.checkExist(this.inputFundCode)) {
                this.alertWarn('老铁你已经添加过该基金了');
                return;
            }
            let search_url = "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=" + this.inputFundCode;

            $.ajax({
                url: search_url,
                type: "get",
                dataType: "jsonp",
                success: data => {
                    if (data.Datas.length === 0) {
                        this.alertWarn('基金[' + this.inputFundCode + ']信息未找到');
                    } else {
                        this.selectFundList = [];
                        let datas = data.Datas;
                        for (let i = 0; i < datas.length; i++) {
                            let data = datas[i];
                            if (data.CATEGORYDESC === '基金' && data.FundBaseInfo !== "" && data.FundBaseInfo.FTYPE !== '货币型') {
                                this.selectFundList.push(data);
                            }
                        }
                        $('#selectFundModal').modal('show');
                    }
                }
            });

        },
        addFund() {
            if (this.newAddSelectedFundList.length === 0) {
                this.alertWarn('请勾选需要添加的基金');
                return;
            }
            for(let code of this.newAddSelectedFundList){
                if (this.checkExist(code)) {
                    this.alertWarn('老铁你已经添加过[' + code + ']基金了');
                    return;
                }
            }
            this.newAddSelectedFundList.forEach(code => {
                this.cacheFundCode(code);
            });
            this.newAddSelectedFundList = [];
            this.inputFundCode = null;
            $('#selectFundModal').modal('hide');
        }
        ,
        removeFund(code, name) {
            swal({
                title: "确定要删除["+name+"]?",
                text: "",
                icon: "warning",
                buttons: ['点错了', '确定'],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        let codeListStr = window.localStorage.getItem(fundCodeListCacheKey)
                        if (codeListStr) {
                            let idList = codeListStr.split(',')
                            idList.forEach(function (item, index, arr) {
                                if (item === code) {
                                    arr.splice(index, 1);
                                }
                            });
                            if(idList.length===0){
                                window.localStorage.removeItem(fundCodeListCacheKey);
                            }else {
                                window.localStorage.setItem(fundCodeListCacheKey, idList.join(','))
                            }
                            this.loadNameList();
                            this.loadFund();
                        }

                        swal("删除成功", {
                            icon: "success",
                            timer: 1500,
                            buttons: false
                        });
                    }
                });
        },
        loadNameList() {
            let codeList = window.localStorage.getItem(fundCodeListCacheKey)
            this.fundNameList=[];
            if (codeList) {
                let idList = codeList.split(',').reverse();
                for (let i = 0; i < idList.length; i++) {
                    let search_url = "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=" + idList[i];
                    $.ajax({
                        url: search_url,
                        type: "get",
                        async: true,
                        dataType: "jsonp",
                        success: data => {
                            if (data.Datas.length === 0) {
                                this.alertWarn('基金[' + this.inputFundCode + ']信息未找到');
                            } else {
                                let datas = data.Datas;
                                for (let i = 0; i < datas.length; i++) {
                                    let data = datas[i];
                                    if (data.CATEGORYDESC === '基金' && data.FundBaseInfo !== "" && data.FundBaseInfo.FTYPE !== '货币型') {
                                        const isExists = this.fundNameList.some((value, index) => {return value.CODE === data.CODE})
                                        if(isExists) return
                                        this.fundNameList.push(data)
                                        this.hiddenFundNameList = false
                                    }
                                }

                            }
                        }
                    });
                }
            }

        }
    },
    created: function () {
        this.loadNameList();
        this.loadFund();

        $("body").keydown(function() {
            if (event.keyCode === "13") {
                $("#okBt").click();
            }
        });
    }
})
