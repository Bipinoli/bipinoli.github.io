function signIn(email, password) {
    return new Promise(function (resolve, reject) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("signed in successfully!");
            resolve();
        })
        .catch(function(error) {
            console.error(error.code, error.message);
            reject();
        });
    });
}

function signOut() {
    return new Promise(function (resolve, reject) {
        firebase.auth().signOut().then(function() {
            console.log("signed out successfully!");
            resolve();
          }).catch(function(error) {
            console.error(error);
            reject();
          });
    });
}


function initDB() {
    globalNamespace["db"] = firebase.firestore();
}


function fetch(collection) {
    collection = collection.toLocaleLowerCase();
    return new Promise(function (resolve, reject) {
        globalNamespace["db"].collection(collection).get().then((querySnapshot) => {
            console.log("fetched successfully!");
            let retval = [];
            querySnapshot.forEach((doc) => {
                retval.push({id: doc.id, data: doc.data()});
            });
            console.log(retval);
            resolve(retval);
        });
    });
}


function store(collection, contents) {
    collection = collection.toLocaleLowerCase();
    return new Promise(function (resolve, reject) {
        let promises = [];
        for (let i=0; i<contents.length; i++) {
            promises.push(globalNamespace["db"].collection(collection).doc("" + i).set(contents[i]));
        }
        Promise.all(promises)
        .then(() => {
            console.log("stored successfully!");
            resolve();
        })
        .catch((error) => {
            console.error(error);
            reject();
        });
    });
}


function storeDoc(collection, doc, content) {
    collection = collection.toLocaleLowerCase();
    doc = doc.toLocaleLowerCase();
    return new Promise(function (resolve, reject) {
        globalNamespace["db"].collection(collection).doc(doc).set(content)
            .then(() => {
                console.log("Doc stored successfully!");
                resolve();
            })
            .catch((err) => {
                console.error(err);
                reject();
            })
    });
}


function deleteCollection(collection) {
    collection = collection.toLocaleLowerCase();
    return new Promise(function (resolve, reject) {
        fetch(collection)
            .then(contents => {
                let promises = [];
                for (let i=0; i<contents.length; i++) 
                    promises.push(globalNamespace["db"].collection(collection).doc(contents[i].id).delete());
                Promise.all(promises)
                .then(() => {
                    console.log("collection deleted successfully!");
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                });
            })
            .catch((error) => {
                console.error(error);
                reject();
            });
        
    });
}