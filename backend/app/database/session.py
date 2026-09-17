import os
import ssl
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.database.base import Base
import app.models  # Ensure all models are registered with Base.metadata


load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/roamiq"
)

# Convert sync URL to async format if needed
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Detect Supabase pooler (port 6543) which uses PgBouncer transaction mode
is_supabase_pooler = "pooler.supabase.com" in DATABASE_URL

try:
    if "sqlite" in DATABASE_URL:
        engine = create_async_engine(DATABASE_URL, echo=False, future=True)
    elif is_supabase_pooler:
        # Supabase Connection Pooler requires:
        # - statement_cache_size=0 (PgBouncer in transaction mode disallows prepared statements)
        # - SSL for remote connections
        engine = create_async_engine(
            DATABASE_URL,
            echo=False,
            future=True,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            connect_args={
                "statement_cache_size": 0,
                "ssl": "require"
            }
        )
    else:
        engine = create_async_engine(
            DATABASE_URL,
            echo=False,
            future=True,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )
except Exception as e:
    print(f"[DB Notice] Primary engine failed ({e}), falling back to SQLite")
    DATABASE_URL = "sqlite+aiosqlite:///./roamiq.db"
    engine = create_async_engine(DATABASE_URL, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db():
    """Dependency that provides an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """Create tables if needed (for initial dev setups)."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[DB] Schema initialization complete.")
    except Exception as e:
        print(f"[DB Notice] Engine schema initialization: {e}")
