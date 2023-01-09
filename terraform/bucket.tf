data "archive_file" "sources" {
  type        = "zip"
  output_path = "source.zip"
  source_dir  = var.source-path
  excludes = [
    // not include terraform
    "terraform",
    // exclude modules
    "node_modules",
    // builded code and package info only
    "src", "webpack.config.js", "tsconfig.json", "feedconf.yml",
  ]
}

resource "google_storage_bucket" "bucket" {
  name          = var.source-bucket
  location      = var.release-region
  storage_class = "STANDARD"
}

resource "google_storage_bucket_object" "sources" {
  name   = "sources/functions.${data.archive_file.sources.output_md5}.zip"
  bucket = google_storage_bucket.bucket.name
  source = data.archive_file.sources.output_path

  depends_on = [
    data.archive_file.sources,
    google_storage_bucket.bucket,
  ]
}
