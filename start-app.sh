#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🚀 Starting Smart Directory on http://localhost:5175..."
./node_modules/.bin/vite preview --port 5175 --host
