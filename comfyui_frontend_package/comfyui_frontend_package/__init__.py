from importlib.metadata import version, PackageNotFoundError

try:
    __version__ = version("hanzo_studio_frontend_package")
except PackageNotFoundError:
    __version__ = "unknown"
