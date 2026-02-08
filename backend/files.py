import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.join(BASE_DIR, "..", "workspace")

os.makedirs(WORKSPACE_DIR, exist_ok=True)

def create_file(filename):
    path = os.path.join(WORKSPACE_DIR, filename)
    if os.path.exists(path):
        return False
    with open(path, "w") as f:
        f.write("")
    return True

def save_file(filename, content):
    path = os.path.join(WORKSPACE_DIR, filename)
    with open(path, "w") as f:
        f.write(content)
