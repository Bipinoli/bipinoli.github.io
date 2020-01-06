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
        .then(() => {
            if (!(collection in globalNamespace.cacheData))
                globalNamespace.cacheData[collection] = {};
            globalNamespace.cacheData[collection][doc] = data;
        })
        .catch(err => {
            reject(err);
        });
    });
}

export {
    fetchData,
    fetchDocData,
    storeData,
    storeDocData
};