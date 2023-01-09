resource "google_pubsub_topic" "feed-read" {
  name    = var.topic-name
  project = var.project-id
}
