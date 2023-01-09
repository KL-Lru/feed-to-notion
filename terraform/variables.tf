variable "project-id" {
  type        = string
  description = "Project used to run the Cloud Function"
}

variable "function-name" {
  type        = string
  default     = "rss-feedings"
  description = "Name of Cloud Function"
}

variable "release-region" {
  type        = string
  default     = "asia-northeast1"
  description = "Region used to deploy Cloud Function"
}

variable "source-bucket" {
  type        = string
  description = "Bucket used to store source codes"
}

variable "source-path" {
  type        = string
  default     = "../"
  description = "Path to release code."
}

variable "topic-name" {
  type        = string
  default     = "feed-read"
  description = "Topic used to fire function"
}

variable "notion-token" {
  type        = string
  description = "Token for call Notion API"
}

variable "notion-database-id" {
  type        = string
  description = "Feeding store"
}
