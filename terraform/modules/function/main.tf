locals {
  timestamp = formatdate("YYMMDDhhmmss", timestamp())
}

resource "google_storage_bucket" "api-function-bucket" {
  name     = "api-function-bucket"
  location = "US"
}

data "archive_file" "source" {
  type        = "zip"
  source_dir  = "../dist"
  output_path = "/tmp/function-${local.timestamp}.zip"
}

resource "google_storage_bucket_object" "archive" {
  name   = "index.zip#${data.archive_file.source.output_md5}"
  bucket = google_storage_bucket.api-function-bucket.name
  source = data.archive_file.source.output_path
}

resource "google_cloudfunctions_function" "api-function" {
  name        = "spotify-api"
  description = "Spotify api"
  runtime     = "nodejs16"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.api-function-bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  entry_point           = "main"
  environment_variables = {
    REDIRECT_URI = "https://us-central1-spotify-application-356414.cloudfunctions.net/spotify-api/oauth_callback"
    FRONT_END_HOST = "https://spotify-frontend-wgvygz45ba-pd.a.run.app"
    IS_CLOUD = "1"
  }
  timeout = 540
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.api-function.project
  region         = google_cloudfunctions_function.api-function.region
  cloud_function = google_cloudfunctions_function.api-function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
