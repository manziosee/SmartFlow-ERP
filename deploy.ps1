# SmartFlow ERP Polyglot Deployment Script
# This script deploys the 3 backend services and configures their interconnection.

Write-Host "--- Starting SmartFlow ERP Polyglot Deployment ---" -ForegroundColor Cyan

# 1. Ensure apps are created
Write-Host "1. Initializing Apps on Fly.io..." -ForegroundColor Yellow
flyctl apps create smartflow-erp-java --org personal 2>$null
flyctl apps create smartflow-erp-ai --org personal 2>$null
flyctl apps create smartflow-erp-rules --org personal 2>$null

# 2. Set Upstash Redis (Interactive - Follow prompts)
Write-Host "2. Setting up Upstash Redis (Please interact with the terminal)..." -ForegroundColor Yellow
flyctl redis create --name smartflow-redis --org personal --region gru --plan Pay-as-you-go --no-replicas --disable-eviction

# 3. Set Secrets for Java App
Write-Host "3. Configuring Java Backend Secrets..." -ForegroundColor Yellow
flyctl secrets set `
    DB_URL="jdbc:postgresql://ep-flat-rain-a4n7febx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" `
    DB_USER="neondb_owner" `
    DB_PASSWORD="npg_xlMSFzL3THY8" `
    SECONDARY_DB_URL="jdbc:dbeaver:libsql://smartflow-erp-oseemanzi.aws-us-east-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY4MDA4NTcsImlkIjoiMDE5ZGIxOGUtY2YwMS03Yjc1LTliMDgtNTU4MDcxN2E4YjMyIiwicmlkIjoiODdkN2ZmMGYtODU0MS00MzRmLWFmOTYtNDRlYjBlODFlNTdmIn0.GTNf17aj4qBa_Ww2TrL3XDrBgLs30L2Z0Puj0naFVToI3YtxIZU8HndSBOOrIy_Lg9yeLZtOFGHrtlzyv2AKCA" `
    TURSO_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY4MDA4NTcsImlkIjoiMDE5ZGIxOGUtY2YwMS03Yjc1LTliMDgtNTU4MDcxN2E4YjMyIiwicmlkIjoiODdkN2ZmMGYtODU0MS00MzRmLWFmOTYtNDRlYjBlODFlNTdmIn0.GTNf17aj4qBa_Ww2TrL3XDrBgLs30L2Z0Puj0naFVToI3YtxIZU8HndSBOOrIy_Lg9yeLZtOFGHrtlzyv2AKCA" `
    JWT_SECRET="4eb53509b5ce4398bc360ac511736412f83737bffe83a54b321151bd4c845bc2" `
    AI_SERVICE_URL="https://smartflow-erp-ai.fly.dev/api/v1/ai" `
    RULES_SERVICE_URL="https://smartflow-erp-rules.fly.dev/api/v1/rules" `
    --app smartflow-erp-java

# 4. Set Secrets for Clojure App
Write-Host "4. Configuring Clojure Engine Secrets..." -ForegroundColor Yellow
flyctl secrets set AI_SERVICE_URL="https://smartflow-erp-ai.fly.dev/api/v1/ai" --app smartflow-erp-rules

# 5. Deploy Apps
Write-Host "5. Deploying AI Service (Python)..." -ForegroundColor Yellow
Set-Location erp-ai
flyctl deploy --ha=false --remote-only
Set-Location ..

Write-Host "6. Deploying Rules Engine (Clojure)..." -ForegroundColor Yellow
Set-Location erp-rules
flyctl deploy --ha=false --remote-only
Set-Location ..

Write-Host "7. Deploying Core Backend (Java)..." -ForegroundColor Yellow
Set-Location erp
flyctl deploy --ha=false --remote-only
Set-Location ..

Write-Host "--- Deployment Complete! ---" -ForegroundColor Green
Write-Host "Java Core: https://smartflow-erp-java.fly.dev"
Write-Host "Health: https://smartflow-erp-java.fly.dev/health"
Write-Host "Swagger: https://smartflow-erp-java.fly.dev/swagger-ui.html"
Write-Host "AI Docs: https://smartflow-erp-ai.fly.dev/docs"
