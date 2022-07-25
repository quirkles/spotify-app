gcloud kms encrypt --key=first-key --keyring=spotify-app-keyring --location=global --plaintext-file=../src/secrets.ts --ciphertext-file=../src/secrets.enc
