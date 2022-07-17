sh ./decryptSecrets.sh
cd ..
if [ -d "./dist" ]
then
    echo "Dist directory already exists. Clearing."
    rm -rf dist
fi

npm run compile-ts

cp package.json ./dist
