document.getElementById('loginForm').addEventListener('submit', async function(event) {  
    event.preventDefault();  
  
    var account = document.getElementById('account').value;  
    var password = document.getElementById('password').value;

    var ispassed = await checkUser(account, password);

    // 假设用户名和密码验证正确  
    if (ispassed) {  
        // 清除错误信息并跳转到新页面  
        document.getElementById('errorMessage').textContent = '登录成功';
        window.location.href = 'Smart Home.html'; // 跳转到dashboard页面  
    } else {  
        document.getElementById('errorMessage').textContent = '该用户不存在 或 密码错误';  
    }  
});

// 定义一个异步函数，用于获取JSON数据
async function checkUser(account, password){
    try {
        const response = await fetch('http://localhost:5050/login', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify({  
                account: account,  
                password: password,
            })  
        })
        const jsonData = await response.json();

        // 获取 status 字段
        const status = jsonData.status;
        console.log('Status:', status);

        return status;
    } catch (error) {
        console.error('Error fetching customer data:', error);
        return false;
    }
}