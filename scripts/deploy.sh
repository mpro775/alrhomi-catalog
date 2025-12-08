#!/bin/bash

# ===========================================
# Deployment Script for alrhomi-catalog
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}===========================================
Alrhomi Catalog Deployment Script
===========================================${NC}"

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}.env file not found!${NC}"
    echo -e "Please create .env from env.example:"
    echo -e "  cp env.example .env"
    echo -e "  nano .env"
    exit 1
fi

# Function to show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       Build and start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  rebuild     Rebuild and restart all services"
    echo "  logs        Show logs (follow mode)"
    echo "  status      Show service status"
    echo "  update      Pull updates and rebuild"
    echo "  ssl-renew   Renew SSL certificates"
    echo "  cleanup     Clean up unused Docker resources"
    echo ""
}

case "$1" in
    start)
        echo -e "${YELLOW}Building and starting services...${NC}"
        docker compose -f docker-compose.prod.yml build
        docker compose -f docker-compose.prod.yml up -d
        echo -e "${GREEN}Services started!${NC}"
        docker compose -f docker-compose.prod.yml ps
        ;;
    
    stop)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker compose -f docker-compose.prod.yml down
        echo -e "${GREEN}Services stopped!${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}Restarting services...${NC}"
        docker compose -f docker-compose.prod.yml restart
        echo -e "${GREEN}Services restarted!${NC}"
        ;;
    
    rebuild)
        echo -e "${YELLOW}Rebuilding and restarting services...${NC}"
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml build --no-cache
        docker compose -f docker-compose.prod.yml up -d
        echo -e "${GREEN}Services rebuilt and started!${NC}"
        ;;
    
    logs)
        echo -e "${YELLOW}Showing logs (Ctrl+C to exit)...${NC}"
        docker compose -f docker-compose.prod.yml logs -f
        ;;
    
    status)
        echo -e "${YELLOW}Service Status:${NC}"
        docker compose -f docker-compose.prod.yml ps
        echo ""
        echo -e "${YELLOW}Resource Usage:${NC}"
        docker stats --no-stream
        ;;
    
    update)
        echo -e "${YELLOW}Pulling updates...${NC}"
        git pull 2>/dev/null || echo "Not a git repository, skipping git pull"
        echo -e "${YELLOW}Rebuilding services...${NC}"
        docker compose -f docker-compose.prod.yml build --no-cache
        docker compose -f docker-compose.prod.yml up -d
        echo -e "${GREEN}Update complete!${NC}"
        ;;
    
    ssl-renew)
        echo -e "${YELLOW}Renewing SSL certificates...${NC}"
        docker compose -f docker-compose.prod.yml run --rm certbot renew
        docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
        echo -e "${GREEN}SSL renewal complete!${NC}"
        ;;
    
    cleanup)
        echo -e "${YELLOW}Cleaning up unused Docker resources...${NC}"
        docker system prune -af
        docker volume prune -f
        echo -e "${GREEN}Cleanup complete!${NC}"
        ;;
    
    *)
        usage
        ;;
esac

