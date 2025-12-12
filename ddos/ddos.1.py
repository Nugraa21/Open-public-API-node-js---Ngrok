import requests
import time
import concurrent.futures
import random
import string

REGISTER_URL = "https://nonlitigious-alene-uninfinitely.ngrok-free.dev/backendapk/register.php"
LOGIN_URL = "https://nonlitigious-alene-uninfinitely.ngrok-free.dev/backendapk/login.php"

MAX_REQUESTS = 100          # batas aman total request per jenis
MAX_WORKERS = 10            # batas aman thread

def random_username():
    return "user_" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))

def test_register(i, stats):
    username = random_username()
    payload = {
        "username": username,
        "nama_lengkap": f"User Test {i}",
        "nip_nisn": "12345",
        "password": "password123",
        "role": "user",
        "is_karyawan": "true"
    }

    start = time.time()
    try:
        r = requests.post(REGISTER_URL, data=payload, timeout=5)
        elapsed = time.time() - start
        stats["register_times"].append(elapsed)

        if r.status_code == 200:
            stats["register_ok"] += 1
        else:
            stats["register_fail"] += 1

        return f"[REGISTER {i}] {r.status_code} {r.text[:80]}"
    except Exception as e:
        elapsed = time.time() - start
        stats["register_times"].append(elapsed)
        stats["register_fail"] += 1
        return f"[REGISTER {i}] ERROR: {e}"

def test_login(i, stats):
    payload = {
        "input": "admin",      # sesuaikan dengan akun yang memang ada
        "password": "admin123" # sesuaikan juga
    }

    start = time.time()
    try:
        r = requests.post(LOGIN_URL, data=payload, timeout=5)
        elapsed = time.time() - start
        stats["login_times"].append(elapsed)

        if r.status_code == 200:
            stats["login_ok"] += 1
        else:
            stats["login_fail"] += 1

        return f"[LOGIN {i}] {r.status_code} {r.text[:80]}"
    except Exception as e:
        elapsed = time.time() - start
        stats["login_times"].append(elapsed)
        stats["login_fail"] += 1
        return f"[LOGIN {i}] ERROR: {e}"

def run_load_test(register_count=20, login_count=20, workers=5, delay=0.1):
    # safety limit biar nggak berubah jadi serangan
    if register_count > MAX_REQUESTS or login_count > MAX_REQUESTS:
        raise ValueError(f"register_count/login_count tidak boleh lebih dari {MAX_REQUESTS}")
    if workers > MAX_WORKERS:
        raise ValueError(f"workers tidak boleh lebih dari {MAX_WORKERS}")

    stats = {
        "register_ok": 0,
        "register_fail": 0,
        "login_ok": 0,
        "login_fail": 0,
        "register_times": [],
        "login_times": []
    }

    print(f"Starting SAFE load test...")
    print(f"Register attempts: {register_count}")
    print(f"Login attempts   : {login_count}")
    print(f"Workers          : {workers}")
    print()

    tasks = []
    start_all = time.time()

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        for i in range(register_count):
            tasks.append(executor.submit(test_register, i+1, stats))
        for i in range(login_count):
            tasks.append(executor.submit(test_login, i+1, stats))

        for f in concurrent.futures.as_completed(tasks):
            print(f.result())
            time.sleep(delay)  # jeda kecil supaya nggak terlalu nabrak

    total_time = time.time() - start_all

    def avg(lst):
        return sum(lst) / len(lst) if lst else 0.0

    print("\n==== SUMMARY ====")
    print(f"Total time        : {total_time:.2f} s")
    print(f"Register OK/Fail  : {stats['register_ok']} / {stats['register_fail']}")
    print(f"Login OK/Fail     : {stats['login_ok']} / {stats['login_fail']}")
    print(f"Avg register time : {avg(stats['register_times']):.3f} s")
    print(f"Avg login time    : {avg(stats['login_times']):.3f} s")

if __name__ == "__main__":
    # angka default masih aman
    run_load_test(register_count=20, login_count=20, workers=5, delay=0.1)
