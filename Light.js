const ctx = document.getElementById('myChart').getContext('2d');  
const data = {  
    labels: [],
    datasets: [{  
        label: 'Light Intensity',  
        data: [],  
        fill: false, 
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  
        borderColor: 'rgba(75, 192, 192, 1)',  
        borderWidth: 1  
    }]  
};  
  
const options = {  
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'hour',
                stepSize: 2,
                displayFormats: {
                    hour: 'HH:mm'
                }
            },
            title: {
                display: true,
                text: 'Time'
            }
        },
        y: {  
            beginAtZero: true , 
            title: {  
                display: true,  
                text: 'Light Intensity (lux)'  
            }
        }  
    }
};  
  
const myLineChart = new Chart(ctx, {  
    type: 'line',  
    data: data,  
    options: options  
});

// 定义一个异步函数，用于获取JSON数据
async function fetchTempData(date) {
    try {
        // 读取并解析JSON文件
        const response = await fetch('http://localhost:8080/collection.json');
        const jsonData = await response.json();

        // 定义要过滤的日期
        const targetDate = date;

        // 过滤数据，仅保留指定日期的数据
        const filteredData = jsonData.filter(entry => entry.collectionDate === targetDate);

        // 定义采样间隔（半小时）
        const samplingInterval = 30 * 60 * 1000; // 30分钟的毫秒数
        const startTime = new Date(`${targetDate}T08:00:00`).getTime();
        const endTime = new Date(`${targetDate}T22:00:00`).getTime();

        // 过滤和采样数据
        const sampledData = [];
        for (let time = startTime; time <= endTime; time += samplingInterval) {
            const entry = filteredData.find(entry => {
                const entryTime = new Date(`${entry.collectionDate}T${entry.collectionTime}`).getTime();
                return entryTime >= time && entryTime < time + samplingInterval;
            });
            if (entry) {
                sampledData.push({
                    x: `${entry.collectionDate} ${entry.collectionTime}`,
                    y: entry.lightness
                });
            }
        }

        console.log("sampledData: ", sampledData);

        // 将采样后的数据赋值给data对象中的data属性
        data.datasets[0].data = sampledData;
        data.labels = sampledData.map(point => point.x);

        // 在这里可以调用更新图表的代码，比如使用Chart.js
        // 假设你的Chart.js图表实例名为myLineChart，可以调用myLineChart.update()
        myLineChart.update();

        console.log('Updated Data:', data.datasets[0].data);
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }
}

function findMax(data){
    let max = data[0];
    for(let element of data){
        if( element > max)
            max = element;
    }

    return max;
}

function findMin(data){
    let min = data[0];
    for(let element of data){
        if( element < min)
            min = element;
    }

    return min;
}

function findAverage(data){
    let sum = 0;
    for(let element of data){
        sum += element;
    }
    let avg = sum / data.length;
    return avg.toFixed(2);
}

function getCurrentDate() {
    const date = new Date(); // 创建一个新的 Date 对象，它默认包含当前日期和时间
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，+1 是因为 getMonth() 返回的是 0-11
    const day = date.getDate(); // 获取当前日

    // 使用模板字符串来格式化日期，确保月和日为两位数
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function updateChart(date) {  
    // 更新当前日期显示  
    document.getElementById('currentDate').textContent = 'Date: ' + date;  
    fetchTempData(date);
}

// 页面加载完成后执行  
window.onload = function() {  
    // 获取当前日期  
    var today = new Date();  
    var dateString = today.toDateString(); // 例如："Wed Jul 21 2021"  

    // 查找并更新p标签的文本  
    document.getElementById('currentDate').textContent = 'Current Date: ' + dateString;

    //更新图表数据
    fetchTempData(getCurrentDate());
};