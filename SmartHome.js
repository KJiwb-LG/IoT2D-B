var slideIndex = 1;  
showSlides(slideIndex);  
  
var slideShowInterval = setInterval(function() {  
  plusSlides(1);  
}, 4000); // 每3秒切换到下一张幻灯片  

function plusSlides(n) {  
  showSlides(slideIndex += n);  
  if (n > 0 && slideIndex === slides.length) {  
    slideIndex = 1;  
    showSlides(slideIndex);  
} 
}  
  
function currentSlide(n) {  
  showSlides(slideIndex = n);  
}  
  
function showSlides(n) {  
  var i;  
  var slides = document.getElementsByClassName("mySlides");  
  var dots = document.getElementsByClassName("dot");  
  if (n > slides.length) {slideIndex = 1}  
  if (n < 1) {slideIndex = slides.length}  
  for (i = 0; i < slides.length; i++) {  
      slides[i].style.display = "none";  
  }  
  for (i = 0; i < dots.length; i++) {  
      dots[i].className = dots[i].className.replace(" active", "");  
  }  
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";  
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
  var currentLightElement = document.getElementById('currentTime');  

  // 更新内容，将时间添加到原始内容前面  
  currentLightElement.innerHTML = "当前时间:" + timeString;  
}  

// 每隔一秒调用updateTime函数  
setInterval(updateTime, 1000);  


//新增功能显示当前各元件状态
function updateStatus() {  
  document.querySelector('#windowcurrent .status').textContent = '窗户已关闭';  
  document.querySelector('#lightcurrent .status').textContent = '灯光开启,红色';  
  document.querySelector('#tempcurrent .status').textContent = '34℃,23';  
  document.querySelector('#fancurrent .status').textContent = '风扇已开启';  
  // 更新其他部分的状态  
}  

// 假设在某个事件或定时器中调用这个函数  
updateStatus();