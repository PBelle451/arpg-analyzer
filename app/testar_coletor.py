import httpx

# Nova URL do poe.ninja
url = "https://poe.ninja/api/data/getbuildoverview"
params = {
    "overview": "Settlers",
    "type": "witch",
    "language": "en",
    "version": "2"
}

response = httpx.get(url, params=params, timeout=10)
print("Status:", response.status_code)
print("Resposta:", response.text[:500])