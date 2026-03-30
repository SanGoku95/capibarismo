variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "iamadmin-general"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "capibarismo-survey"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Environment variables for Lambda
variable "mistral_api_key" {
  description = "Mistral API key"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "PostgreSQL database URL (Neon)"
  type        = string
  sensitive   = true
}

variable "auth_token" {
  description = "API authentication token"
  type        = string
  sensitive   = true
}

variable "blob_read_write_token" {
  description = "Vercel Blob storage token (optional)"
  type        = string
  sensitive   = true
  default     = ""
}
