import asyncio
import aiohttp
from pathlib import Path

BASE_URL = "https://datasets.imdbws.com/"

FILES = [
    "title.basics.tsv.gz",
    "title.crew.tsv.gz",
    "name.basics.tsv.gz",
    "title.ratings.tsv.gz"
]

DOWNLOAD_DIR = Path("./data")
DOWNLOAD_DIR.mkdir(exist_ok=True)


async def download_file(session, filename):
    url = f"{BASE_URL}/{filename}"
    dest = DOWNLOAD_DIR / filename

    async with session.get(url) as resp:
        resp.raise_for_status()
        with open(dest, "wb") as f:
            async for chunk in resp.content.iter_chunked(1024 * 1024):
                f.write(chunk)

    print(f"✅ Downloaded {filename}")


async def main():
    timeout = aiohttp.ClientTimeout(total=None)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        for filename in FILES:
            await download_file(session, filename)


if __name__ == "__main__":
    asyncio.run(main())