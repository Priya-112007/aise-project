import logging
import os
import sys

def setup_logger(name="TrustFed", level=logging.INFO):
    """Configure structured logger printing to console and file."""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    if not logger.handlers:
        # Console Handler
        c_handler = logging.StreamHandler(sys.stdout)
        c_handler.setLevel(level)
        c_format = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        c_handler.setFormatter(c_format)
        logger.addHandler(c_handler)
        
        # File Handler
        log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
        os.makedirs(log_dir, exist_ok=True)
        f_handler = logging.FileHandler(os.path.join(log_dir, "trustfed.log"))
        f_handler.setLevel(level)
        f_handler.setFormatter(c_format)
        logger.addHandler(f_handler)
        
    return logger

logger = setup_logger()
