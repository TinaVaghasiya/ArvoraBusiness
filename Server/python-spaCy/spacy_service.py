import re
import spacy
from flask import Flask, request, jsonify

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

# -----------------------
# KEYWORDS
# -----------------------
COMPANY_KEYWORDS = [
    "pvt.", "ltd.", "limited", "llp", "inc",
    "technologies", "technology", "solutions",
    "systems", "software", "studio", "labs",
    "corp", "company", "services", 
    "corporation", 
]

ADDRESS_KEYWORDS = [
    "road", "street", "st", "rd", "lane", "sector",
    "block", "building", "floor", "area", "near",
    "city", "state", "india", "usa", "uk"
]

# -----------------------
# HELPERS
# -----------------------
def is_email(line):
    return re.search(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", line, re.I)

def is_phone(line):
    return re.search(r"\+?\d[\d -]{8,}\d", line)

def is_website(line):
    return re.search(r"(https?://)?(www\.)?([\w-]+)\.(com|in|org|net|co|io|tech|ai)", line.lower())

def website_to_company(url):
    """Convert www.xyzinfotech.in -> XYZ Infotech"""
    if not url:
        return None
    m = is_website(url)
    if not m:
        return None
    name = m.group(3)  # capture group of main domain
    # Split words by dash/underscore or camel case
    parts = re.findall(r'[A-Z][a-z]*|[a-z]+', name)
    company_name = " ".join(word.capitalize() for word in parts)
    return company_name

def looks_like_address(line):
    l = line.lower()

    if any(k in l for k in ADDRESS_KEYWORDS):
        return True

    if re.search(r"\b\d{5,6}\b", line):
        return True

    if len(re.findall(r"\d+", line)) >= 2:
        return True

    if "," in line:
        return True

    return False

def looks_like_person_name(line):
    words = line.split()

    if not (2 <= len(words) <= 4):
        return False

    for w in words:
        if not w[0].isupper():
            return False
        if any(c.isdigit() for c in w):
            return False

    if any(k in line.lower() for k in COMPANY_KEYWORDS):
        return False

    if looks_like_address(line):
        return False

    return True

# -----------------------
# CORE EXTRACTION
# -----------------------
def extract_card_info(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    name = "Not detected"
    company = "Not detected"
    email = "Not detected"
    phone = "Not detected"

    # EMAIL
    m = re.search(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", text, re.I)
    if m:
        email = m.group()

    # PHONE
    p = re.search(r"\+?\d[\d -]{8,}\d", text)
    if p:
        phone = p.group()

    # -----------------------
    # COMPANY (TOP BLOCK ONLY)
    # -----------------------
    company_lines = []

    for line in lines[:5]:  # check first 5 lines only
        if is_email(line) or is_phone(line) or looks_like_address(line):
            break  # stop at email/phone/address

    company_lines.append(line)  # always include line in company

    if company_lines:
        company = " ".join(company_lines)
    else:
        # fallback to website if company not detected
        for line in lines:
            if is_website(line):
                company = website_to_company(line)
                break

    # -----------------------
    # NAME (AFTER COMPANY)
    # -----------------------
    for line in lines:
        if (
            line in company_lines
            or is_email(line)
            or is_phone(line)
            or looks_like_address(line)
        ):
            continue

        if looks_like_person_name(line):
            name = line
            break

    return {
        "name": name,
        "company": company,
        "email": email,
        "phone": phone
    }

# -----------------------
# API
# -----------------------
@app.route("/scan", methods=["POST"])
def scan():
    data = request.json or {}
    text = data.get("text", "")
    return jsonify(extract_card_info(text))

# -----------------------
# SERVER
# -----------------------
if __name__ == "__main__":
    print("🚀 Card scanner running on port 5000")
    app.run(host="0.0.0.0", port=5000)