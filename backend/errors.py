import ast
import traceback

def analyze_code(code):
    issues = []

    try:
        ast.parse(code)
    except SyntaxError as e:
        return [{
            "type": "SyntaxError",
            "line": e.lineno,
            "message": e.msg
        }]

    try:
        exec(code, {})
    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        last = tb[-1]
        issues.append({
            "type": type(e).__name__,
            "line": last.lineno,
            "message": str(e)
        })

    return issues
