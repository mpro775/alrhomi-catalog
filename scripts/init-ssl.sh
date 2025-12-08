#!/bin/bash

# ===========================================
# SSL Initialization Script for m-dowaid.pro
# Run this script on first deployment to get SSL certificates
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===========================================
SSL Certificate Setup Script
===========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}.env file not found! Please create it from env.example first.${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$CERTBOT_EMAIL" ]; then
    echo -e "${YELLOW}CERTBOT_EMAIL not set in .env${NC}"
    read -p "Enter your email for SSL certificate: " CERTBOT_EMAIL
fi

DOMAINS="-d m-dowaid.pro -d api.m-dowaid.pro"

echo -e "${YELLOW}Step 1: Creating required directories...${NC}"
mkdir -p certbot/www certbot/conf

echo -e "${YELLOW}Step 2: Backing up current nginx config...${NC}"
cp nginx/conf.d/default.conf nginx/conf.d/default.conf.ssl-backup 2>/dev/null || true

echo -e "${YELLOW}Step 3: Using initial config (HTTP only)...${NC}"
cp nginx/conf.d/default.conf.initial nginx/conf.d/default.conf

echo -e "${YELLOW}Step 4: Building and starting services...${NC}"
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}Step 5: Waiting for services to start...${NC}"
sleep 10

echo -e "${YELLOW}Step 6: Obtaining SSL certificates...${NC}"
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $CERTBOT_EMAIL \
    --agree-tos \
    --no-eff-email \
    $DOMAINS

echo -e "${YELLOW}Step 7: Restoring full SSL nginx config...${NC}"
cp nginx/conf.d/default.conf.ssl-backup nginx/conf.d/default.conf 2>/dev/null || \
    echo -e "${RED}Warning: Could not restore SSL config. Please manually update nginx/conf.d/default.conf${NC}"

echo -e "${YELLOW}Step 8: Restarting nginx with SSL...${NC}"
docker compose -f docker-compose.prod.yml restart nginx

echo -e "${GREEN}===========================================
SSL Setup Complete!
===========================================${NC}"
echo -e "Your sites should now be accessible at:"
echo -e "  - ${GREEN}https://m-dowaid.pro${NC}"
echo -e "  - ${GREEN}https://api.m-dowaid.pro${NC}"
echo ""
echo -e "To check the status:"
echo -e "  docker compose -f docker-compose.prod.yml ps"
echo ""
echo -e "To view logs:"
echo -e "  docker compose -f docker-compose.prod.yml logs -f"

