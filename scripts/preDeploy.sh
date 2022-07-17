sh ./decryptSecrets.sh
cd ..
if [ -d "./dist" ]
then
    echo "Dist directory already exists. Clearing."
    rm -rf dist
fi

npm run compile-ts

cp package.json ./dist

if [ -d "./fn.zip" ]
then
    echo "Function zipfile exists. Deleting"
    rm fn.zip
fi



zip -r fn.zip dist
zip fn.zip package.json


mv -f fn.zip terraform/
