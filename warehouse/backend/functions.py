
from sqlalchemy import Integer, String, Column, create_engine
from sqlalchemy.orm import Session, declarative_base


DB_PATH = "warehouse.db"
engine = create_engine(f"sqlite:///{DB_PATH}")
Base = declarative_base()


class packages(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True)
    package_name = Column(String)
    destination = Column(String)
    weight = Column(String)
    arrival_date = Column(String)
    status = Column(String, default="pending")


Base.metadata.create_all(engine)


# Add a new package
def add_package(package_name, destination, weight, arrival_date):

    with Session(engine) as session:

        new_package = packages(
            package_name=package_name,
            destination=destination,
            weight=weight,
            arrival_date=arrival_date,
            status="pending"
        )

        session.add(new_package)
        session.commit()

        return new_package.id


# Get all packages
def get_packages():

    with Session(engine) as session:
        return session.query(packages).all()


# Get one package
def get_package(id):

    with Session(engine) as session:
        return session.query(packages).filter(
            packages.id == id
        ).first()
