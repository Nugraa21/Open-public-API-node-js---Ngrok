import requests
import time
import concurrent.futures

URL = "https://nonlitigious-alene-uninfinitely.ngrok-free.dev/backendapk/update_user.php"

# Data dummy untuk test
payload = {
    "id": "1",
    "nama_lengkap": "asd",
    "username": "sda",
    "password": "123456"
}

def send_request(i):
    try:
        r = requests.post(URL, data=payload, timeout=5)
        return f"[{i}] Status: {r.status_code} | Response: {r.text[:60]}"
    except Exception as e:
        return f"[{i}] ERROR: {e}"

def run_load_test(workers=10, total_requests=50):
    print(f"Starting safe load test with {workers} workers, {total_requests} requests...\n")

    start = time.time()

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(send_request, i) for i in range(1, total_requests + 1)]
        for future in concurrent.futures.as_completed(futures):
            print(future.result())

    print("\nLoad test selesai dalam", round(time.time() - start, 2), "detik")

if __name__ == "__main__":
    # 10 thread, 50 request → aman, bukan DDoS
    run_load_test(workers=10, total_requests=50)
