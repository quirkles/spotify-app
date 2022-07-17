resource "google_redis_instance" "cache" {
  name           = "ha-memory-cache"
  tier           = "BASIC"
  memory_size_gb = 1

  location_id             = "us-central1-a"

  authorized_network = var.network_id

  redis_version     = "REDIS_4_0"
  display_name      = "Terraform Test Instance"
  reserved_ip_range = "192.168.0.0/29"
}


