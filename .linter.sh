#!/bin/bash
cd /home/kavia/workspace/code-generation/stockmaster-pro-115470-daca578e/frontend_stock_portfolio
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

