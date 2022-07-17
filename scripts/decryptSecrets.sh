gcloud kms decrypt --key=first-key --keyring=spotify-app-keyring --location=global --plaintext-file=../src/secrets.ts --ciphertext-file=../src/secrets.enc
gcloud kms decrypt --key=first-key --keyring=spotify-app-keyring --location=global --plaintext-file=../terraform/keys/tf-sa-key.json --ciphertext-file=../terraform/keys/tf-sa-key.enc
