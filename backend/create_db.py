import psycopg2

def create_database():
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='postgres',
            host='127.0.0.1',
            port='5432'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE brazil_db;")
        print("Database 'brazil_db' created successfully!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Database creation status: {e}")

if __name__ == '__main__':
    create_database()
