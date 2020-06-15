const express = require('express');
const Firebase = require("firebase");
var admin = require('firebase-admin');
var bcrypt = require('bcryptjs');
var bodyParser = require("body-parser");
const path = require('path');
const app = express();
var cloudinary = require("cloudinary");

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, './Frontend/build')));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use((err, req, res, next) => {
    if (err) {
        let response = {
            success: false
        }
        res.json(response);
    } else {
      next()
    }
})

var serviceAccount = require("./firebaseadmin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://frafarm-db59c.firebaseio.com"
});

const firebaseConfig = require("./firebaseuser.json");

cloudinary.config(require("./cloudinaryuser.json"));

let appfirebase = Firebase.initializeApp(firebaseConfig);
const db = appfirebase.firestore();

app.post("/Login", (req,res) => {
    try{
        var userEmail = null;
        var tipiAccount = null;

        db.collection("/Blersi").get().then(snapshot =>{
            snapshot.docs.forEach(doc =>{
                if(doc.data().username === req.body.username){
                    userEmail = doc.data().email;
                    tipiAccount = "Blersi";
                }
            })
        }).then(() => {
            db.collection("/Fermeri").get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                    if(doc.data().username === req.body.username){
                        userEmail = doc.data().email;
                        tipiAccount = "Fermeri";
                    }
                })
            }).then(() => {
            if(userEmail !== null){
                Firebase.auth().signInWithEmailAndPassword(userEmail, req.body.password).then(() =>{
                    let response = {
                        uid: Firebase.auth().currentUser.uid,
                        success: true,
                        tipiAccount: tipiAccount
                    }
                    res.json(response);
                }).catch(() => {
                    let response = {
                        rasti: "Catch i Firebase.auth",
                        uid: null,
                        success: false,
                        tipiAccount: null
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    rasti: "Tek else",
                    uid: null,
                    success: false,
                    tipiAccount: null
                }
                res.json(response);
            }
        })
    })
    }catch(error){
        let response = {
            rasti: "Catch i TryCatch",
            uid: null,
            success: false,
            tipiAccount: null
        }
        res.json(response);
    }
})

app.post("/Signup", async (req,res) => {
    try{
        var emaillowercase = req.body.email.toLowerCase();
        var userExist = {
            emailExist: false,
            usernameExist: false
        };
        var collection = null;
        db.collection("/Blersi").get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                    if(doc.data().email === emaillowercase){
                        userExist.emailExist = true;
                    }
                    if(doc.data().username === req.body.username){
                        userExist.usernameExist = true;
                    }
            })
        }).then(() => {
            db.collection("/Fermeri").get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                        if(doc.data().email === emaillowercase){
                            userExist.emailExist = true;
                        }
                        if(doc.data().username === req.body.username){
                            userExist.usernameExist = true;
                        }
                })
            }).then(async () =>{
            if(userExist.emailExist === false && userExist.usernameExist === false){
                var salt = await bcrypt.genSalt();
                var hashedPassword = await bcrypt.hash(req.body.password , salt);
                Firebase.auth().createUserWithEmailAndPassword(emaillowercase, req.body.password).then(user => {
                    db.collection("/" + req.body.tipiAccount).doc(user.user.uid).set({
                        username: req.body.username,
                        email: emaillowercase,
                        password: hashedPassword,
                        telnumber: req.body.telnumber
                    });
                    response = {
                        uid: user.user.uid,
                        success: true,
                    }
                    res.json(response);
                }).catch(() => {
                    let response = {
                        uid: null,
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    uid: null,
                    success: false,
                    emailError: userExist.emailExist,
                    usernameError: userExist.usernameExist
                }
                res.json(response);
            }
        })
        })
    }catch(error){
        let response = {
            uid: null,
            success: false,
        }
        res.json(response);
    }
})

app.post("/ForgotPassword", (req,res) => {
    try{
        const emaillowercase = req.body.email.toLowerCase();
        var emailExist = false;
        db.collection("/Blersi").get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                if(doc.data().email === emaillowercase){
                    emailExist = true;
                }
            })
        }).then(() => {
            db.collection("/Fermeri").get().then(snapshot =>{
                snapshot.docs.forEach(doc => {
                    if(doc.data().email === emaillowercase){
                        emailExist = true;
                    }
                })
            }).then(() => {
                if(emailExist === true){
                    Firebase.auth().sendPasswordResetEmail(emaillowercase).then(() => {
                        let response = {
                            success: true
                        }
                        res.json(response);
                    })
                }else{
                    let response = {
                        success: false
                    }
                    res.json(response);
                }
            })
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/VerifyUser", (req,res) => {
    var docRef = db.collection("/" + req.body.tipiAccount).doc(req.body.uid);
    docRef.get().then(doc => {
        if(doc.exists){
            let response = {
                success: true
            }
            res.json(response);
        }else{
            let response = {
                success: false
            }
            res.json(response);
        }
    }).catch(() => {
        let response = {
            success: false
        }
        res.json(response);
    })
})

app.post("/Profile", async (req,res) => {
    try{
    var userExist = {
        emailExist: false,
        usernameExist: false
    };
    var actualUsername = "";
    var actualEmail = "";
    var emaillowercase = "";
    var hashedPassword = "";
    if(req.body.email !== ""){
        emaillowercase = req.body.email.toLowerCase();
    }
    if(req.body.password !== ""){
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(req.body.password, salt);
    }
    let docref = db.collection("/" + req.body.tipiAccount).doc(req.body.uid);
    docref.get().then(doc => {
        if(doc.exists){
            actualUsername = doc.data().username;
            actualEmail = doc.data().email;
        }else{
            let response = {
                success: false
            }
            res.json(response);
        }
    }).then(() => {
        db.collection("/Blersi").get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                    if(emaillowercase !== ""){
                        if(doc.data().email === emaillowercase && emaillowercase !== actualEmail){
                            userExist.emailExist = true;
                        }
                    }
                    if(req.body.username !== ""){
                        if(doc.data().username === req.body.username && req.body.username !== actualUsername){
                            userExist.usernameExist = true;
                        }
                    }
            })
        }).then(() => {
            db.collection("/Fermeri").get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                        if(emaillowercase !== ""){
                            if(doc.data().email === emaillowercase && emaillowercase !== actualEmail){
                                userExist.emailExist = true;
                            }
                        }
                        if(req.body.username !== ""){
                            if(doc.data().username === req.body.username && req.body.username !== actualUsername){
                                userExist.usernameExist = true;
                            }
                        }
                })
            }).then(() => {
                if(userExist.emailExist === false && userExist.usernameExist === false){
                let docref = db.collection("/" + req.body.tipiAccount).doc(req.body.uid);
                docref.get().then(async (doc) => {
                    if(doc.exists){
                        if(emaillowercase !== "" && hashedPassword !== ""){
                            await admin.auth().updateUser(req.body.uid, {
                                email: emaillowercase,
                                password: req.body.password,
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }
                        if(emaillowercase !== "" && hashedPassword === ""){
                            await admin.auth().updateUser(req.body.uid, {
                                email: emaillowercase,
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }
                        if(emaillowercase === "" && hashedPassword !== ""){
                            await admin.auth().updateUser(req.body.uid, {
                                password: req.body.password,
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }

                        db.collection("/" + req.body.tipiAccount).doc(doc.id).update({
                            username: (req.body.username !== "") ? req.body.username : doc.data().username,
                            email: (emaillowercase !== "") ? emaillowercase : doc.data().email,
                            password: (hashedPassword !== "") ? hashedPassword : doc.data().password,
                            telnumber: (req.body.telnumber !== "") ? req.body.telnumber : doc.data().telnumber
                        }).then(() => {
                            let response = {
                                success: true
                            }
                            res.json(response);
                        }).catch(() => {
                            let response = {
                                success: false
                            }
                            res.json(response);
                        })
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                })
            }else{
                let response = {
                    success: false,
                    emailError: userExist.emailExist,
                    usernameError: userExist.usernameExist
                }
                res.json(response);
            }
        })
    })
    })
}catch(error){
    let response = {
        success: false
    }
    res.json(response);
}
})

app.post("/Username", (req, res) => {
    try{
    let docref = db.collection("/" + req.body.tipiAccount).doc(req.body.uid);
    docref.get().then(doc => {
        if(doc.exists){
            let response = {
                username: doc.data().username,
                success: true
            }
            res.json(response);
        }else{
            let response = {
                success: false
            }
            res.json(response);
        }
    }).catch(() => {
        let response = {
            success: false
        }
        res.json(response);
    })
}catch(error){
    let response = {
        success: false
    }
    res.json(response);
}
})

app.post("/Fermeri/Products", (req,res) => {
    try{
    var listaHalf = [];
    var listaAll = [];
    var listaTitle = [];
    var listaLocation = [];
    var listaMiddle = [];
    var listaFinal = [];
    var newold = "";
    if(req.body.newold === "Newest"){
        newold = "newest";
    }
    if(req.body.newold === "Oldest"){
        newold = "oldest";
    }
    var docRef = db.collection("/Fermeri").doc(req.body.uid);
    docRef.get().then(doc => {
        if(doc.exists){
            db.collection("/Products").orderBy(newold).get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                    if(doc.data().userid === req.body.uid){
                        let product = {
                                id: doc.id,
                                userid: doc.data().userid,
                                imagePublicID: doc.data().imagePublicID,
                                imageURL: doc.data().imageURL,
                                title: doc.data().title,
                                price: doc.data().price,
                                location: doc.data().location,
                                description: doc.data().description,
                                oldest: doc.data().oldest,
                                newest: doc.data().newest
                            }
                        if(req.body.title !== "" && doc.data().title === req.body.title){
                            listaTitle.push(product);
                        }
                        if(req.body.location !== "" && doc.data().location === req.body.location){
                            listaLocation.push(product);
                        }
                        if(req.body.title === "" || req.body.location === ""){
                            listaHalf.push(product);
                        }
                        if(req.body.title === "" && req.body.location === ""){
                            listaAll.push(product);
                        }
                    }
                })
            }).then(() => {
                if(listaTitle.length === 0 && listaLocation.length >= 1){
                    listaTitle = listaTitle.concat(listaHalf);
                }
                if(listaLocation.length === 0 && listaTitle.length >= 1){
                    listaLocation = listaLocation.concat(listaHalf);
                }
                
                for(var i=0; i < listaTitle.length; i++){
                    for(var j=0; j < listaLocation.length; j++){
                        if(listaTitle[i].title === listaLocation[j].title && listaTitle[i].location === listaLocation[j].location){
                            listaMiddle.push(listaTitle[i]);
                        }
                    }
                }
                if(listaMiddle.length >= 1){
                    listaAll = [];
                }
                listaFinal.push(...listaMiddle,...listaAll);
                let response = {
                    success: true,
                    lista: listaFinal
                }
                res.json(response);
            })
        }else{
            let response = {
                success: false
            }
            res.json(response);
        }
    })
}catch(error){
    let response = {
        success: false
    }
    res.json(response);
}
})

app.post("/Fermeri/Products/NewProduct", async (req,res) => {
    try{
        var imagePublicID = "";
        var imageURL = "";

        var docRef = db.collection("/Fermeri").doc(req.body.uid);
            docRef.get().then(doc => {
                if(doc.exists){
                    cloudinary.v2.uploader.upload(req.body.productImage, {
                        transformation: [
                            { width: 200, height: 140 }
                        ]
                    }, (error, result) => {
                        if(error === undefined){
                            imagePublicID = result.public_id;
                            imageURL = result.url;
                        }else{
                            let response = {
                                success: false
                            }
                            res.json(response);
                        }
                    }).then(() => {
                        if(imageURL !== ""){
                            var dateObj = new Date();
    
                            db.collection("/Products").doc().set({
                                userid: req.body.uid,
                                imagePublicID: imagePublicID,
                                imageURL: imageURL,
                                title: req.body.productTitle,
                                price: req.body.productPrice,
                                location: req.body.productLocation,
                                description: req.body.productDescription,
                                oldest: dateObj,
                                newest: -dateObj,
                            }).then(() => {
                                let response = {
                                    success: true
                                }
                                res.json(response);
                            })
                        }else{
                            let response = {
                                success: false
                            }
                            res.json(response);
                        }
                    }).catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
                }else{
                    let response = {
                        success: false
                    }
                    res.json(response);
                }
            }).catch(() => {
                let response = {
                    success: false
                }
                res.json(response);
            })    
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Fermeri/Products/EditProduct", async (req,res) => {
    try{
        var imageDeleted = false;
        var imagePublicID = req.body.productImagePublicID;
        var imageURL = req.body.productImageURL;
        let docref = db.collection("/Fermeri").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                let docref = db.collection("/Products").doc(req.body.productID);
                docref.get().then(async (doc) => {
                    if(doc.exists){
                        if(doc.data().userid === req.body.uid){
                            if(req.body.productImage !== ""){
                                await cloudinary.v2.uploader.destroy(req.body.productImagePublicID, (error,result) => {
                                    if(error === undefined){
                                        imageDeleted = true;
                                    }else{
                                        let response = {
                                            success: false
                                        }
                                        res.json(response);
                                    }
                                }).then(async () => {
                                    if(imageDeleted === true){
                                        await cloudinary.v2.uploader.upload(req.body.productImage, {
                                            transformation: [
                                                { width: 200, height: 140 }
                                            ]
                                        }, async (error, result) => {
                                            if(error === undefined){
                                                imagePublicID = result.public_id;
                                                imageURL = result.url;
                                            }else{
                                                let response = {
                                                    success: false
                                                }
                                                res.json(response);
                                            }
                                        }).catch(() => {
                                            let response = {
                                                success: false
                                            }
                                            res.json(response);
                                        })
                                    }else{
                                        let response = {
                                            success: false
                                        }
                                        res.json(response);
                                    }
                                }).catch(() => {
                                    let response = {
                                        success: false
                                    }
                                    res.json(response);
                                })
                            }
                            var dateObj = new Date();
                            var newData = {
                                imagePublicID: imagePublicID,
                                imageURL: imageURL,
                                title: req.body.productTitle,
                                price: req.body.productPrice,
                                location: req.body.productLocation,
                                description: req.body.productDescription
                            }
                            db.collection("/Products").doc(req.body.productID).set({
                                userid: req.body.uid,
                                imagePublicID: imagePublicID,
                                imageURL: imageURL,
                                title: req.body.productTitle,
                                price: req.body.productPrice,
                                location: req.body.productLocation,
                                description: req.body.productDescription,
                                oldest: dateObj,
                                newest: -dateObj,
                            }).then(() => {
                                let response = {
                                    success: true,
                                    newData: newData,
                                }
                                res.json(response);
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }else{
                            let response = {
                                success: false
                            }
                            res.json(response);
                        }
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Fermeri/Products/DeleteProduct", async (req,res) => {
    try{
        var imageDeleted = false;
        let docref = db.collection("/Fermeri").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                let docref = db.collection("/Products").doc(req.body.productID);
                docref.get().then(async (doc) => {
                    if(doc.exists){
                        if(doc.data().userid === req.body.uid){
                            await cloudinary.v2.uploader.destroy(req.body.productImagePublicID, (error,result) => {
                                if(error === undefined){
                                    imageDeleted = true;
                                }else{
                                    let response = {
                                        success: false
                                    }
                                    res.json(response);
                                }
                            }).then(async () => {
                                if(imageDeleted === true){
                                    db.collection("/Products").doc(req.body.productID).delete().then(function() {
                                        let response = {
                                            success: true
                                        }
                                        res.json(response);
                                    }).catch(() => {
                                        let response = {
                                            success: false
                                        }
                                        res.json(response);
                                    })
                                }else{
                                    let response = {
                                        success: false
                                    }
                                    res.json(response);
                                }
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }else{
                            let response = {
                                success: false
                            }
                            res.json(response);
                        }
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Fermeri/Orders", (req,res) => {
    try{
        var listaHalf = [];
        var listaAll = [];
        var listaTitle = [];
        var listaLocation = [];
        var listaMiddle = [];
        var listaProducts = [];
        var listaFinal = [];
        var newold = "";
        if(req.body.newold === "Newest"){
            newold = "newest";
        }
        if(req.body.newold === "Oldest"){
            newold = "oldest";
        }
        var docRef = db.collection("/Fermeri").doc(req.body.uid);
        docRef.get().then(doc => {
            if(doc.exists){
                db.collection("/Products").get().then(snapshot =>{
                    snapshot.docs.forEach(doc =>{
                        if(doc.data().userid === req.body.uid){
                        let product = {
                            id: doc.id,
                            imageURL: doc.data().imageURL,
                            title: doc.data().title,
                            price: doc.data().price,
                            location: doc.data().location,
                            description: doc.data().description
                        }
                            if(req.body.title !== "" && doc.data().title === req.body.title){
                                listaTitle.push(product);
                            }
                            if(req.body.location !== "" && doc.data().location === req.body.location){
                                listaLocation.push(product);
                            }
                            if(req.body.title === "" || req.body.location === ""){
                                listaHalf.push(product);
                            }
                            if(req.body.title === "" && req.body.location === ""){
                                listaAll.push(product);
                            }
                        }
                    })
                }).then(() => {
                    if(listaTitle.length === 0 && listaLocation.length >= 1){
                        listaTitle = listaTitle.concat(listaHalf);
                    }
                    if(listaLocation.length === 0 && listaTitle.length >= 1){
                        listaLocation = listaLocation.concat(listaHalf);
                    }
                    
                    for(var i=0; i < listaTitle.length; i++){
                        for(var j=0; j < listaLocation.length; j++){
                            if(listaTitle[i].title === listaLocation[j].title && listaTitle[i].location === listaLocation[j].location){
                                listaMiddle.push(listaTitle[i]);
                            }
                        }
                    }
                    if(listaMiddle.length >= 1){
                        listaAll = [];
                    }
                    listaProducts.push(...listaMiddle,...listaAll);
                }).then(() => {
                    db.collection("/Orders").orderBy(newold).get().then(snapshot =>{
                        snapshot.docs.forEach(doc =>{
                            for(var i=0; i < listaProducts.length; i++){
                            if(doc.data().productID === listaProducts[i].id){
                                listaFinal.push(listaProducts[i]);
                            }
                        }
                        })
                    }).then(() => {
                        let response = {
                            success: true,
                            lista: listaFinal
                        }
                        res.json(response);
                    }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
                    .catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Blersi/Products", (req,res) => {
    try{
    var listaHalf = [];
    var listaAll = [];
    var listaTitle = [];
    var listaLocation = [];
    var listaMiddle = [];
    var listaFinal = [];
    var newold = "";
    if(req.body.newold === "Newest"){
        newold = "newest";
    }
    if(req.body.newold === "Oldest"){
        newold = "oldest";
    }
    var docRef = db.collection("/Blersi").doc(req.body.uid);
    docRef.get().then(doc => {
        if(doc.exists){
            db.collection("/Products").orderBy(newold).limit(10).get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                        let product = {
                                id: doc.id,
                                imageURL: doc.data().imageURL,
                                title: doc.data().title,
                                price: doc.data().price,
                                location: doc.data().location,
                                description: doc.data().description
                            }
                        if(req.body.title !== "" && doc.data().title === req.body.title){
                            listaTitle.push(product);
                        }
                        if(req.body.location !== "" && doc.data().location === req.body.location){
                            listaLocation.push(product);
                        }
                        if(req.body.title === "" || req.body.location === ""){
                            listaHalf.push(product);
                        }
                        if(req.body.title === "" && req.body.location === ""){
                            listaAll.push(product);
                        }
                })
            }).then(() => {
                if(listaTitle.length === 0 && listaLocation.length >= 1){
                    listaTitle = listaTitle.concat(listaHalf);
                }
                if(listaLocation.length === 0 && listaTitle.length >= 1){
                    listaLocation = listaLocation.concat(listaHalf);
                }
                
                for(var i=0; i < listaTitle.length; i++){
                    for(var j=0; j < listaLocation.length; j++){
                        if(listaTitle[i].title === listaLocation[j].title && listaTitle[i].location === listaLocation[j].location){
                            listaMiddle.push(listaTitle[i]);
                        }
                    }
                }
                if(listaMiddle.length >= 1){
                    listaAll = [];
                }
                listaFinal.push(...listaMiddle,...listaAll);
                let response = {
                    success: true,
                    lista: listaFinal
                }
                res.json(response);
            })
        }else{
            let response = {
                success: false
            }
            res.json(response);
        }
    })
}catch(error){
    let response = {
        success: false
    }
    res.json(response);
}
})

app.post("/Blersi/Products/Details", (req,res) => {
    try{
        let docref = db.collection("/Blersi").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                let docref = db.collection("/Products").doc(req.body.productID);
                docref.get().then(doc => {
                    if(doc.exists){
                        let docref = db.collection("/Fermeri").doc(doc.data().userid);
                        docref.get().then(doc => {
                            if(doc.exists){
                                let response = {
                                    success: true,
                                    owner: doc.data().username,
                                    telnumber: doc.data().telnumber
                                }
                                res.json(response);
                            }else{
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            }
                        }).catch(() => {
                            let response = {
                                success: false
                            }
                            res.json(response);
                        })
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Blersi/Products/AddOrder", (req,res) => {
    try{
        let docref = db.collection("/Blersi").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                let docref = db.collection("/Products").doc(req.body.productID);
                docref.get().then(doc => {
                    if(doc.exists){
                        var dateObj = new Date();
                        db.collection("/Orders").doc().set({
                            clientID: req.body.uid,
                            productID: req.body.productID,
                            oldest: dateObj,
                            newest: -dateObj,
                        }).then(() => {
                            let response = {
                                success: true
                            }
                            res.json(response);
                        })
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Blersi/Orders", async (req,res) => {
    try{
        var listaHalf = [];
        var listaAll = [];
        var listaTitle = [];
        var listaLocation = [];
        var listaMiddle = [];
        var listaProducts = [];
        var listaOrders = [];
        var listaData = [];
        var listaNeeded = [];
        var listaFinal = [];
        var newold = "";
        if(req.body.newold === "Newest"){
            newold = "newest";
        }
        if(req.body.newold === "Oldest"){
            newold = "oldest";
        }
        var docRef = db.collection("/Blersi").doc(req.body.uid);
        docRef.get().then(doc => {
            if(doc.exists){
                db.collection("/Products").get().then(snapshot =>{
                    snapshot.docs.forEach(doc =>{
                        let product = {
                            id: doc.id,
                            imageURL: doc.data().imageURL,
                            title: doc.data().title,
                            price: doc.data().price,
                            location: doc.data().location,
                            description: doc.data().description
                        }
                            if(req.body.title !== "" && doc.data().title === req.body.title){
                                listaTitle.push(product);
                            }
                            if(req.body.location !== "" && doc.data().location === req.body.location){
                                listaLocation.push(product);
                            }
                            if(req.body.title === "" || req.body.location === ""){
                                listaHalf.push(product);
                            }
                            if(req.body.title === "" && req.body.location === ""){
                                listaAll.push(product);
                            }
                    })
                }).then(() => {
                    if(listaTitle.length === 0 && listaLocation.length >= 1){
                        listaTitle = listaTitle.concat(listaHalf);
                    }
                    if(listaLocation.length === 0 && listaTitle.length >= 1){
                        listaLocation = listaLocation.concat(listaHalf);
                    }
                    
                    for(var i=0; i < listaTitle.length; i++){
                        for(var j=0; j < listaLocation.length; j++){
                            if(listaTitle[i].title === listaLocation[j].title && listaTitle[i].location === listaLocation[j].location){
                                listaMiddle.push(listaTitle[i]);
                            }
                        }
                    }
                    if(listaMiddle.length >= 1){
                        listaAll = [];
                    }
                    listaProducts.push(...listaMiddle,...listaAll);
                }).then(() => {
                    db.collection("/Orders").orderBy(newold).get().then(snapshot =>{
                        snapshot.docs.forEach(doc =>{
                            if(doc.data().clientID === req.body.uid){
                                let order = {
                                    orderID: doc.id,
                                    clientID: doc.data().clientID,
                                    productID: doc.data().productID
                                }
                                listaOrders.push(order);
                            }
                        })
                    }).then(() => {
                        for(let i=0; i < listaProducts.length; i++){
                            for(let j=0; j < listaOrders.length; j++){
                                if(listaProducts[i].id === listaOrders[j].productID){
                                    listaData.push(listaOrders[j]);
                                }
                            }
                        }
                    }).then(() => {
                        db.collection("/Products").get().then(snapshot =>{
                            snapshot.docs.forEach(doc =>{
                                for(var i=0; i < listaData.length; i++){
                                    if(listaData[i].productID === doc.id){
                                        let product = {
                                            id: doc.id,
                                            imageURL: doc.data().imageURL,
                                            title: doc.data().title,
                                            price: doc.data().price,
                                            location: doc.data().location,
                                            description: doc.data().description,
                                            orderID: listaData[i].orderID,
                                        }
                                        listaNeeded.push(product);
                                    }
                                }
                            })
                        }).then(() => {
                            db.collection("/Orders").orderBy(newold).get().then(snapshot =>{
                                snapshot.docs.forEach(doc =>{
                                    for(var i=0; i < listaNeeded.length; i++){
                                        if(doc.id === listaNeeded[i].orderID){
                                            listaFinal.push(listaNeeded[i]);
                                        }
                                    }
                                })
                            }).then(() => {
                                let response = {
                                    success: true,
                                    lista: listaFinal
                                }
                                res.json(response);
                            })
                        }).catch(() => {
                            let response = {
                                success: false
                            }
                            res.json(response);
                        })
                    }).catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Blersi/Orders/Details", (req,res) => {
    try{
        var docRef = db.collection("/Blersi").doc(req.body.uid);
        docRef.get().then(doc => {
            if(doc.exists){
                var docRef = db.collection("/Products").doc(req.body.productID);
                    docRef.get().then(doc => {
                        if(doc.exists){
                            var productData = {
                                imageURL: doc.data().imageURL,
                                title: doc.data().title,
                                price: doc.data().price,
                                location: doc.data().location,
                                description: doc.data().description
                            }
                        var docRef = db.collection("/Fermeri").doc(doc.data().userid);
                        docRef.get().then(doc => {
                            if(doc.exists){
                                var fermeriData = {
                                    owner: doc.data().username,
                                    telnumber: doc.data().telnumber
                                }
                                let response = {
                                    success: true,
                                    productData: productData,
                                    fermeriData: fermeriData
                                }
                                res.json(response);
                            }else{
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            }
                        })
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                    }).catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/Blersi/Orders/DeleteOrder", (req,res) => {
    try{
        var docRef = db.collection("/Blersi").doc(req.body.uid);
        docRef.get().then(doc => {
            if(doc.exists){
                let docref = db.collection("/Orders").doc(req.body.orderID);
                docref.get().then(doc => {
                    if(doc.exists){
                        if(doc.data().clientID === req.body.uid){
                            db.collection("/Orders").doc(req.body.orderID).delete().then(function() {
                                let response = {
                                    success: true
                                }
                                res.json(response);
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }else{
                            let response = {
                                success: false
                            }
                            res.json(response);
                        }
                    }else{
                        let response = {
                            success: false
                        }
                        res.json(response);
                    }
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.route('/*').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './Frontend/build/index.html')); 
});

app.listen(process.env.PORT || 3000);