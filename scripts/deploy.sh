sh ./preDeploy.sh
cd ../terraform || exit
terraform apply -auto-approve
cd ../scripts
