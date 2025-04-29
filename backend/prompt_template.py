import os

def build_meal_plan_prompt(pantry_str, family_str, preferences_str):
    """
    Loads the Markdown prompt template and fills in the placeholders.
    Args:
        pantry_str (str): Pantry inventory, as a string (or join a list).
        family_str (str): Family members, as a string (or join a list).
        preferences_str (str): Preferences, as a string (or join a list).
    Returns:
        str: The filled prompt.
    """
    with open('prompt_template.md', 'r') as f:
        template = f.read()
    return template.replace(
        "{{pantry}}", pantry_str
    ).replace(
        "{{family}}", family_str
    ).replace(
        "{{preferences}}", preferences_str
    ) 