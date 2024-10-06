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
      ["2023-04-02 10:00", "开窗", "通风"],  
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
fetchData();
  
var table = document.getElementById("doorLogsTable");  
// 如果tbody不存在，则创建一个并添加到table中  
var tbody = table.getElementsByTagName("tbody")[0] || document.createElement("tbody");  
table.appendChild(tbody); // 确保tbody是table的子元素  
  
  
//获取选择日期
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
  
async function fetchData(){
    try{
        // 读取并解析JSON文件
        const response = await fetch('http://localhost:8080/control.json');
        const jsonData = await response.json();

        // 定义要过滤的内容
        const target = "门";
        // 过滤数据
        const filteredData = jsonData.filter(entry => entry.device === target);

        const newData = filteredData.map(entry => [
            `${entry.controlDate} ${entry.controlTime}`, 
            entry.controlReason,
            "No.1",
            "通过"
        ]);

        data = newData;
        totalRows = data.length;

        fillTable(currentPage);

        console.log('Updated Data:', data);
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }
}