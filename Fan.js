function queryWindowStatus() {  
    var dateTimeInput = document.getElementById('windowTime').value;  
    // 将datetime-local的字符串转换为Date对象  
    var date = new Date(dateTimeInput);  
    // 将Date对象转换为UNIX时间戳（秒）  
    var unixTime = Math.floor(date.getTime() / 1000);  
  
    // 使用fetch API发送请求（这里需要你的后端URL）  
    fetch('/api/window-status?time=' + unixTime)  
        .then(response => response.json())  
        .then(data => {  
            // 假设后端返回 { status: 'open' } 或 { status: 'closed' }  
            document.getElementById('statusResult').textContent = '窗户状态: ' + data.status;  
        })  
        .catch(error => {  
            console.error('Error:', error);  
            document.getElementById('statusResult').textContent = '查询失败';  
        });  
}


// 表格分页逻辑
function fillTable(page) {  
  tbody.innerHTML = ''; // 清空 tbody  
  for (let i = (page - 1) * rowsPerPage; i < page * rowsPerPage && i < totalRows; i++) {  
      const row = document.createElement("tr");  
      data[i].forEach(cellData => {  
          const td = document.createElement("td");  
          td.textContent = cellData;  
          row.appendChild(td);  
      });  
      tbody.appendChild(row);  
  }  
  updatePageInfo();  
}  

function prevPage() {  
  if (currentPage > 1) {  
      currentPage--;  
      fillTable(currentPage);  
  }  
}  

function nextPage() {  
    dateValue = document.getElementById('datePicker').getAttribute('dateValue');
    fetchData(dateValue);
    updatePageInfo();
    const maxPages = Math.ceil(totalRows / rowsPerPage);  
    if (currentPage < maxPages) {  
        currentPage++;  
        fillTable(currentPage);  
    }  
}  

function updatePageInfo() {  
  const maxPages = Math.ceil(totalRows / rowsPerPage);  
  document.getElementById('pageInfo').innerText = `Page ${currentPage}/${maxPages}`;  
}  

// 你的数据数组
var data = [  
    ["2023-04-01 10:00", "开窗", "通风"],  
    ["2023-04-01 15:00", "关窗", "下雨"],  
    ["2023-04-01 16:00", "开窗", "通风"],  
    ["2023-04-01 23:00", "关窗", "睡觉"],  
    ["2023-04-02 09:00", "开窗", "通风"],
    ["2023-04-01 10:00", "开窗", "通风"],  
    ["2023-04-01 15:00", "关窗", "下雨"],  
    ["2023-04-01 16:00", "开窗", "通风"],  
    ["2023-04-01 23:00", "关窗", "睡觉"],  
    ["2023-04-02 09:00", "开窗", "通风"]  
];  
  
const rowsPerPage = 5;  
let currentPage = 1;  
let totalRows = 0; // 我们稍后会从数据数组中设置这个值  

// 设置总行数  
totalRows = data.length;

//更新数据
fetchData(new Date().toISOString().split('T')[0]);

var table = document.getElementById("myTable");  
// 如果tbody不存在，则创建一个并添加到table中  
var tbody = table.getElementsByTagName("tbody")[0] || document.createElement("tbody");  
table.appendChild(tbody); // 确保tbody是table的子元素  


async function fetchData(targetDate){
    try{
        // 读取并解析JSON文件
        const response = await fetch('http://localhost:8080/control.json');
        const jsonData = await response.json();

        // 定义要过滤的内容
        const target = "风扇";
        // 过滤数据
        const filteredData = jsonData.filter(entry => entry.device === target &&
                                                      entry.controlDate === targetDate
        );

        const newData = filteredData.map(entry => [
            `${entry.controlDate} ${entry.controlTime}`, 
            entry.operation, 
            entry.controlReason
        ]);

        data = newData;
        totalRows = data.length;

        fillTable(currentPage);

        console.log('Updated Data:', data);

        document.getElementById('datePicker').setAttribute('dateValue', targetDate);
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }
}

/* 二阶段更改 */
document.addEventListener('DOMContentLoaded', function() {  
    const statusChange = document.getElementById('statusChange');  
    const windowButtonClose = document.getElementById('windowButtonClose');  
    const windowButtonOpen = document.getElementById('windowButtonOpen');  
    const actionLog = document.getElementById('myTable').getElementsByTagName('tbody')[0];  
  
    function logAction(action, reason) {  
        const row = document.createElement('tr');  
        const timeCell = document.createElement('td');  
        const actionCell = document.createElement('td');  
        const reasonCell = document.createElement('td');  
  
        timeCell.textContent = new Date().toLocaleTimeString();  
        actionCell.textContent = action;  
        reasonCell.textContent = reason;  
  
        row.appendChild(timeCell);  
        row.appendChild(actionCell);  
        row.appendChild(reasonCell);  
  
        actionLog.appendChild(row);  
    }  

    function sendActionToServer(action, reason) {
        fetch('http://localhost:5050/log_control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                controlDate: new Date().toISOString().split('T')[0],
                controlTime: new Date().toLocaleTimeString(),
                device: "风扇",
                operation: action,
                controlReason: reason
            })
        }).then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
    }
  
    windowButtonClose.addEventListener('click', function() {
        const action = '关';
        const reason = '系统端更改';
        logAction(action, reason);
        sendActionToServer(action, reason);
    });  
  
    windowButtonOpen.addEventListener('click', function() {  
        const action = '开';
        const reason = '系统端更改';
        logAction(action, reason);
        sendActionToServer(action, reason); 
    });  
});