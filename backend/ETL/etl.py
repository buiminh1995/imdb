import asyncio
import asyncpg
from pathlib import Path

# DB_CONFIG = {
#     "user": "postgres",
#     "password": "password",
#     "database": "imdb",
#     "host": "localhost",
#     "port": 5432,
# }

FILES = {
    "titles": Path("/data/title.basics.csv"),
    "ratings": Path("/data/title.ratings.csv"),
    "people": Path("/data/name.basics.csv"),
}

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


async def load_csv(conn, table_name: str, file_path: Path):
    await conn.copy_to_table(
        table_name,
        source=file_path,
        format="csv",
        header=True,
    )


async def main():
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        async with conn.transaction():
            # 1. Clear staging tables
            await conn.execute("""
                TRUNCATE
                    titles_staging,
                    ratings_staging,
                    people_staging;
            """)

            # 2. Load CSVs into staging
            await load_csv(conn, "titles_staging", FILES["titles"])
            await load_csv(conn, "ratings_staging", FILES["ratings"])
            await load_csv(conn, "people_staging", FILES["people"])

            # 3. Swap data atomically
            await conn.execute("""
                TRUNCATE titles, ratings, people;

                INSERT INTO titles  SELECT * FROM titles_staging;
                INSERT INTO ratings SELECT * FROM ratings_staging;
                INSERT INTO people  SELECT * FROM people_staging;
            """)

        print("IMDb data updated atomically")

    except Exception as e:
        print("❌ Update failed — transaction rolled back")
        raise

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())