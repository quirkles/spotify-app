resource "google_kms_key_ring" "keyring" {
    name     = "spotify-app-keyring"
    location = "global"
}

resource "google_kms_crypto_key" "example-key" {
    name            = "first-key"
    key_ring        = google_kms_key_ring.keyring.id

    lifecycle {
        prevent_destroy = true
    }
}
