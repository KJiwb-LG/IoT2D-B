document.getElementById('registerButton').addEventListener('click', function(event) {  
    // 可以在这里添加验证逻辑  
    var password = document.getElementById('password').value;  
    var confirmPassword = document.getElementById('confirmPassword').value;  
  
    if (password !== confirmPassword) {  
        event.preventDefault(); // 阻止表单提交  
        document.getElementById('errorMessage').textContent = '密码和确认密码不匹配！';  
        document.getElementById('errorMessage').style.display = 'block'; // 假设你需要在CSS中设置.error的默认display为none  
    } else {  
        // 如果密码匹配，可以选择清除错误信息（如果需要的话）  
        document.getElementById('errorMessage').textContent = '';  
        document.getElementById('errorMessage').style.display = 'none';  
        // 在这里可以添加更多逻辑，比如发送数据到服务器  
        // 直接跳转到Login.html  
        window.location.href = 'Login.html';  
    }  
  
    
});  