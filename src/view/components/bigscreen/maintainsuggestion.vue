<template>
    <div class="pie2">
        <div class="title">
            <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">维修建议</dv-decoration-7>
        </div>
        <div v-if="!showInfo" style=" font-size:large;color: white;position: absolute; margin: 50%;">当前无数据</div>
        <div class="percentage" v-if="showInfo">
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%;">部件名称</th>
                        <th style="width: 50%;">维修建议</th>
                        <th style="width: 20%;">部件类型</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td>{{ item.elementName }}</td>
                        <td>{{ item.advice }}</td>
                        <td>{{ item.elementType }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showInfo" style="display: flex; margin-top: 600px;justify-content: center">
            <a-pagination :current="pageNumber" :total="total" @change="onPageChange" />
        </div>
        <div class="pie2-footer"></div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: {
        curShipCode: ''
    },
    data() {
        return {
            open: false,
            total: 20,
            index: 0,
            tableData: [],
            showInfo: false,
            pageNumber: 1,
            pageSize: 10,
            id: null,
            deviceName: ''
        };
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        mountedHook() {
            this.fetchData()
        },
        async queryData(url, params) {
            return axios.get(url, {
                params,
            });
        },
        fetchData() {
            this.queryData('/hdapi/RULserver/maintenanceAdvice/getMaintenanceAdviceList', {
                pageNumber: parseInt(this.pageNumber, 10),
                pageSize: this.pageSize,
                shipCode:this.curShipCode
            }).then(res => {
                this.total = res.data.data.total;
                this.tableData = this.id === null ? res.data.data.list : this.filterArray(res.data.data.list, this.id);
                this.showInfo = true;
            })
        },
        filterArray(array, value) {
            if (array) {
                if (array.filter(item => item.elementName.includes(value)).length != 0) {
                    return array.filter(item => item.elementName.includes(value))
                } else {
                    return []
                };
            }
        },
        getDeviceId(id) {
            this.id = id;
            this.fetchData();
        },
        getDeviceName(name) {
            this.deviceName = name
            if (name === '') {
                this.fetchData()
            } else { this.tableData = this.filterArray(this.filterArray(this.tableData, this.id), this.deviceName) }

        },
        onPageChange(pageNumber) {
            this.pageNumber = pageNumber
            this.tableChange()
        },
        onSelectChange(pageSize) {
            this.pageSize = pageSize;
            this.tableChange()
        },
        tableChange() {
            this.fetchData()
        },
        handleOk() {
            this.open = false
        },
        checkInfo(index) {
            this.index = index
            this.open = true
        }
    }
}
</script>

<style scoped>
.percentage {
    width: 420px;
    height: 85%;
    position: absolute;
    padding: 1px;
    margin: 10px;
    top: 20px;
    right: 0px;
    left: 8px;
    text-align: center;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.pie2 .title {
    position: absolute;
    text-align: center;
    width: 100%;
}

.pie2 .title span {
    font-size: 20px;
    color: rgb(0, 186, 255);
}


.pie2 {
    width: 440px;
    height: 65%;
    overflow: hidden;
    position: absolute;
    padding: 1px;
    margin: 10px;
    top: 100px;
    left: 50px;
    background: url(../../../assets/images/line.png) rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(25, 186, 139, 0.17);
}

.pie2::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
}

.pie2::after {
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
}

.pie2 .pie2-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}

.pie2 .pie2-footer::before {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
}

.pie2 .pie2-footer::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
}

table {
    width: 100%;
    box-shadow: 0 0 3px blue;
    background-color: rgba(6, 30, 93, 0.5);
    border-collapse: separate;
    border-spacing: 0 1px;
}

th,
td {
    text-align: center;
    padding: 0;
    border: none;
    border-radius: 4px;
    color: white;
    line-height: 30px;
    height: 40px;
    vertical-align: middle;
    word-break: break-all;
}

th {
    background-color: rgb(25, 129, 246, 0.5);
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

tr {
    /* background-color: rgb(11, 53, 88); */
    font-size: 14px;
}

tr:nth-child(even) {
    background-color: rgb(19, 41, 63);
}
</style>