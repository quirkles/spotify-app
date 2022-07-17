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

module "redis_network" {
  source = "./modules/network"
}

resource "google_vpc_access_connector" "connector" {
  name          = "vpc-con"
  ip_cidr_range = "10.8.0.0/28"
  network       = module.redis_network.redis_network_id
}

module "kms" {
  source = "./modules/kms"
}

module "redis_instance" {
  source     = "./modules/redis"
  network_id = module.redis_network.redis_network_id
}

module "api_function" {
  source                      = "./modules/function"
  redis_network_vpc_connector = google_vpc_access_connector.connector.id
  redis_host                  = module.redis_instance.redis_host
  redis_port                  = module.redis_instance.redis_port
}
