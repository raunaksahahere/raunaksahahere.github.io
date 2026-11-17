"""Fetch Medium's public RSS into a same-origin snapshot; no proxy or API key.

Uses only Python's standard library. --input accepts a saved feed for local checks.
"""

import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

PROFILE = "https://medium.com/@raunaksaha22"
FEED = "https://medium.com/feed/@raunaksaha22"
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "medium-posts.json"


def safe_url(value):
    parts = urlsplit(value or "")
    host = parts.hostname or ""
    allowed = host in {"medium.com", "www.medium.com"} or host.endswith(".medium.com")
    if parts.scheme != "https" or not allowed or parts.username or parts.password:
        return None
    return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))


class StoryHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.thumbnail = None
        self.paragraphs = []
        self.paragraph = None
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {"script", "style"}:
            self.skip += 1
        if tag == "img" and not self.thumbnail:
            self.thumbnail = safe_url(attrs.get("src"))
        if tag == "p":
            self.paragraph = []

    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.skip = max(0, self.skip - 1)
        if tag == "p" and self.paragraph is not None:
            self.paragraphs.append(" ".join("".join(self.paragraph).split()))
            self.paragraph = None

    def handle_data(self, data):
        if self.skip:
            return
        if self.paragraph is not None:
            self.paragraph.append(data)


def parse_feed(xml):
    root = ET.fromstring(xml)
    channel = root.find("channel")
    if root.tag != "rss" or channel is None:
        raise ValueError("The response is not a Medium RSS feed")
    posts = []
    seen = set()
    for item in channel.findall("item"):
        url = safe_url(item.findtext("link"))
        title = " ".join((item.findtext("title") or "").split())
        if not url or not title or url in seen:
            continue
        published = parsedate_to_datetime(item.findtext("pubDate") or "")
        if published.tzinfo is None:
            published = published.replace(tzinfo=timezone.utc)
        content = StoryHTML()
        content.feed(item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded")
                     or item.findtext("description") or "")
        # Skip short subtitle paragraphs. Keep a plain-text preview, never raw HTML.
        excerpt = next((p for p in content.paragraphs if len(p) >= 100), "")
        if not excerpt:
            excerpt = next(iter(content.paragraphs), "")
        if len(excerpt) > 240:
            excerpt = excerpt[:237].rsplit(" ", 1)[0] + "…"
        tags = [re.sub(r"[-_]", " ", c.text or "").strip() for c in item.findall("category")]
        posts.append({
            "title": title,
            "url": url,
            "publishedAt": published.astimezone(timezone.utc).isoformat(),
            "excerpt": excerpt,
            "thumbnail": content.thumbnail,
            "tags": [t for t in tags if t][:3],
        })
        seen.add(url)
    posts.sort(key=lambda p: p["publishedAt"], reverse=True)
    return {
        "profileUrl": PROFILE,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "posts": posts,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, help="Read a saved RSS file instead of the network")
    args = parser.parse_args()
    try:
        if args.input:
            xml = args.input.read_bytes()
        else:
            request = Request(FEED, headers={"User-Agent": "RaunakPortfolio/1.0", "Accept": "application/rss+xml, text/xml"})
            with urlopen(request, timeout=20) as response:
                xml = response.read(5_000_001)
            if len(xml) > 5_000_000:
                raise ValueError("RSS response exceeds 5 MB")
        snapshot = parse_feed(xml)
        if OUTPUT.exists():
            try:
                previous = json.loads(OUTPUT.read_text())
            except (ValueError, OSError):
                previous = {}
            if previous.get("profileUrl") == PROFILE and previous.get("posts") == snapshot["posts"]:
                print(f"Medium: checked {len(snapshot['posts'])} article(s); no changes")
                return
        temporary = OUTPUT.with_suffix(".tmp")
        temporary.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
        temporary.replace(OUTPUT)
        print(f"Medium: refreshed {len(snapshot['posts'])} article(s) from {PROFILE}")
    except Exception as error:
        if OUTPUT.exists():
            saved = json.loads(OUTPUT.read_text())
            if isinstance(saved.get("posts"), list):
                print(f"Medium: refresh failed ({error}); keeping snapshot from {saved.get('fetchedAt', 'previous build')}", file=sys.stderr)
                return
        raise


if __name__ == "__main__":
    main()
