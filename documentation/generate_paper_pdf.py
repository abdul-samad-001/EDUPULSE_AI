import os
import re
import subprocess
import mistune

def create_styled_html(md_path, html_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Convert markdown to html using mistune
    markdown = mistune.create_markdown(plugins=['table', 'strikethrough', 'footnotes'])
    html_body = markdown(md_content)

    # Wrap in academic paper HTML template with KaTeX / MathJax and IEEE / Academic CSS
    html_doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EduPulse AI: Research Paper</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        @page {{
            size: A4;
            margin: 20mm 18mm 22mm 18mm;
            @bottom-right {{
                content: counter(page);
                font-family: 'Times New Roman', Times, serif;
                font-size: 9pt;
            }}
        }}

        body {{
            font-family: 'Times New Roman', Times, serif;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #111;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }}

        h1:first-of-type {{
            text-align: center;
            font-size: 19pt;
            font-weight: bold;
            margin-bottom: 8px;
            line-height: 1.25;
            color: #0f172a;
        }}

        /* Author and Affiliation styling */
        p:has(strong):first-of-type, p:nth-of-type(1) {{
            text-align: center;
            font-size: 10.5pt;
            margin-top: 4px;
            margin-bottom: 2px;
        }}

        hr {{
            border: 0;
            border-top: 1px solid #cbd5e1;
            margin: 16px 0;
        }}

        h2 {{
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1.5px solid #0f172a;
            padding-bottom: 3px;
            margin-top: 22px;
            margin-bottom: 10px;
            color: #0f172a;
            page-break-after: avoid;
        }}

        h3 {{
            font-size: 11.5pt;
            font-weight: bold;
            margin-top: 16px;
            margin-bottom: 6px;
            color: #1e293b;
            page-break-after: avoid;
        }}

        h4 {{
            font-size: 10.5pt;
            font-style: italic;
            font-weight: bold;
            margin-top: 12px;
            margin-bottom: 4px;
            color: #334155;
            page-break-after: avoid;
        }}

        p {{
            text-align: justify;
            text-justify: inter-word;
            margin-top: 0;
            margin-bottom: 10px;
        }}

        /* Abstract styling */
        h3:has(+ p):first-of-type, h3:first-of-type {{
            font-style: italic;
        }}

        blockquote {{
            background: #f8fafc;
            border-left: 3px solid #3b82f6;
            margin: 12px 0;
            padding: 8px 14px;
            font-size: 9.5pt;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 14px 0;
            font-size: 9pt;
            page-break-inside: avoid;
        }}

        th, td {{
            border: 1px solid #94a3b8;
            padding: 5px 8px;
            text-align: left;
        }}

        th {{
            background-color: #f1f5f9;
            font-weight: bold;
            color: #0f172a;
        }}

        tr:nth-child(even) {{
            background-color: #f8fafc;
        }}

        code {{
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 9pt;
            background: #f1f5f9;
            padding: 1px 4px;
            border-radius: 3px;
            color: #0f172a;
        }}

        pre {{
            background: #0f172a;
            color: #f8fafc;
            padding: 10px 14px;
            border-radius: 4px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 8.5pt;
            line-height: 1.4;
            overflow-x: auto;
            margin: 12px 0;
            page-break-inside: avoid;
        }}

        pre code {{
            background: transparent;
            color: inherit;
            padding: 0;
        }}

        ul, ol {{
            margin-top: 0;
            margin-bottom: 10px;
            padding-left: 22px;
        }}

        li {{
            margin-bottom: 4px;
            text-align: justify;
        }}

        .math-display {{
            text-align: center;
            margin: 10px 0;
        }}

        @media print {{
            body {{
                font-size: 10pt;
            }}
            a {{
                color: #0f172a;
                text-decoration: none;
            }}
            pre {{
                background: #f8fafc !important;
                color: #0f172a !important;
                border: 1px solid #cbd5e1;
            }}
        }}
    </style>
</head>
<body>
    {html_body}
</body>
</html>
"""
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_doc)
    print(f"HTML created at: {html_path}")

if __name__ == '__main__':
    md_file = r"d:\FINAL YEAR\EDUPULSE_AI_NEW\documentation\EduPulse_AI_Research_Paper.md"
    html_file = r"d:\FINAL YEAR\EDUPULSE_AI_NEW\documentation\EduPulse_AI_Research_Paper.html"
    pdf_file = r"d:\FINAL YEAR\EDUPULSE_AI_NEW\documentation\EduPulse_AI_Research_Paper.pdf"
    
    create_styled_html(md_file, html_file)
    
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_path):
        chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        html_file
    ]
    
    print("Running headless browser to compile PDF...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 0:
        print(f"SUCCESS: PDF generated ({os.path.getsize(pdf_file)} bytes) at: {pdf_file}")
    else:
        print(f"Error generating PDF. Stderr: {result.stderr}")
