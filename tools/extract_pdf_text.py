import sys
import os

def ensure_pypdf():
    try:
        from pypdf import PdfReader  # type: ignore
        return
    except Exception:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])

def ensure_pdfminer():
    try:
        import pdfminer
        return
    except Exception:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pdfminer.six"])

def extract(pdf_path, out_txt):
    # First try pypdf extraction (fast). If it fails, fall back to pdfminer.
    parts = []
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        for p in reader.pages:
            try:
                t = p.extract_text()
            except Exception:
                t = None
            if t:
                parts.append(t)
        if parts:
            pass
        else:
            raise RuntimeError("pypdf extracted no text; falling back")
    except Exception:
        # fallback to pdfminer.six
        ensure_pdfminer()
        from pdfminer.high_level import extract_text
        txt = extract_text(pdf_path)
        if txt:
            parts = [txt]
    os.makedirs(os.path.dirname(out_txt), exist_ok=True)
    with open(out_txt, "w", encoding="utf-8") as f:
        f.write("\n\n".join(parts))

def main():
    if len(sys.argv) < 3:
        print("Usage: extract_pdf_text.py <pdf-path> <out-txt>")
        sys.exit(2)
    pdf = sys.argv[1]
    out = sys.argv[2]
    ensure_pypdf()
    extract(pdf, out)
    print(f"Wrote extracted text to: {out}")

if __name__ == '__main__':
    main()
