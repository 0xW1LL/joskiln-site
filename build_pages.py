# One-off generator: builds the inner pages with the same header/footer as index.html
import re

src = open('index.html').read()

header = src[src.find('<a class="skip-link"'):src.find('<main id="main">')]
footer = src[src.find('<!-- ================= FOOTER'):src.find('</body>')]

head_tpl = '''<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Nunito+Sans:wght@400;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
'''

def build(fname, title, desc, active, content):
    h = header.replace(' aria-current="page"', '')
    if active:
        h = h.replace(f'<a href="{active}">', f'<a href="{active}" aria-current="page">')
    page = head_tpl.format(title=title, desc=desc) + h + '<main id="main">\n' + content + '\n  </main>\n\n  ' + footer + '</body>\n</html>\n'
    open(fname, 'w').write(page)
    print('built', fname, len(page))

import pages_content as P
build('whats-on.html', "What's On — classes & workshops at Jo's Kiln, Westbourne",
      "Weekly pottery classes, one-off workshops and seasonal makes in Westbourne, Bournemouth. See dates, prices and spaces, and book online or by phone.",
      'whats-on.html', P.WHATS_ON)
build('baby-prints.html', "Bespoke Baby Prints — Jo's Kiln, Westbourne",
      "Bespoke ceramic baby hand and footprints and raised 3D casts, glazed and fired in Westbourne. From £35, ready in about three weeks, posted anywhere in the UK.",
      'baby-prints.html', P.BABY)
build('around-the-kiln.html', "Around the Kiln — community & Kiln Club memberships",
      "The studio's noticeboard, its bragging shelf, and the Kiln Club: monthly bench time, wheels and firing for independent potters in Westbourne.",
      'around-the-kiln.html', P.KILN)
build('find-us.html', "Find Us — Jo's Kiln, 79 Poole Road, Westbourne",
      "Jo's Kiln is at 79 Poole Road in the heart of Westbourne village, Bournemouth — step-free, dog-friendly, and fifteen minutes' walk from Alum Chine beach.",
      'find-us.html', P.FIND)
build('privacy.html', "Privacy — Jo's Kiln",
      "How Jo's Kiln handles the details you share through this website.",
      None, P.PRIVACY)
build('404.html', "Page not found — Jo's Kiln",
      "That page seems to have wandered off to the kiln room.",
      None, P.NOTFOUND)
