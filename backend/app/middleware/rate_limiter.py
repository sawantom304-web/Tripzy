import time
import os
from typing import Dict, Tuple
from fastapi import Request
from app.utils.error_handler import AppException

# Simple in-memory fallback rate limiter storage if Redis is unavailable
memory_rate_limit_store: Dict[str, Tuple[int, float]] = {}

async def check_rate_limit(key: str, max_requests: int, window_seconds: int = 60):
    """Checks rate limit for a given identifier key."""
    current_time = time.time()
    
    # Check if redis client can be used
    try:
        import redis.asyncio as redis
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        client = redis.from_url(redis_url, socket_timeout=1.0)
        
        pipeline = client.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, window_seconds)
        results = await pipeline.execute()
        req_count = results[0]
        await client.aclose()
        
        if req_count > max_requests:
            raise AppException(
                code="RATE_LIMIT_EXCEEDED",
                message=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds} seconds.",
                status_code=429
            )
        return
    except (ImportError, Exception):
        # Fallback to in-memory window checking
        if key in memory_rate_limit_store:
            count, start_time = memory_rate_limit_store[key]
            if current_time - start_time < window_seconds:
                if count >= max_requests:
                    raise AppException(
                        code="RATE_LIMIT_EXCEEDED",
                        message=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds} seconds.",
                        status_code=429
                    )
                memory_rate_limit_store[key] = (count + 1, start_time)
            else:
                memory_rate_limit_store[key] = (1, current_time)
        else:
            memory_rate_limit_store[key] = (1, current_time)

def rate_limit_dependency(max_requests: int, window_seconds: int = 60):
    async def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path
        key = f"rate_limit:{path}:{client_ip}"
        await check_rate_limit(key, max_requests, window_seconds)
    return dependency
