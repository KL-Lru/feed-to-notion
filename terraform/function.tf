
resource "google_cloudfunctions_function" "rss-feeding" {
  name    = var.function-name
  project = var.project-id
  region  = var.release-region
  runtime = "nodejs18"
  // maximum timeout
  timeout     = "540"
  entry_point = "main"

  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.sources.name

  environment_variables = {
    DATABASE_ID  = var.notion-database-id
    NOTION_TOKEN = var.notion-token
  }

  event_trigger {
    event_type = "google.pubsub.topic.publish"

    failure_policy {
      retry = "false"
    }

    resource = google_pubsub_topic.feed-read.id
  }

  max_instances = "1"
  min_instances = "0"

  depends_on = [
    google_pubsub_topic.feed-read,
    google_storage_bucket_object.sources,
  ]
}
