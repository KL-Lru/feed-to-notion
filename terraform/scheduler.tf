resource "google_cloud_scheduler_job" "feeding" {
  name    = "rss-feeding"
  paused  = "false"
  project = var.project-id

  pubsub_target {
    data       = "Ig=="
    topic_name = google_pubsub_topic.feed-read.id
  }

  region = var.release-region

  retry_config {
    max_backoff_duration = "3600s"
    max_doublings        = "5"
    max_retry_duration   = "0s"
    min_backoff_duration = "1200s"
    retry_count          = "0"
  }

  // execute every day
  schedule  = "0 0 */1 * *"
  time_zone = "Asia/Tokyo"

  depends_on = [
    google_pubsub_topic.feed-read
  ]
}
