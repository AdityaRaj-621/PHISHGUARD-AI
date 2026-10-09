import logging
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response

logger = logging.getLogger("phishguard")


def api_exception_handler(exc, context):
    """
    Standardized API exception handler that prevents leak of internal
    tracebacks, SQL, file paths, or sensitive data to clients.
    """
    response = drf_exception_handler(exc, context)
    if response is None:
        # Unhandled 500 error
        path = context["request"].path if context.get("request") else "unknown"
        logger.exception("Unhandled API error at %s", path)
        return Response({"detail": "Something went wrong on our side."}, status=500)

    if response.status_code == 429:
        if isinstance(response.data, dict) and "detail" not in response.data:
            response.data["detail"] = "Too many requests. Try again shortly."

    return response
