import ftplib

def test_connection():
    host = "46.28.45.15"
    user = "u759861691.quzo.in"
    password = "!Uzo@321"
    
    print(f"Connecting to secure FTPS on {host}...")
    try:
        ftp = ftplib.FTP_TLS()
        ftp.connect(host, 21, timeout=10)
        ftp.login(user, password)
        ftp.prot_p() # secure data connection
        print("Successfully connected and logged in via FTPS!")
        print("Directory list:")
        ftp.dir()
        ftp.quit()
    except Exception as e:
        print(f"FTPS Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
