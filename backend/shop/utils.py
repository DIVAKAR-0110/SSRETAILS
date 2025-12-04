import json

def get_data(request):
    """
    Utility function to parse JSON data from request body.
    Returns decoded JSON data as Python dict.
    """
    try:
        return json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return {}


