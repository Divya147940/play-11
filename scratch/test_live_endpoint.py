import urllib.request
import urllib.error
import json

def test_endpoint():
    url = "https://quzo.in/api/vouchers/my-vouchers?cb=123"
    print(f"Requesting {url}...")
    try:
        response = urllib.request.urlopen(url)
        print(f"Status Code: {response.getcode()}")
        print(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error Code: {e.code}")
        try:
            print(e.read().decode('utf-8'))
        except Exception:
            pass
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_endpoint()
