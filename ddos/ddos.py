import requests
import time
import concurrent.futures
import random
import string

REGISTER_URL = "https://nonlitigious-alene-uninfinitely.ngrok-free.dev/backendapk/register.php"
LOGIN_URL = "https://nonlitigious-alene-uninfinitely.ngrok-free.dev/backendapk/login.php"

# buat username random biar tidak bentrok
def random_username():
    return "user_" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))

def test_register(i):
    username = random_username()
    payload = {
        "username": username,
        "nama_lengkap": f"User Test {i}",
        "nip_nisn": "12345",
        "password": "password123",
        "role": "user",
        "is_karyawan": "true"
    }
    try:
        r = requests.post(REGISTER_URL, data=payload, timeout=5)
        return f"[REGISTER {i}] {r.text[:80]}"
    except Exception as e:
        return f"[REGISTER {i}] ERROR: {e}"

def test_login(i):
    payload = {
        "input": "admin",
        "password": "admin123"
    }
    try:
        r = requests.post(LOGIN_URL, data=payload, timeout=5)
        return f"[LOGIN {i}] {r.text[:80]}"
    except Exception as e:
        return f"[LOGIN {i}] ERROR: {e}"

def run_load_test(register_count=10, login_count=10):
    print(f"Starting safe test...")
    print(f"Register attempts: {register_count}")
    print(f"Login attempts: {login_count}\n")

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = []

        for i in range(register_count):
            futures.append(executor.submit(test_register, i))
        
        for i in range(login_count):
            futures.append(executor.submit(test_login, i))

        for f in concurrent.futures.as_completed(futures):
            print(f.result())
            time.sleep(0.2)  # jeda biar aman

    print("\nTest selesai.")

if __name__ == "__main__":
    run_load_test(register_count=10, login_count=10)
