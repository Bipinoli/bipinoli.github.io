async function fetchData(collection) {
    let toResolve = null;
    let toReject = null;
    if (collection in globalNamespace.cacheData) {
        console.log("data from cache");
        toResolve = globalNamespace.cacheData[collection];
    }
    else {
        try {
            let data = await fetch(collection);
            globalNamespace.cacheData[collection] = data;
            toResolve = data;
        } catch (e) {
            toReject = e;
        }
    }
    return new Promise(function (resolve, reject) {
        if (toReject) 
            reject(toReject);
        else 
            resolve(toResolve);
    });
}


async function fetchDocData(collection, doc) {
    let toResolve = null;
    let toReject = null;
    if (collection in globalNamespace.cacheData && doc in globalNamespace.cacheData[collection]) {
        console.log("data from cache");
        toResolve = globalNamespace.cacheData[collection][doc];
    }
    else {
        try {
            let data = await fetch(collection);
            globalNamespace.cacheData[collection] = data;
            toResolve = await fetchDoc(collection, doc);
            console.log("fetchDocData: ", toResolve);
        } catch (e) {
            toReject = e;
        }
    }
    return new Promise(function (resolve, reject) {
        if (toReject)
            reject(toReject);
        else {
            resolve(toResolve);
        }
    });
}


function storeData(collection, content) {
    return new Promise(function (resolve, reject) {
        store(collection, content)
        .then(() => {
            globalNamespace.cacheData[collection] = content;
        })
        .catch(err => {
            reject(err);
        });
    });
}


function storeDocData(collection, doc, content) {
    return new Promise(function (resolve, reject) {
        storeDoc(collection, doc, content)
        .then((data) => {
            if (!(collection in globalNamespace.cacheData))
                globalNamespace.cacheData[collection] = {};
            globalNamespace.cacheData[collection][doc] = data;
        })
        .catch(err => {
            reject(err);
        });
    });
}


function deleteCollectionData(collection) {
    collection = collection.toLowerCase();
    return new Promise(function (resolve, reject) {
        deleteCollection(collection)
        .then(() => {
            delete globalNamespace.cacheData[collection];

            // update list of collection
            let updatedNavLinks = [];
            let profile = globalNamespace.cacheData.profile;
            for (let i=0; i<profile.length; i++) {
                if (profile[i]['id'] == "navlinks") {
                    for (let j=0; j<profile[i]['html'].length; j++) {
                        if (profile[i]['html'][j] != collection)
                            updatedNavLinks.push(profile[i]['html'][j]);
                    }
                }
            }
            console.log(updatedNavLinks);
            console.log(collection);
            storeDocData("profile", "navlinks", {"html": updatedNavLinks})
            .then(() => {
                resolve();
            })
            .catch((err) => reject(err));
        })
        .catch(err => reject(err));
    });
}