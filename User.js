function addUserInfo() {  
    const account = document.getElementById('account').value;  
    const password = document.getElementById('password').value;  
    const confirmPassword = document.getElementById('confirm-password').value;  
    const name = document.getElementById('name').value;  
    const gender = document.getElementById('gender').value;  
    const phoneNo = document.getElementById('phoneNo').value;  
    const permission = document.getElementById('permission').value;  
  
    if (!account.trim() || !password.trim()) {  
        alert('用户名和密码不能为空，请重新输入！');  
        return;  
    }  
  
    if (password !== confirmPassword) {  
        alert('两次输入的密码不一致，请重新输入！');  
        return;  
    }  
  
    if (phoneNo.length !== 11) {  
        alert('手机号必须为11位，请重新输入！');  
        return;  
    }  
  
    const userInfoHtml = `<li>账号: ${account}, 昵称: ${name}, 性别: ${gender}, 手机号: ${phoneNo}, 权限: ${permission}</li>`;  
    document.getElementById('user-list').innerHTML += userInfoHtml;  
  
    fetch('http://localhost:5050/signIn', {  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({  
            account: account,  
            password: password,  
            name: name,  
            gender: gender,  
            phoneNo: phoneNo,  
            permission: permission  
        })  
    })  
    .then(response => response.json())  
    .then(data => {  
        console.log(data.message);  
    })  
    .catch(error => {  
        console.error('Error:', error);  
    });  
  
    document.getElementById('account').value = '';  
    document.getElementById('password').value = '';  
    document.getElementById('confirm-password').value = '';  
    document.getElementById('name').value = '';  
    document.getElementById('gender').value = '';  
    document.getElementById('phoneNo').value = '';  
    document.getElementById('permission').selectedIndex = 0;  
}