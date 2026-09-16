import subprocess
import re
import sys
import os
import time
import webbrowser

# Ensure UTF-8 output even in standard Windows Command Prompt
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def start_tunnel():
    print("=====================================================================")
    print("      COLOAI-POLYP PLATFORM - CLOUDFLARE LIVE TUNNEL LAUNCHER")
    print("=====================================================================")
    print("[*] Connecting to Cloudflare edge network...")

    log_path = os.path.abspath("tunnel.log")
    if os.path.exists(log_path):
        try:
            os.remove(log_path)
        except Exception:
            pass

    cmd = [os.path.abspath("cloudflared.exe"), "tunnel", "--url", "http://localhost:5173", "--logfile", log_path]
    
    proc = subprocess.Popen(cmd)
    
    url_found = None
    url_pattern = re.compile(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com")
    
    # Poll log file for up to 30 seconds
    for _ in range(60):
        time.sleep(0.5)
        if os.path.exists(log_path):
            try:
                with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    match = url_pattern.search(content)
                    if match:
                        url_found = match.group(0)
                        break
            except Exception:
                pass
                
    if url_found:
        print("\n" + "=" * 70)
        print("  >>> SUCCESS: YOUR LIVE PUBLIC HTTPS LINK IS ACTIVE! <<<")
        print("=" * 70)
        print(f"\n   LIVE URL: {url_found}\n")
        print("=" * 70)
        
        # Save to LIVE_URL.txt
        try:
            with open("LIVE_URL.txt", "w", encoding="utf-8") as f:
                f.write(f"{url_found}\n")
            print("[+] Saved URL to LIVE_URL.txt")
        except Exception as e:
            print(f"[!] Could not write LIVE_URL.txt: {e}")
            
        # Copy to Windows clipboard
        try:
            subprocess.run("clip", input=url_found, text=True, check=True)
            print("[+] Copied URL to your Windows clipboard!")
        except Exception:
            pass

        # Open in browser
        try:
            webbrowser.open(url_found)
            print("[+] Opened live URL in your default browser!")
        except Exception:
            pass

        print("\n" + "-" * 70)
        print("  IMPORTANT NOTICE:")
        print("  1. KEEP THIS WINDOW OPEN to maintain your public connection.")
        print("  2. If you close this window, the public URL goes offline.")
        print("  3. Free trycloudflare.com links change every time you restart.")
        print("-" * 70 + "\n")
        
        try:
            proc.wait()
        except KeyboardInterrupt:
            proc.terminate()
    else:
        print("[!] Could not get Cloudflare Tunnel URL within 30 seconds.")
        print("[!] Check tunnel.log for error details.")
        proc.terminate()

if __name__ == "__main__":
    start_tunnel()
