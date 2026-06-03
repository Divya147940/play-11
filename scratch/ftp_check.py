import ftplib
import ssl

def test_ftp():
    host = "46.28.45.15"
    user = "u759861691.quzo.in"
    password = "!Uzo@321"
    
    print("Trying plain FTP...")
    try:
        ftp = ftplib.FTP()
        ftp.connect(host, 21, timeout=10)
        ftp.login(user, password)
        ftp.set_pasv(True)
        print("Connected via plain FTP!")
        print("Dirs:")
        ftp.dir()
        ftp.quit()
        return True
    except Exception as e:
        print(f"Plain FTP failed: {e}")

    print("\nTrying FTPS (implicit/explicit)...")
    try:
        ftp = ftplib.FTP_TLS()
        ftp.connect(host, 21, timeout=10)
        ftp.login(user, password)
        ftp.prot_p()
        ftp.set_pasv(True)
        print("Connected via FTPS!")
        print("Dirs:")
        ftp.dir()
        ftp.quit()
        return True
    except Exception as e:
        print(f"FTPS failed: {e}")

if __name__ == "__main__":
    test_ftp()
