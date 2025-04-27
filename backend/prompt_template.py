import os

def build_meal_plan_prompt(pantry, family, preferences, template_path=None):
    """
    Loads the Markdown prompt template and fills in the placeholders.
    Args:
        pantry (str): Pantry inventory, as a string (or join a list).
        family (str): Family members, as a string (or join a list).
        preferences (str): Preferences, as a string (or join a list).
        template_path (str): Optional path to the template file.
    Returns:
        str: The filled prompt.
    """
    if template_path is None:
        template_path = os.path.join(os.path.dirname(__file__), "prompt_template.md")
    with open(template_path, "r") as f:
        template = f.read()
    prompt = (
        template
        .replace("{{pantry}}", pantry)
        .replace("{{family}}", family)
        .replace("{{preferences}}", preferences)
    )
    return prompt 