<template>
    <div>
        <div class="pie">
            <!-- <p>{{ message }}</p>      -->
            <div class="title">
                <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">历史报警</dv-decoration-7>
            </div>
            <div class="datePicker">
                <span style="margin: 5px 0px;font-size: large;color: white;">选择时间：</span>
                <a-range-picker style="width: 250px;" v-model="selectedDates" />
                <a-button style="margin-left: 10px;" type="primary" @click="handleTimePick">确定</a-button>
            </div>
            <div class="percentage">
                <table>
                    <!-- 表格头部 -->
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>报警信息</th>
                        </tr>
                    </thead>
                    <!-- 表格主体 -->
                    <tbody>
                        <tr v-for="item in data" :key="item.tagCode">
                            <td>{{ item.time.replace('T', ' ') }}</td>
                            <td>{{ item.description }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pie-footer">
                <a-pagination :current="pageNumber" :total="total" @change="onPageChange" />
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import { closeWebsocket } from '/websocket.js';
export default {
    name: "xs-pie",
    data() {
        return {
            selectedDates: [moment().subtract(7, 'days'), moment()],
            time: {
                start: '',
                end: ''
            },
            pageNumber:1,
            total:10,
            historyPage: [],
            data: [
                // {
                //     time: "2024-12-08T15:30:00",
                //     description: "温度超限报警,这是一条测试数据，主要目的是测试能否分两行显示",
                // },
                // {
                //     time: "2024-12-08T16:45:00",
                //     description: "压力异常报警,，这是一条测试数据，主要目的是测试能否分两行显示",
                // },
                // {
                //     time: "2024-12-08T15:30:00",
                //     description: "温度超限报警,这是一条测试数据，主要目的是测试能否分两行显示",
                // },

            ],

        };
    },

    mounted() {
        this.handleTimePick();
    },

    beforeDestroy() {
        closeWebsocket()
    },

    methods: {
        onPageChange(pageNumber){
            this.pageNumber = pageNumber;
            this.handleTimePick();
        },
        handleTimePick() {
            const startTime = new Date(this.selectedDates[0]._d)
            const endTime = new Date(this.selectedDates[1]._d)
            this.time.start = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
            this.time.end = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')

            this.queryData('/hdapi/server/FaultDetection/historyPage', {
                beginTime: this.time.start,
                endTime: this.time.end,
                shipCode: this.$parent.curShipCode,
                current: this.pageNumber,
                size: 10
            }).then(res => {
                this.total = res.data.data.total;
                // 直接使用返回的数据填充 data 数组
                this.data = res.data.data.list.map(item => ({
                    time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
                    description: item.description
                }));
            })
        },

        async queryData(url, params) {
            return axios.get(url, {
                params,
            });
        },

    },
}
</script>

<style scoped>
.pie {
    width: 440px;
    height: 450px;
    overflow: hidden;
    position: relative;
    padding: 1px;
    margin: 10px;
    top: 550px;
    right: 0;
    left: 45px;
    background: url(../../../assets/images/line.png) rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(25, 186, 139, 0.17);
}

.pie::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
}

.pie::after {
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
}

.pie .pie-footer {
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
}

.pie .pie-footer::before {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
}

.pie .pie-footer::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
}

.pie .title {
    position: absolute;
    text-align: center;
    width: 100%;
}

.pie .title span {
    font-size: 25px;
    color: #ffffff;
}

.datePicker {
    margin-top: 30px;
    margin-left: 20px;
}

.p1 {
    font-size: 25px;
    /* text-align: left; */
    color: #ffffff;
    left: 20px;
    top: 20px;
}

.percentage2 {
    width: 100%;
    height: 300px;
    top: 20px;
    /* text-align: left; */
    position: absolute;
    padding: 20px;
}

.percentage {
    width: 420px;
    height: 340px;
    overflow-y: auto;
    position: absolute;
    padding: 1px;
    margin: 10px;
    top: 60px;
    right: 0px;
    left: 8px;
    text-align: center;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

table {
    width: 100%;
    height: 74%;
    border-collapse: separate;
    /* 允许设置单元格之间的距离 */
    border-spacing: 0 1px;
}

th {
    text-align: center;
    padding: 12px;
    border-radius: 4px;
    /* 圆角 */
    color: white;
    position: sticky;
    background-color: rgb(25, 129, 246, 0.5);
    /* 背景色 */
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

td {
    text-align: center;
    padding: 12px;
    border-radius: 4px;
    /* 圆角 */
    color: white;
}


tr {
    height: 40px;
    font-size: 14px;
}

tr:nth-child(even) {
    background-color: rgb(19, 41, 63);
    /* 奇偶行交替颜色 */
}
</style>