import subprocess
import sys
from pathlib import Path

WORKSPACE = Path("workspace")
WORKSPACE.mkdir(exist_ok=True)

def run_code(filename: str, code: str):
    file_path = WORKSPACE / filename

    try:
        file_path.write_text(code, encoding="utf-8")

        result = subprocess.run(
            [sys.executable, str(file_path)],
            capture_output=True,
            text=True,
            timeout=5
        )

        return {
            "stdout": result.stdout,
            "stderr": result.stderr
        }

    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": "Execution timed out"
        }

    except Exception as e:
        return {
            "stdout": "",
            "stderr": str(e)
        }
