terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.28.0"
    }
  }
}

provider "google" {
  project     = "spotify-application-356414"
  region      = "us-central1"
  zone        = "us-central1-c"
  credentials = "./keys/tf-sa-key.json"
}

module "kms" {
  source = "./modules/kms"
}

module "api_function" {
  source = "./modules/function"
}
