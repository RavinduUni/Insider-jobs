#!/usr/bin/env bash
# ============================================================
#  start-local.sh  -  Freelancing Platform Dev Launcher
#  Starts the Express backend (port 5000) and the Vite/React
#  frontend (port 5173) in parallel from the project root.
#
#  Usage:
#    chmod +x start-local.sh   (first time only)
#    ./start-local.sh
#
#  Requirements: Node.js, npm, nodemon (installed in server/)
# ============================================================

set -e

# --- Colour helpers ------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
RESET='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

# --- Banner --------------------------------------------------
echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}${BOLD}║     🚀  Freelancing Platform  -  Dev Mode    ║${RESET}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════╝${RESET}"
echo ""

# --- Pre-flight checks ---------------------------------------
if [ ! -d "$SERVER_DIR/node_modules" ]; then
  echo -e "${YELLOW}[server]${RESET} node_modules not found - running npm install..."
  npm install --prefix "$SERVER_DIR"
fi

if [ ! -d "$CLIENT_DIR/node_modules" ]; then
  echo -e "${YELLOW}[client]${RESET} node_modules not found - running npm install..."
  npm install --prefix "$CLIENT_DIR"
fi

# --- Cleanup on exit (Ctrl+C) --------------------------------
SERVER_PID=""
CLIENT_PID=""

cleanup() {
  echo ""
  echo -e "${YELLOW}${BOLD}  Shutting down both servers...${RESET}"
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null && echo -e "${RED}[server]${RESET} stopped."
  [ -n "$CLIENT_PID" ] && kill "$CLIENT_PID" 2>/dev/null && echo -e "${RED}[client]${RESET} stopped."
  echo -e "${CYAN}${BOLD}  All done. Goodbye!${RESET}"
  exit 0
}

trap cleanup SIGINT SIGTERM

# --- Start Express backend -----------------------------------
echo -e "${GREEN}[server]${RESET} Starting Express backend on http://localhost:5000 ..."
cd "$SERVER_DIR"
npm start 2>&1 | sed "s/^/$(printf '\033[0;32m')[server]$(printf '\033[0m') /" &
SERVER_PID=$!

# --- Start Vite / React frontend -----------------------------
echo -e "${CYAN}[client]${RESET} Starting Vite/React frontend on http://localhost:5173 ..."
cd "$CLIENT_DIR"
npm run dev 2>&1 | sed "s/^/$(printf '\033[0;36m')[client]$(printf '\033[0m') /" &
CLIENT_PID=$!

echo ""
echo -e "${BOLD}Both servers are running!${RESET}"
echo -e "  ${GREEN}o${RESET} Backend  -> http://localhost:5000"
echo -e "  ${CYAN}o${RESET} Frontend -> http://localhost:5173"
echo -e "${YELLOW}Press Ctrl+C to stop both.${RESET}"
echo ""

# --- Wait for both processes ---------------------------------
wait $SERVER_PID $CLIENT_PID
