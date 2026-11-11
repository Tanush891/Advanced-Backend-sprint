
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import functions


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello():
    return {"message": "Warehouse app running successfully"}


# E1 - Get all packages
@app.get("/packages")
def get_packages():

    return functions.get_packages()


# E2 - Get package by ID
@app.get("/packages/{package_id}")
def get_package(package_id: int):

    package = functions.get_package(id=package_id)

    if package is None:
        raise HTTPException(
            status_code=404,
            detail="Package not found."
        )

    return package


# E3 - Add a new package
@app.post("/packages")
def add_package(package_name: str, destination: str, weight: str, arrival_date: str):

    if not package_name.strip():
        raise HTTPException(status_code=422, detail="Package name is required.")

    if not destination.strip():
        raise HTTPException(status_code=422, detail="Destination is required.")

    if not weight.strip():
        raise HTTPException(status_code=422, detail="Weight is required.")

    if not arrival_date.strip():
        raise HTTPException(status_code=422, detail="Arrival date is required.")

    package_id = functions.add_package(
        package_name=package_name,
        destination=destination,
        weight=weight,
        arrival_date=arrival_date
    )

    return {
        "message": "Package added successfully.",
        "id": package_id,
        "status": "pending"
    }
