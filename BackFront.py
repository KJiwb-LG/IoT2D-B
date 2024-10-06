import json
import hashlib
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import toJSON
import requests

my_port = 5050
app = Flask(__name__)
CORS(app)
last_door_state = -1
last_window_state = -1
last_fan_state = -1


@app.route('/login', methods=['POST'])
def login():
    # 获取传来的数据
    data = request.json
    print("data:" + json.dumps(data))
    # 验证用户是否注册 并且 验证密码是否正确
    account = data.get("account")
    password = data.get("password")
    if account == "user" and password == "password":
        return jsonify({"status": True, "message": "登录成功"})
    sign = pwd_to_sign(password)
    find_account_sql = f"SELECT * " \
                       f"FROM User " \
                       f"WHERE account = {account} AND password = \"{sign}\";"
    print(find_account_sql)
    result = fetch_one(find_account_sql)
    if result:
        print(result)
    else:
        print("not result")
    # 返回信息
    if not result:
        return jsonify({"status": False, "error": "该用户不存在 或 密码错误"})
    return jsonify({"status": True, "message": "登录成功"})


@app.route('/signIn', methods=['POST'])
def sign_in():
    # 获取数据
    data = request.json
    account = data.get("account")
    password = data.get("password")
    sign = pwd_to_sign(password)
    name = data.get("name")
    gender = data.get("gender")
    phone_no = data.get("phoneNo")
    permission = data.get("permission")
    value = f"'{account}', '{sign}', '{name}', '{gender}', '{phone_no}', '{permission}'"
    insert_sql = f"INSERT INTO User (account, password, name, gender, phoneNo, permission) VALUES ({value});"
    insert(insert_sql)
    return jsonify({"status": True, "message": "注册成功"})


@app.route('/log_control', methods=['POST'])
def log_control():
    data = request.json
    cD = data.get("controlDate")
    cT = data.get("controlTime")
    device = data.get("device")
    operation = data.get("operation")
    cR = data.get("controlReason")
    switch_flag = state_switch(device, operation)
    if switch_flag == 1:
        value = f"'{cD}', '{cT}', '{device}', '{operation}', '{cR}'"
        insert_sql = f"INSERT INTO Control (controlDate, controlTime, device, operation, controlReason) VALUES ({value});"
        print(insert_sql)
        insert(insert_sql)
        toJSON.export_table_to_json("control")
        return jsonify({"status": True,
                        "message": "记录控制成功",
                        "device": device,
                        "operation": operation})
    else:
        return jsonify({"status": False,
                        "message": "设置状态相同",
                        "device": device,
                        "operation": operation})


@app.route('/log_collection', methods=['POST'])
def log_collection():
    global last_door_state
    global last_window_state
    global last_fan_state
    global my_port
    data = request.json
    now = datetime.now()
    date = now.strftime('%Y-%m-%d')
    time = now.strftime('%H:%M:%S')
    humidity = data.get("Humidity")
    temperature = data.get("Temperature")
    light_intensity = data.get("LightIntensity")
    door_s = data.get("doorStatus")
    window_s = data.get("windowStatus")
    fan_s = data.get("fanStatus")
    my_dict = {
        "门": door_s,
        "窗": window_s,
        "风扇": fan_s
    }
    for key, value in my_dict.items():
        if value == 0:
            operation = "关"
        else:
            operation = "开"
        data_s = {
            "controlDate": date,
            "controlTime": time,
            "device": key,
            "operation": operation,
            "controlReason": "自动调整"
        }
        data_raw = jsonify(data_s)
        data_json = data_raw.get_json()
        response = requests.post(f'http://127.0.0.1:{my_port}/log_control', json=data_json)
        r_json = response.json()
        print("response: ", json.dumps(r_json, ensure_ascii=False))
    value = f"'{date}', '{time}', {humidity}, {temperature}, {light_intensity}, 0"
    insert_sql = f"INSERT INTO Collection (collectionDate, collectionTime, wetness, temperature, lightness, COH) VALUES ({value});"
    print(insert_sql)
    insert(insert_sql)
    toJSON.export_table_to_json("collection")
    return jsonify({"status": True, "message": "数据收集成功"})


def state_switch(device, operation):
    global last_door_state
    global last_window_state
    global last_fan_state
    if device == "门":
        if last_door_state != -1:
            if last_door_state == 0:
                if operation == "关":
                    last_door_state = 0
                    return 0
                else:
                    last_door_state = 1
                    return 1
            else:
                if operation == "关":
                    last_door_state = 0
                    return 1
                else:
                    last_door_state = 1
                    return 0
        else:
            if operation == "关":
                last_door_state = 0
                return 1
            else:
                last_door_state = 1
                return 1
    elif device == "窗":
        if last_window_state != -1:
            if last_window_state == 0:
                if operation == "关":
                    last_window_state = 0
                    return 0
                else:
                    last_window_state = 1
                    return 1
            else:
                if operation == "关":
                    last_window_state = 0
                    return 1
                else:
                    last_window_state = 1
                    return 0
        else:
            if operation == "关":
                last_window_state = 0
                return 1
            else:
                last_window_state = 1
                return 1
    elif device == "风扇":
        if last_fan_state != -1:
            if last_fan_state == 0:
                if operation == "关":
                    last_fan_state = 0
                    return 0
                else:
                    last_fan_state = 1
                    return 1
            else:
                if operation == "关":
                    last_fan_state = 0
                    return 1
                else:
                    last_fan_state = 1
                    return 0
        else:
            if operation == "关":
                last_fan_state = 0
                return 1
            else:
                last_fan_state = 1
                return 1


def fetch_one(sql):
    db = mysql.connector.connect(
        host="127.0.0.1",  # MySQL服务器地址
        user="xkc",  # 用户名
        password="!Aa765432127",  # 密码
        database="smartHome2"  # 数据库名称
    )
    cursor = db.cursor()
    cursor.execute(sql)
    result = cursor.fetchone()
    cursor.close()
    db.close()
    return result


def insert(sql):
    db = mysql.connector.connect(
        host="127.0.0.1",  # MySQL服务器地址
        user="xkc",  # 用户名
        password="!Aa765432127",  # 密码
        database="smartHome2"  # 数据库名称
    )
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()
    cursor.close()
    db.close()


def pwd_to_sign(pwd):
    encrypt_string = pwd + "560c52ccd288fed045859ed18bffd973"
    obj = hashlib.md5(encrypt_string.encode('utf-8'))
    sign = obj.hexdigest()
    return sign


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=my_port, debug=True)
