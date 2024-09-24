import mysql.connector
import json
import os
from datetime import date, datetime, timedelta

# 连接到MySQL服务器
conn = mysql.connector.connect(
    host="127.0.0.1",  # MySQL服务器地址
    user="xkc",  # 用户名
    password="!Aa765432127",  # 密码
    database="smartHome2"  # 数据库名称
)
cursor = conn.cursor()

# 获取所有表格名称
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()


# 将日期和时间对象转换为字符串
def default_converter(o):
    if isinstance(o, (datetime, date)):
        return o.isoformat()
    elif isinstance(o, timedelta):
        return str(o)
    raise TypeError(f"Object of type {o.__class__.__name__} is not JSON serializable")


# 导出表格数据为JSON
def export_table_to_json(table_name):
    conn = mysql.connector.connect(
        host="127.0.0.1",  # MySQL服务器地址
        user="xkc",  # 用户名
        password="!Aa765432127",  # 密码
        database="smartHome2"  # 数据库名称
    )
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    # 获取列名
    cursor.execute(f"DESCRIBE {table_name}")
    columns = [column[0] for column in cursor.fetchall()]

    # 构建字典
    data = [dict(zip(columns, row)) for row in rows]

    # 保存为JSON文件
    with open(f"{table_name}.json", "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4, default=default_converter)


# 导出所有表格
for (table_name,) in tables:
    export_table_to_json(table_name)

# 关闭连接
cursor.close()
conn.close()
