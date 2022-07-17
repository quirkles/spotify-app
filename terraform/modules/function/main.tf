resource "google_storage_bucket" "api-function-bucket" {
  name     = "api-function-bucket"
  location = "US"
}

resource "google_storage_bucket_object" "archive" {
  name   = "index.zip#${filemd5("./fn.zip")}"
  bucket = google_storage_bucket.api-function-bucket.name
  source = "./fn.zip"
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
  vpc_connector = var.redis_network_vpc_connector
  vpc_connector_egress_settings = "PRIVATE_RANGES_ONLY"
  environment_variables = {
    REDIS_HOST = var.redis_host
    REDIS_PORT = var.redis_port
    REDIRECT_URI = "https://us-central1-spotify-application-356414.cloudfunctions.net/spotify-api/oauth_callback"
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
