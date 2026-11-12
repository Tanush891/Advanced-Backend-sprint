
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

import functions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# E1 - Register Package
@app.post("/packages")
def register_package(name: str, destination: str, weight: int, token=Header(None)):

    username = functions.verify_token(token=token)

    if not username:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    return functions.register_package(
        name=name,
        destination=destination,
        weight=weight
    )


# E2 - Get Package Details
@app.get("/packages/{package_id}")
def get_package_details(package_id: int, token=Header(None)):

    username = functions.verify_token(token=token)

    if not username:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    return functions.get_package_by_id(package_id=package_id)


# E3 - Update Package Details
@app.patch("/packages/{package_id}")
def update_package_details(
    package_id: int,
    name: str = None,
    destination: str = None,
    weight: str = None,
    token=Header(None)
):

    username = functions.verify_token(token=token)

    if not username:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    return functions.update_package_details(
        package_id=package_id,
        name=name,
        destination=destination,
        weight=weight
    )


# E4 - Delete Package
@app.delete("/packages/{package_id}")
def delete_package(package_id: int, token=Header(None)):

    username = functions.verify_token(token=token)

    if not username:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    return functions.delete_package(package_id=package_id)


# E5 - Search Packages
@app.get("/packages")
def search_package(
    destination: str = None,
    status: str = None,
    arrival_date: str = None,
    token=Header(None)
):

    username = functions.verify_token(token=token)

    if not username:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    return functions.search_package(
        destination=destination,
        status=status,
        arrival_date=arrival_date
    )


# Login
@app.post("/login")
def login(username: str, password: str):

    tokens = functions.verify_login(
        username=username,
        password=password
    )

    if tokens is False:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    return tokens


# Refresh Token
@app.post("/refresh")
def refresh(refresh_token=Header(None)):

    username = functions.verify_token(
        token=refresh_token,
        token_type="refresh"
    )

    if not username:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token."
        )

    new_access_token = functions.create_token(
        username=username,
        token_type="access"
    )

    return {"access_token": new_access_token}
