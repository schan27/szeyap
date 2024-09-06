
import logging

class CustomFormatter(logging.Formatter):
    """Logging colored formatter, adapted from https://stackoverflow.com/a/56944256/3638629"""

    grey = '\x1b[38;21m'
    blue = '\x1b[38;5;39m'
    yellow = '\x1b[38;5;226m'
    red = '\x1b[38;5;196m'
    bold_red = '\x1b[31;1m'
    reset = '\x1b[0m'

    def __init__(self):
        super().__init__()
        self.FORMATS = {
            logging.DEBUG: self.grey + '%(levelname)-10s' + self.reset + '%(message)s',
            logging.INFO: self.blue + '%(levelname)-10s' + self.reset + '%(message)s',
            logging.WARNING: self.yellow + '%(levelname)-10s' + self.reset + '%(message)s',
            logging.ERROR: self.red + '%(levelname)-10s' + self.reset + '%(message)s',
            logging.CRITICAL: self.bold_red + '%(levelname)-10s' + self.reset + '%(message)s'
        }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)

def configure_logger(name="szeyapapi"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    stdout_handler = logging.StreamHandler()
    stdout_handler.setLevel(logging.INFO)
    stdout_handler.setFormatter(CustomFormatter())

    logger.handlers.clear()
    logger.addHandler(stdout_handler)
    logger.propagate = False
    logger.info("Logger configured")
