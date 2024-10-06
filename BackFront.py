import json
import hashlib
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import toJSON


app = Flask(__name__)
CORS(app)


@app.route('/login', methods=['POST'])
def login():
    # 获取传来的数据
    data = request.json
    print("data:" + json.dumps(data))
    # 验证用户是否注册 并且 验证密码是否正确
    account = data.get("account")
    password = data.get("password")
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
    # 获取数据
    data = request.json
    cD = data.get("controlDate")
    cT = data.get("controlTime")
    device = data.get("device")
    operation = data.get("operation")
    cR = data.get("controlReason")
    value = f"'{cD}', '{cT}', '{device}', '{operation}', '{cR}'"
    insert_sql = f"INSERT INTO Control (controlDate, controlTime, device, operation, controlReason) VALUES ({value});"
    print(insert_sql)
    insert(insert_sql)
    toJSON.export_table_to_json("control")
    return jsonify({"status": True, "message": "记录窗户控制成功"})


@app.route('/log_collection', methods=['POST'])
def log_collection():
    data = request.json
    now = datetime.now()
    date = now.strftime('%Y-%m-%d')
    time = now.strftime('%H:%M:%S')
    humidity = data.get("Humidity")
    temperature = data.get("Temperature")
    light_intensity = data.get("LightIntensity")
    value = f"'{date}', '{time}', {humidity}, {temperature}, {light_intensity}, 0"
    insert_sql = f"INSERT INTO Collection (collectionDate, collectionTime, wetness, temperature, lightness, COH) VALUES ({value});"
    print(insert_sql)
    insert(insert_sql)
    toJSON.export_table_to_json("collection")
    return jsonify({"status": True, "message": "数据收集成功"})


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
    app.run(host='127.0.0.1', port=5050, debug=True)