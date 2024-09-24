import mysql.connector
import random
from datetime import datetime, timedelta

# 连接到MySQL服务器
conn = mysql.connector.connect(
    host="127.0.0.1",  # MySQL服务器地址
    user="xkc",  # 用户名
    password="!Aa765432127",  # 密码
    database="smartHome2"  # 数据库名称
)
cursor = conn.cursor()


# 生成随机测试数据
def generate_control_data(num_records):
    records = []
    for _ in range(num_records):
        controlDate = random.choice(["2024-07-29", "2024-07-30", "2024-07-31"])

        controlTime = (datetime.strptime("08:00", "%H:%M") +
                       timedelta(minutes=random.randint(0, 15 * 60))).strftime("%H:%M")

        device = random.choice(["门", "窗", "风扇", "灯"])
        operation = random.choice(["开", "关"])

        if device == "门":
            controlReason = random.choice(["门禁卡", "人脸识别"])
            userID = random.choice([1, 2, 3])
        elif device == "窗":
            if operation == "关":
                controlReason = random.choice(["语音控制", "智能雨控", "系统端设置"])
            else:
                controlReason = random.choice(["语音控制", "系统端设置"])
            userID = random.choice([1, 2, 3]) if controlReason == "系统端设置" else None
        elif device == "风扇":
            controlReason = random.choice(["语音控制", "智能控制", "系统端设置"])
            userID = random.choice([1, 2, 3]) if controlReason == "系统端设置" else None
        elif device == "灯":
            controlReason = random.choice(["智能控制", "系统端设置"])
            userID = random.choice([1, 2, 3]) if controlReason == "系统端设置" else None

        records.append((controlDate, controlTime, device, operation, controlReason, userID))

    return records


# 插入数据到Control表
num_records = 100  # 你可以根据需要调整生成的记录数量
control_data = generate_control_data(num_records)

insert_query = """
    INSERT INTO Control (controlDate, controlTime, device, operation, controlReason, userID)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

cursor.executemany(insert_query, control_data)

# 提交更改并关闭连接
conn.commit()
cursor.close()
conn.close()
