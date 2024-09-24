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
def generate_collection_data(start_date, end_date):
    records = []
    current_time = datetime.strptime("08:00", "%H:%M")
    end_time = datetime.strptime("22:00", "%H:%M")

    date_list = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]

    for collection_date in date_list:
        while current_time <= end_time:
            collectionDate = collection_date.strftime("%Y-%m-%d")
            collectionTime = current_time.strftime("%H:%M")

            wetness = random.randint(40, 60)
            temperature = random.randint(25, 35)
            lightness = random.randint(50, 600)
            COH = random.randint(0, 100)

            records.append((collectionDate, collectionTime, wetness, temperature, lightness, COH))

            current_time += timedelta(minutes=2)
        current_time = datetime.strptime("08:00", "%H:%M")  # 重置为08:00

    return records


# 定义采集数据的日期范围
start_date = datetime.strptime("2024-07-29", "%Y-%m-%d")
end_date = datetime.strptime("2024-07-31", "%Y-%m-%d")

# 生成数据
collection_data = generate_collection_data(start_date, end_date)

# 插入数据到collection表
insert_query = """
    INSERT INTO collection (collectionDate, collectionTime, wetness, temperature, lightness, COH)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

cursor.executemany(insert_query, collection_data)

# 提交更改并关闭连接
conn.commit()
cursor.close()
conn.close()
