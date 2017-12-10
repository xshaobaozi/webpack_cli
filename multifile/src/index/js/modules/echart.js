import echarts from 'echarts';

const chartColor = ['yellow', '#ffc209', '#09EBFF'];
const arr = ['类别1', '类别2', '类别3', '类别4', '类别5'];

class createChart{
    constructor(el, options){
        this._rootSize = $('html').css('fontSize').replace('px', '') * 1;
        const formatSize = val => (parseInt(this._rootSize/100 * val));
        this.baseOption = {
            radar: [
                {
                    indicator: arr.map(item => {
                        return {
                            name: item,
                            max: 80
                        }
                    }),
                    name: {
                        show: true,
                        color: chartColor[0],
                        fontSize: formatSize(20)
                    },
                    scale: true,
                    nameGap: '1',
                    radius: '50%',
                    center: ['50%','60%'],
                    axisLabel: {
                        fontSize: formatSize(20)
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine:{
                        lineStyle: {
                            color: chartColor[0]
                        }
                    }
                }
            ],
            series: {
                type: 'radar',
                radarIndex: 0,
                data: [
                    {
                        name: '某主食手机',
                        lineStyle: {
                            normal: {
                                color: chartColor[1]
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: chartColor[1],
                                borderColor: chartColor[1]
                            }
                        }
                    },
                    {
                        name: '某水果手机',
                        lineStyle: {
                            normal: {
                                color: chartColor[2]
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: chartColor[2],
                                borderColor: chartColor[2]
                            }
                        }
                    }
                ]
            }
        }
        const ele = document.querySelector(el);

        this.el = echarts.init(ele);
        this.el.setOption(this.baseOption);
    }
    freshData(options) {
        this.baseOption.series.data = this.baseOption.series.data.map((item, i) => {
            item.value = options.series.data[i].value;
            return item
        })
        this.el.setOption(this.baseOption);
    }
    

}

module.exports = createChart;