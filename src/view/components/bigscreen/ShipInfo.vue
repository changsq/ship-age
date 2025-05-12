<template>
    <div class="pie1">
        <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">设备信息</dv-decoration-7>
        <div style="overflow-y: auto;">
            <table>
                <tbody>
                    <tr v-for="(value, key) in shipInfo" :key="key">
                        <td>{{ shipKey[key] }}</td>
                        <td>{{ value }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            shipInfo: [],
            shipKey: {
                manufacturer: '设备制造厂',
                manufactureDate: '设备制造日期',
                operatingPowerOrSpeed: '营运功率(kw)/转速(r/min)',
                startupSequence: '发火顺序',
                monthlyRunningTime: '本月累计运行时间',
                totalRunningTime: '总累计运行时间',
                lastOilSamplingDate: '系统油最后采样日期',
                tailShaftOilSamplingDate: '尾轴油取样日期',
            },
        };
    },
    methods: {
        getShipInfo(info) {
            this.shipInfo = info[0]
            const display = [
                "manufacturer",
                "manufactureDate",
                "operatingPowerOrSpeed",
                "startupSequence",
                "monthlyRunningTime",
                "totalRunningTime",
                "lastOilSamplingDate",
                "tailShaftOilSamplingDate"
            ]
            const filterShipInfo = {};
            display.forEach(param => {
                if (this.shipInfo.hasOwnProperty(param)) {
                    filterShipInfo[param] = this.shipInfo[param];
                }
            });
            this.shipInfo = filterShipInfo
        },
    },
}
</script>
<style>
table {
    margin-top: 5px;
    width: 99.8%;
    height: 74%;
    border-collapse: separate;
    /* 允许设置单元格之间的距离 */
    border-spacing: 0 1px;
}

th,
td {
    text-align: center;
    padding: 5px;
    border: none;
    /* 边框颜色 */
    border-radius: 4px;
    /* 圆角 */
    color: white;
}


th {
    background-color: rgb(25, 129, 246, 0.5);
    /* 背景色 */
    color: white;
    /* 文字颜色 */
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
}

tr {
    /* background-color: rgb(11, 53, 88); */
    /* 背景色 */
    font-size: 14px;
}

tr:nth-child(even) {
    background-color: rgb(19, 41, 63);
    /* 奇偶行交替颜色 */
}

.pie1 .title {
    position: absolute;
    text-align: center;
    width: 100%;
}

.pie1 .title span {
    font-size: 25px;
    color: #ffffff;
}

.pie1 {
    width: 440px;
    height: 300px;
    overflow: hidden;
    position: absolute;
    padding: 1px;
    margin: 10px;
    top: 700px;
    left: 50px;
    background: url(../../../assets/images/line.png) rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(25, 186, 139, 0.17);
}

.pie1::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
}

.pie1::after {
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
}

.pie1 .pie1-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}

.pie1 .pie1-footer::before {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
}

.pie1 .pie1-footer::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
}
</style>