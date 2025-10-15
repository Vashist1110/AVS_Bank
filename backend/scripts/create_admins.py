import sys
import os

# Add parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.model.adminmodel import Admin  # adjust import path if needed

app = create_app()

with app.app_context():
    # Create first admin
    admin1 = Admin(
        username='admin1',
        name='Admin One'
    )
    admin1.set_password('adminpass1')

    # Create second admin
    admin2 = Admin(
        username='admin2',
        name='Admin Two'
    )
    admin2.set_password('adminpass2')

    # Add to DB
    db.session.add(admin1)
    db.session.add(admin2)
    db.session.commit()

    print("Admins created successfully.")
