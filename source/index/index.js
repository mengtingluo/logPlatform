const React = require('react');
const ReactDOM = require('react-dom');
var {getInfo} = require('../../remotes/public.js');
require('../../lib/style/public.less');
require('./lib/index.less');
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stdout: '',
            list: '',
            describe: '',
            sysInfo: '',
            errLog: [],
            outLog: [],
            heartbeat: {}
        }
    }

    componentDidMount() {
        setInterval(function () {
            getInfo({}).then(res=> {
                this.setState(old=> {
                    old.stdout = res.stdout || '';
                    old.list = res.list || '';
                    old.describe = res.describe || '';
                    old.sysInfo = res.sysInfo || '';
                    // old.sysInfo={
                    //     "10.45.1.1":{
                    //         cpus:[],
                    //         totalmem:73823819238,
                    //         freemem:8342032944,
                    //         loadavg:[1,2,4]
                    //     }
                    // };
                    old.errLog = res.errLog || [];
                    old.outLog = res.outLog || [];
                    old.heartbeat = res.heartbeat || '';
                    return old
                })
            })
        }.bind(this), 1000);
        // this.drawLoadavg();
        setTimeout(function () {
            // this.drwaMemInfo();
            this.drawEachMen();
        }.bind(this), 2000)
    }

    procRender() {
        let procList = [], list = this.state.list;
        for (let key in list) {
            for (let host in list[key]) {
                list[key][host].proc.map((item)=> {
                    procList.push(
                        <tr key={item.pid}>
                            <td>{item.pm2_env.HOSTNAME}</td>
                            <td>{item.name}</td>
                            <td>{item.pid}</td>
                            <td>{item.pm2_env.status}</td>
                            <td>{item.pm2_env.unstable_restarts}</td>
                            <td>{item.pm2_env.restart_time}</td>
                            <td>{item.monit.cpu}%</td>
                            <td>{(item.monit.memory / (1024 * 1024)).toFixed(2)}M</td>
                        </tr>
                    )
                })
            }
        }
        return procList
    }

    // drwaMemInfo() {
    //     var memInfo = echarts.init(document.getElementById('memInfo'));
    //     var option = {
    //         tooltip: {
    //             trigger: 'item',
    //             formatter: "{a} <br/>{b}: {c} ({d}%)"
    //         },
    //         legend: {
    //             orient: 'vertical',
    //             x: 'left',
    //             data: ['已使用', '未使用'],
    //             show: false
    //         },
    //         series: [
    //             {
    //                 name: '状态',
    //                 type: 'pie',
    //                 radius: ['50%', '70%'],
    //                 avoidLabelOverlap: false,
    //                 label: {
    //                     normal: {
    //                         show: false,
    //                         position: 'center'
    //                     },
    //                     emphasis: {
    //                         show: true,
    //                         textStyle: {
    //                             fontSize: '16',
    //                             fontWeight: 'bold'
    //                         }
    //                     }
    //                 },
    //                 labelLine: {
    //                     normal: {
    //                         show: false
    //                     }
    //                 },
    //                 data: [
    //                     {
    //                         value: ((this.state.sysInfo.totalmem - this.state.sysInfo.freemem) / (1024 * 1024)).toFixed(2),
    //                         name: '已使用'
    //                     },
    //                     {value: (this.state.sysInfo.freemem / (1024 * 1024)).toFixed(2), name: '未使用'},
    //                 ]
    //             }
    //         ]
    //     };
    //     memInfo.setOption(option);
    // }

    drawEachMen() {
        var eachMemInfo = echarts.init(document.getElementById('eachMemInfo')), xAxisdata = [], seriesdata = [], list = this.state.list;
        for (let key in list) {
            for (let name in list[key]) {
                list[key][name].proc.map(item=> {
                    xAxisdata.push(item.name+'('+key+')');
                    seriesdata.push((item.monit.memory / (1024 * 1024)).toFixed(2))
                })
            }
        }
        var option = {
            title: {
                text: '各进程内存占用',
                show: false
            },
            legend: {
                data: ['内存占用'],
                show: false
            },
            xAxis: {
                data: xAxisdata,
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            tooltip: {},
            yAxis: [{
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            }],
            series: [{
                name: '内存占用',
                type: 'bar',
                data: seriesdata,
                barWidth: 20
            }]
        };
        eachMemInfo.setOption(option);
    }

    // drawLoadavg() {
    //     var usedCpu = echarts.init(document.getElementById('usedCpu'));
    //     var value = 0;
    //     var now = new Date();
    //     var loadavg = this.state.sysInfo.loadavg[0];
    //     console.log(loadavg);
    //     var oneDay = 1000 * 24 * 3600;
    //     function randomData() {
    //         now = new Date(+now + oneDay);
    //         value = loadavg;
    //         console.log(loadavg,value);
    //         return {
    //             name: now.toString(),
    //             value: [
    //                 [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
    //                 value
    //             ]
    //         }
    //     }
    //     var data = [];
    //     for (var i = 0; i < 100; i++) {
    //         data.push(randomData());
    //     }
    //     // 绘制图表
    //     var option = {
    //         title: {
    //             show: false
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             formatter: function (params) {
    //                 params = params[0];
    //                 var date = new Date(params.name);
    //                 return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()+':'+ params.value[1];
    //             },
    //             axisPointer: {
    //                 animation: false
    //             },
    //             show:false
    //         },
    //         legend: {
    //             data: '',
    //             width: 400,
    //             left: 'center'
    //         },
    //         grid: {
    //             left: '3%',
    //             right: '4%',
    //             bottom: '3%',
    //             containLabel: true
    //         },
    //         toolbox: {},
    //         xAxis: {
    //             type: 'time',
    //             splitLine: {
    //                 show: false
    //             },
    //             axisLine: {
    //                 lineStyle: {
    //                     color: '#fff'
    //                 }
    //             },
    //             show:false
    //         },
    //         yAxis: {
    //             type: 'value',
    //             boundaryGap: [0, '100%'],
    //             splitLine: {
    //                 show: false
    //             },
    //             axisLine: {
    //                 lineStyle: {
    //                     color: '#fff'
    //                 }
    //             },
    //             max:this.state.sysInfo.cpus.length>0?this.state.sysInfo.cpus.length:1,
    //             min:0
    //         },
    //         series: [{
    //             name: '模拟数据',
    //             type: 'line',
    //             showSymbol: false,
    //             hoverAnimation: false,
    //             data: data
    //         }]
    //     };
    //     // 使用刚指定的配置项和数据显示图表
    //     usedCpu.setOption(option);
    //     setInterval(function () {
    //         loadavg = this.state.sysInfo.loadavg[0];
    //         data.shift();
    //         data.push(randomData());
    //         usedCpu.setOption({
    //             series: [{
    //                 data: data
    //             }],
    //             yAxis: {
    //                 type: 'value',
    //                 boundaryGap: [0, '100%'],
    //                 splitLine: {
    //                     show: false
    //                 },
    //                 axisLine: {
    //                     lineStyle: {
    //                         color: '#fff'
    //                     }
    //                 },
    //                 max:this.state.sysInfo.cpus.length>0?this.state.sysInfo.cpus.length:1,
    //                 min:0
    //             }
    //         })
    //     }.bind(this), 1000);
    // }

    heartBeatRender() {
        let list = [], heartbeat = this.state.heartbeat;
        for (let key in heartbeat) {
            let heartHost = heartbeat[key];
            for (let heart in heartHost) {
                list.push(
                    <div className="earth-container col-xs-12">
                        <div className="col-xs-8 text-center">
                            <div className=" col-xs-12">
                                <i className={heartHost[heart].ifUp === 1 ? 'earth health-earth' : 'earth dangerous-earth'}>&#xe600;</i>
                            </div>
                        </div>
                        <div className="col-xs-4 text-center">
                            <div
                                className={heartHost[heart].ifUp === 1 ? 'font24 mgt20' : 'font24 dangerous-earth'}>{heartHost[heart].name}</div>
                            <div
                                className={heartHost[heart].ifUp === 1 ? 'font18' : 'font18 inline dangerous-earth'}>{heartHost[heart].host}</div>
                            {heartHost[heart].ifUp === 1 ?
                                (<div className="font18 col-xs-12 running mgt20">running</div>) :
                                (<div className="col-xs-12">
                                    <i className="warning">&#xe6c7;</i>
                                    <div className="dangerous-earth font18">stopped</div>
                                </div>)}
                        </div>
                    </div>
                )
            }
        }
        return list
    }

    sysInfoRender() {
        let sysInfoList = this.state.sysInfo, list = [];
        for (let key in sysInfoList) {
            list.push(
                <tr key={key}>
                    <td>{key}</td>
                    <td>{sysInfoList[key].cpus.length}</td>
                    <td>{((sysInfoList[key].totalmem) / (1024 * 1024 * 1024)).toFixed(2)}G</td>
                    <td>{((sysInfoList[key].loadavg[0])*100).toFixed(2)}%</td>
                    <td>{((sysInfoList[key].totalmem - sysInfoList[key].freemem) / sysInfoList[key].totalmem * 100).toFixed(2)}%</td>
                </tr>
            )
        }
        return list
    }

    render() {
        let {list}=this.state,
            appNum = 0, appNames = '';
        for (let key in list) {
            appNum++;
            appNames += ' ' + key;
        }
        return (
            <div className="main-content">
                <div className="page-header">
                    <h1 className="font20 mgl40">the logs plate</h1>
                </div>
                <div>
                    <div className="col-xs-4">
                        <ul className="mgl40">
                            <li>应用数：{appNum}</li>
                            <li>应用名称：{appNames}</li>
                        </ul>
                        <div className="heartbeat-container">
                            {this.heartBeatRender()}
                        </div>
                    </div>
                    <div className="col-xs-8">
                        {/*<div>*/}
                        {/*<div className="col-xs-3">*/}
                        {/*<div className="systemInfo-block">cpu:{sysInfo.cpus.length}核</div>*/}
                        {/*</div>*/}
                        {/*<div className="col-xs-3">*/}
                        {/*<div className="systemInfo-block">*/}
                        {/*内存:{(totalmem / (1024 * 1024 * 1024)).toFixed(2)}G*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="col-xs-3">*/}
                        {/*<div className="systemInfo-block">*/}
                        {/*cpu负载：{loadavg[0].toFixed(2)}*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="col-xs-3">*/}
                        {/*<div className="systemInfo-block">*/}
                        {/*内存利用率：{((totalmem - freemem) / totalmem * 100).toFixed(2)}%*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <div className="col-xs-12 mgt10">
                            <div className="col-xs-12 process-body">
                                <table className="table text-center">
                                    <tr>
                                        <th>HOSTNAME</th>
                                        <th>App name</th>
                                        <th>pid</th>
                                        <th>status</th>
                                        <th>restart</th>
                                        <th>uptime</th>
                                        <th>cpu</th>
                                        <th>memory</th>
                                    </tr>
                                    {this.procRender()}
                                </table>
                            </div>
                        </div>
                        <div className="col-xs-12 mgt10">
                            <div className="col-xs-8 sys-body">
                                <table className="table text-center">
                                    <tr>
                                        <th>HOSTNAME</th>
                                        <th>cpu</th>
                                        <th>内存</th>
                                        <th>cpu负载</th>
                                        <th>内存利用率</th>
                                    </tr>
                                    {this.sysInfoRender()}
                                </table>
                            </div>
                            <div className="col-xs-4 chart-block">
                                {/*<div className="chart-block mgb10">*/}
                                {/*<span>内存占比:</span>*/}
                                {/*<div id="memInfo" className="col-xs-12"*/}
                                {/*style={{height: "200px", lineHeight: '200px'}}>*/}
                                {/*暂无数据*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                <span>各进程内存占用:</span>
                                <div id="eachMemInfo" className="col-xs-12"
                                     style={{height: "300px", lineHeight: '300px'}}>
                                    暂无数据
                                </div>
                            </div>
                            {/*<div className="col-xs-4 describe-block">*/}
                            {/*错误日志:{state.errLog}*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*<div className="describe-block">*/}
                            {/*<span>cpu负载</span>*/}
                            {/*<div id='usedCpu' className="col-xs-12 chart-panel"*/}
                            {/*style={{height: "300px", lineHeight: '300px'}}>*/}
                            {/*暂无数据*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = Index;
let body = document.querySelector('.content');

if (body) {
    ReactDOM.render(<Index/>, body);
}