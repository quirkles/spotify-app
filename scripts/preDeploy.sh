sh ./decryptSecrets.sh
cd ..
if [ -d "./dist" ]
then
    echo "Dist directory already exists. Clearing."
    rm -rf dist
fi

npm run compile-ts

#if [ -d "./fn" ]
#then
#    echo "Function directory already exists. Clearing."
#    rm -rf fn
#fi
#mkdir fn
#npm run bundle-dist

cp package.json ./dist

if [ -d "./fn.zip" ]
then
    echo "Function zipfile exists. Deleting"
    rm fn.zip
fi



zip -r fn.zip dist
zip fn.zip package.json


mv -f fn.zip terraform/
