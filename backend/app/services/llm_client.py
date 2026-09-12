from typing import Protocol

from pydantic import BaseModel


class LLMClient(Protocol):
    def generate_structured(self, system_prompt: str, user_prompt: str, output_schema: type[BaseModel]) -> BaseModel:
        ...


class MockLLMClient:
    """Deterministic stand-in until a real provider is configured."""

    def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        output_schema: type[BaseModel],
    ) -> BaseModel:
        _ = (system_prompt, user_prompt)
        return output_schema.model_validate({})
