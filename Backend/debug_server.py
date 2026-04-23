#!/usr/bin/env python
"""Start server in foreground to see errors."""

import uvicorn

if __name__ == "__main__":
    print("Starting server...")
    uvicorn.run(
        "app.main:app", host="0.0.0.0", port=3001, reload=False, log_level="debug"
    )
