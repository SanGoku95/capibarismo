# AWS Lambda Deployment with Terraform

Deploy the Survey Extractor API to AWS Lambda using Terraform.

## Prerequisites

- **AWS CLI** configured with profile `iamadmin-general`
- **Terraform** >= 1.0
- **Node.js** 20+
- **pnpm** package manager
- Valid `.env` file with all required variables

## Cost Optimization

This deployment uses minimal-cost AWS services:

- **Lambda**: 1M requests/month free tier, then $0.20 per 1M requests
- **API Gateway HTTP API**: $1.00 per million requests (cheaper than REST API)
- **CloudWatch Logs**: 7-day retention (minimal cost)
- **No VPC**: Avoids NAT Gateway costs ($0.045/hour ≈ $32/month)

**Estimated monthly cost**: $0-5 for low-moderate traffic

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Ensure your `.env` file has all required variables:

```bash
MISTRAL_API_KEY=your-key
OPENAI_API_KEY=your-key
DATABASE_URL=postgresql://...
AUTH_TOKEN=your-token
BLOB_READ_WRITE_TOKEN=your-token  # Optional
```

### 3. Deploy

```bash
# One command to deploy everything
npm run deploy
```

This command will:
1. Generate `terraform.tfvars` from `.env`
2. Build the Lambda package
3. Apply Terraform changes

## Manual Deployment Steps

If you prefer to run steps separately:

```bash
# 1. Generate Terraform variables from .env
npm run tf:vars

# 2. Build Lambda package
npm run tf:build

# 3. Initialize Terraform (first time only)
npm run tf:init

# 4. Preview changes
npm run tf:plan

# 5. Apply changes
npm run tf:apply
```

## Architecture

```
┌─────────────────┐
│   API Gateway   │ ← HTTP API (cheaper than REST)
│   (HTTP API)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Lambda Function│
│   (Node 20.x)   │
│   1GB Memory    │
│   60s Timeout   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Neon Database  │
│  (PostgreSQL)   │
└─────────────────┘
```

## Resources Created

- **Lambda Function**: Runs the Express API
- **API Gateway HTTP API**: Exposes HTTP endpoints
- **IAM Role**: Lambda execution role
- **CloudWatch Log Groups**: For Lambda and API Gateway logs (7-day retention)

## Environment Variables

Lambda function receives these environment variables:

- `NODE_ENV=production`
- `MISTRAL_API_KEY` (from .env)
- `OPENAI_API_KEY` (from .env)
- `DATABASE_URL` (from .env)
- `AUTH_TOKEN` (from .env)
- `BLOB_READ_WRITE_TOKEN` (from .env, optional)

## Outputs

After deployment, Terraform outputs:

- `api_endpoint`: Your API base URL
- `lambda_function_name`: Lambda function name
- `lambda_function_arn`: Lambda ARN
- `cloudwatch_log_group`: Log group name

Example:
```
api_endpoint = "https://abc123.execute-api.us-east-1.amazonaws.com"
```

## Usage

Once deployed, use the API endpoint:

```bash
# Health check
curl https://YOUR_API_ENDPOINT/health

# List surveys (public)
curl https://YOUR_API_ENDPOINT/api/surveys

# Process survey (authenticated)
curl -X POST https://YOUR_API_ENDPOINT/api/surveys/ipsos/process \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/survey.pdf"}'
```

## Monitoring

View Lambda logs:

```bash
aws logs tail /aws/lambda/capibarismo-survey-api --follow --profile iamadmin-general
```

View API Gateway logs:

```bash
aws logs tail /aws/apigateway/capibarismo-survey --follow --profile iamadmin-general
```

## Updating

To update the Lambda function after code changes:

```bash
npm run deploy
```

Terraform will detect changes and update only what's necessary.

## Destroying

To tear down all AWS resources:

```bash
npm run tf:destroy
```

⚠️ **Warning**: This will delete all resources. Make sure you have backups if needed.

## Troubleshooting

### Lambda timeout

If processing large PDFs causes timeouts, increase the timeout in `lambda.tf`:

```hcl
timeout = 120  # Increase to 2 minutes
```

### Out of memory

If Lambda runs out of memory, increase memory in `lambda.tf`:

```hcl
memory_size = 2048  # Increase to 2GB
```

### Cold starts

Lambda cold starts may take 2-5 seconds. For consistently fast response times, consider:
- Using Lambda Provisioned Concurrency (costs more)
- Keeping the package size small
- Optimizing dependencies

### Authentication errors

If you get 401/403 errors:
1. Verify `AUTH_TOKEN` matches between `.env` and your requests
2. Check CloudWatch logs for error details

## Security Notes

- ⚠️ **Never commit** `terraform.tfvars` - it contains secrets
- ⚠️ **Never commit** `.env` files
- ✅ All secrets are passed as environment variables
- ✅ CORS is configured (adjust in `api-gateway.tf` if needed)
- ✅ CloudWatch logs have 7-day retention

## Support

For issues or questions:
- Check CloudWatch logs first
- Review Terraform plan before applying
- Test locally with `npm run dev` before deploying
