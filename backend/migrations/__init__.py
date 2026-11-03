import os
import importlib

def run_all_migrations():
    migrations_dir = os.path.dirname(os.path.abspath(__file__))

    for f in os.listdir(migrations_dir):
        if f.endswith(".py") and f != "__init__.py":
            module = importlib.import_module(f"migrations.{f[:-3]}")
            if hasattr(module, "run_migration"):
                module.run_migration()