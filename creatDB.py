import mysql.connector

# 连接到MySQL服务器
conn = mysql.connector.connect(
    host="127.0.0.1",  # MySQL服务器地址
    user="xkc",  # 用户名
    password="!Aa765432127",  # 密码
)

cursor = conn.cursor()

# 创建数据库
database = "smartHome2"
cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database}")
cursor.execute(f"USE {database}")

# 定义表格和属性
tables = {
    "User": [
        "userID INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
        "account INT NOT NULL",
        "password VARCHAR(255) NOT NULL",
        "name VARCHAR(255) NOT NULL",
        "gender VARCHAR(255)",
        "phoneNo VARCHAR(255)",
        "permission VARCHAR(255) NOT NULL"
    ],
    "Control": [
        "controlID INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
        "controlDate DATE NOT NULL",
        "controlTime TIME NOT NULL",
        "device VARCHAR(255) NOT NULL",
        "operation VARCHAR(255) NOT NULL",
        "controlReason VARCHAR(255) NOT NULL",
        "userID INT",
        "FOREIGN KEY (userID) REFERENCES User(userID)"
    ],
    "Photo": [
        "photoID INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
        "photoPath VARCHAR(255) NOT NULL",
        "photoDate DATE NOT NULL",
        "photoTime TIME NOT NULL"
    ],
    "identification": [
        "identificationID INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
        "photoID INT NOT NULL",
        "isHuman TINYINT NOT NULL",
        "isUser TINYINT NOT NULL",
        "isManager TINYINT NOT NULL",
        "userID INT",
        "FOREIGN KEY (photoID) REFERENCES Photo(photoID)",
        "FOREIGN KEY (userID) REFERENCES User(userID)"
    ],
    "collection": [
        "collectionID INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
        "collectionDate DATE NOT NULL",
        "collectionTime TIME NOT NULL",
        "wetness INT NOT NULL",
        "temperature INT NOT NULL",
        "lightness INT NOT NULL",
        "COH INT NOT NULL"
    ]
}

# 创建表格
for table_name, attributes in tables.items():
    attributes_str = ", ".join(attributes)
    cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} ({attributes_str})")

# 提交更改并关闭连接
conn.commit()
cursor.close()
conn.close()
