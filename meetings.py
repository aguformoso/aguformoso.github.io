import requests
import csv
from bs4 import BeautifulSoup
import time

base = "https://eventos.lacnic.net/ev4/attendees-public?id=lacnic{}"
meetings = range(1, 44)  # 1 to 43
output_file = "lacnic_attendees_1_43.csv"

with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["meeting_number", "name", "organization", "country"])

    for m in meetings:
        url = base.format(m)
        print(f"Fetching {url}...")
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
        except Exception as e:
            print(f"Failed for {url}: {e}")
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        rows = soup.select("table tr")[1:]  # skip header

        if not rows:
            print(f"No data found for meeting {m}")
            continue

        for row in rows:
            cols = [td.get_text(strip=True) for td in row.find_all("td")]
            if len(cols) >= 3:
                name = cols[0]
                org  = cols[1]
                country = cols[-1]  # typically the last one
                writer.writerow([m, name, org, country])

        time.sleep(1)  # be polite to server

print(f"CSV written to {output_file}")
