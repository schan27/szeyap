import os

for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d != ".venv"]
    for fname in files:
        fpath = os.path.join(root, fname)
        try:
            with open(fpath, encoding="utf-8") as f:
                f.read()
        except (UnicodeDecodeError, PermissionError):
            pass
        except Exception as e:
            print(f"{fpath} -> {e}")
        else:
            continue
        # re-try to confirm it's an encoding issue
        try:
            with open(fpath, "rb") as f:
                data = f.read()
            data.decode("utf-8")
        except UnicodeDecodeError as e:
            print(f"BAD FILE: {fpath} -> {e}")