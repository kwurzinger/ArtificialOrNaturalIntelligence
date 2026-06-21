#!/bin/sh
set -eu

: "${BASE_URL:?BASE_URL is required}"
: "${API_PORT:?API_PORT is required}"

FRONTEND_LAST_LEVEL="${FRONTEND_LAST_LEVEL:-5}"
FRONTEND_MAX_QUESTIONS_PER_LEVEL="${FRONTEND_MAX_QUESTIONS_PER_LEVEL:-2}"
FRONTEND_HINTS_ENABLED="${FRONTEND_HINTS_ENABLED:-true}"

case "$FRONTEND_HINTS_ENABLED" in
  true|false) ;;
  *)
    echo "FRONTEND_HINTS_ENABLED must be true or false"
    exit 1
    ;;
esac

cat > /usr/share/nginx/html/assets/app-config.json <<EOF
{
  "backendURL": "${BASE_URL}:${API_PORT}",
  "lastLevel": ${FRONTEND_LAST_LEVEL},
  "maxQuestionsPerLevel": ${FRONTEND_MAX_QUESTIONS_PER_LEVEL},
  "hintsEnabled": ${FRONTEND_HINTS_ENABLED}
}
EOF

exec nginx -g "daemon off;"