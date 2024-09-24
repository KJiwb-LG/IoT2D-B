// 折线图-灯光开关状态
const ctxLine = document.getElementById('myLineChart').getContext('2d');  
const lineData = { 
    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],  
    datasets: [{  
        label: '灯光亮度',  
        data: [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0], // 假设的数据，表示一天中不同时间点的灯光亮度  
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  
        borderColor: 'rgba(75, 192, 192, 1)',  
        borderWidth: 1,  
        fill: false // 不填充折线图区域  
    }]   
};  
// 折线图选项
const lineOptions = {  
    scales: {  
        y: {  
            beginAtZero: true , 
            title: {  
                display: true,  
                text: '灯光亮度(0-1)'  
            }
        }  
    }
};  
// 创建折线图  
const myLineChart = new Chart(ctxLine, {  
    type: 'line',  
    data: lineData,  
    options: lineOptions  
});


// 柱状图数据-开灯时长
const ctxBar = document.getElementById('myBarChart').getContext('2d');  
const barData = {  
    labels: ['开', '关'],  
    datasets: [{  
        label: '灯光亮度时间',  
        data: [], 
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],  
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],  
        borderWidth: 1  
    }]  
};  
// 柱状图选项  
const barOptions = {  
    scales: {  
        y: {  
            beginAtZero: true,
            title: {  
                display: true,  
                text: '时长(h)'  
            }
        }  
    }  
};
// 创建柱状图  
const myBarChart = new Chart(ctxBar, {  
    type: 'bar',  
    data: barData,  
    options: barOptions
});  


//饼状图-灯光颜色
const ctxPie = document.getElementById('myPieChart').getContext('2d');
const pieData = {  
    labels: ['Red', 'Green', 'Blue'],  
    datasets: [{  
        label: 'Light Color Distribution',  
        data: [], // 假设的数据，根据实际情况调整  8, 11, 5
        backgroundColor: [  
            'rgba(255, 99, 132, 0.2)',  
            'rgba(75, 192, 92, 0.2)',  
            'rgba(54, 162, 235, 0.2)'  
        ],  
        borderColor: [  
            'rgba(255, 99, 132, 1)',  
            'rgba(75, 192, 92, 1)',  
            'rgba(54, 162, 235, 1)'  
        ],  
        borderWidth: 1  
    }]  
};
// 饼状图选项 
const pieOptions = {  
    responsive: true,  
    plugins: {  
        legend: {  
            position: 'top',  
        },  
        title: {  
            display: true,  
            text: 'Light Color Distribution(h)'  
        }  
    }  
};
// 创建饼状图
const myPieChart = new Chart(ctxPie, {  
    type: 'pie',  
    data: pieData,  
    options: pieOptions
});
        

async function fetchData(){
    try {
        // 读取并解析JSON文件
        const response = await fetch('http://localhost:8080/light.json');
        const jsonData = await response.json();

        // 过滤数据，仅保留指定日期的数据
        const targetDate = '2024-07-04';
        const filteredData = jsonData.filter(entry => entry.date === targetDate);
        
        //更新亮度水平柱状图
        const newBrightData = getBrightData(filteredData);
        barData.datasets[0].data = newBrightData;
        myBarChart.update();

        //更新颜色分布饼状图
        const newColourData = getColourData(filteredData);
        pieData.datasets[0].data = newColourData;
        myPieChart.update();

        console.log('new bar data:', newBrightData);
        console.log('new pie data:', newColourData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
        
function calcTimeDiff(filteredData){
    return filteredData.map((entry, index, array) => {
        if (index === 0) {
            return null; // 第一个时间点没有前一个时间点
        }

        const prevEntry = array[index - 1];
        const currentTime = new Date(`${entry.date} ${entry.time}`);
        const prevTime = new Date(`${prevEntry.date} ${prevEntry.time}`);

        // 计算时间差（以小时为单位）
        const timeDiff = (currentTime - prevTime) / (1000 * 60 * 60);

        return {
            brightness: prevEntry.brightness,
            colour: prevEntry.colour,
            timeDiff: timeDiff
        };
    }).filter(diff => diff !== null); // 移除第一个空值
}
        
function getBrightData(filteredData){
    // 计算相邻时间点之间的时间差
    const diffData = calcTimeDiff(filteredData);

    // 初始化累加对象
    const accumulatedData = {
        "全亮": 0,
        "亮": 0,
        "适悦": 0,
        "关": 0
    };

    // 累加时间差
    diffData.forEach(diff => {
        if (accumulatedData.hasOwnProperty(diff.brightness)) {
            accumulatedData[diff.brightness] += diff.timeDiff;
        }
    });

    // 将 accumulatedTimes 转化为数组
    const accumulatedDataArray = Object.entries(accumulatedData).map(([brightness, timeDiff]) => {
        return { brightness, timeDiff };
    });

    return accumulatedDataArray.map(entry => entry.timeDiff);
}
        
function getColourData(filteredData){
    // 计算相邻时间点之间的时间差
    const diffData = calcTimeDiff(filteredData);

    // 初始化累加对象
    const accumulatedData = {
        "red": 0,
        "green": 0,
        "blue": 0
    };

    // 累加时间差
    diffData.forEach(diff => {
        if (accumulatedData.hasOwnProperty(diff.colour)) {
            accumulatedData[diff.colour] += diff.timeDiff;
        }
    });

    // 将 accumulatedTimes 转化为数组
    const accumulatedDataArray = Object.entries(accumulatedData).map(([colour, timeDiff]) => {
        return { colour, timeDiff };
    });

    return accumulatedDataArray.map(entry => entry.timeDiff);
}
        
        
// 页面加载完成后执行  
window.onload = function() {  
    // 获取当前日期  
    var today = new Date();  
    var dateString = today.toDateString(); // 例如："Wed Jul 21 2021"  

    // 查找并更新p标签的文本  
    document.getElementById('currentDate').textContent = 'Date: ' + dateString;

    fetchData();
};  

// 定义一个函数来更新时间  
function updateTime() {  
    // 获取当前时间  
    var now = new Date();  
    // 格式化时间，只保留时分秒  
    var timeString = now.getHours().toString().padStart(2, '0') + ":" +   
                     now.getMinutes().toString().padStart(2, '0') + ":" +   
                     now.getSeconds().toString().padStart(2, '0');  
  
    // 获取#currentLight元素  
    var currentLightElement = document.getElementById('currentLight');  
  
    // 更新内容，将时间添加到原始内容前面  
    currentLightElement.innerHTML = timeString + " Current light : 3 · 适悦 · Green ";  
}  
  
// 每隔一秒调用updateTime函数  
setInterval(updateTime, 1000);  