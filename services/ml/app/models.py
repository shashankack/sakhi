from typing import Literal

from pydantic import BaseModel, Field

Locale = Literal["auto", "en", "hi", "kn"]
Urgency = Literal["routine", "soon", "urgent"]
Engine = Literal["template", "local_llm", "hybrid"]
Language = Literal["en", "hi", "kn"]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AnalyzeRequest(BaseModel):
    message: str = Field(min_length=3, max_length=4000)
    history: list[ChatMessage] | None = None
    locale: Locale = "auto"


class ThemeCard(BaseModel):
    id: str
    title: str
    summary: str
    pcos_context: str
    overlap: str


class CareBlock(BaseModel):
    urgency: Urgency
    summary: str
    questions: list[str]


class SourceRef(BaseModel):
    title: str
    section: str


class RedFlag(BaseModel):
    id: str
    label: str
    guidance: str


class AnalyzeResponse(BaseModel):
    reply: str
    language: Language
    themes: list[ThemeCard]
    care: CareBlock
    sources: list[SourceRef]
    red_flags: list[RedFlag]
    disclaimer: str
    engine: Engine
