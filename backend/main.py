from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from runner import run_code
from ai import explain_code, explain_errors, improve_code
from errors import analyze_code

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RunRequest(BaseModel):
    filename: str
    code: str

class CodeRequest(BaseModel):
    code: str

@app.post("/run")
def run(data: RunRequest):
    return run_code(data.filename, data.code)

@app.post("/explain")
def explain(data: CodeRequest):
    return {
        "explanation": explain_code(data.code)
    }

@app.post("/errors")
def errors(data: CodeRequest):
    issues = analyze_code(data.code)

    if not issues:
        return {
            "issues": [],
            "explanation": "No errors found."
        }

    explanation = explain_errors(data.code, issues)
    return {
        "issues": issues,
        "explanation": explanation
    }

@app.post("/improve")
def improve(data: CodeRequest):
    return improve_code(data.code)
