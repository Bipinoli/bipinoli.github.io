function signIn(email, password) {
    return new Promise(function (resolve, reject) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            localStorage.setItem("signedIn", true);
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
            localStorage.setItem("signedIn", false);
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
    collection = collection.toLowerCase();
    return new Promise(function (resolve, reject) {
        globalNamespace["db"].collection(collection).get().then((querySnapshot) => {
            console.log("fetched successfully!");
            let retval = [];
            querySnapshot.forEach((doc) => {
                retval.push({id: doc.id, html: doc.data().html});
            });
            console.log(retval);
            resolve(retval);
        });
    });
}


function fetchDoc(collection, doc) {
    collection = collection.toLowerCase();
    doc = doc.toLowerCase();
    return new Promise(function (resolve, reject) {
        globalNamespace["db"].collection(collection).doc(doc).get()
            .then(doc => {
                console.log("doc fetched successfully!");
                let retval = {data: doc.data().navs};
                console.log(retval);
                resolve(retval);
            })
            .catch(err => {
                console.error(err);
            });
  })
}


function store(collection, content) {
    collection = collection.toLowerCase();
    return new Promise(function (resolve, reject) {
        globalNamespace["db"].collection(collection).doc("html").set(content)
            .then(() => {
                console.log("stored successfully!");
                resolve();
            })
            .catch(err => {
                console.error(err);
                reject();
            });
    });
}


function storeDoc(collection, doc, content) {
    collection = collection.toLowerCase();
    doc = doc.toLowerCase();
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
    collection = collection.toLowerCase();
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