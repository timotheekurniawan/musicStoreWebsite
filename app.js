const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const mongoose = require('mongoose');
// const { resolveNs } = require('dns/promises');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));




const url = `mongodb+srv://3322project:3322@cluster0.wsjpw.mongodb.net/MusicStore?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

var Schema = mongoose.Schema;

var loginSchema = new Schema({
    UserId : String,
    PW: String
});

var musicSchema = new Schema({
    musicId: Number,
    musicName: String,
    category: String,
    composer: String,
    description: String,
    price: Number,
    published : String,
    new_arrival: Boolean
});

var cartSchema = new Schema({
    musicId: Number,
    UserId: String,
    quantity: Number,
    musicName: String,
    price: Number
});

var loginRecord = mongoose.model("login", loginSchema, "logins");
var musicRecord = mongoose.model("music", musicSchema, "musics");
var cartRecord = mongoose.model("cart", cartSchema, "carts");

// var newMusic = new musicRecord({
//     musicId: 12,
//     musicName:"Liszt: Bagatelle sans tonalite",
//     category:"Late 19th",
//     composer:"Liszt",
//     description:"In 1869 Liszt was invited to return to Weimar by the grand duke to give master classes in piano playing, and two years later he was asked to do the same in Budapest...",
//     price: 103,
//     published: "1872",
//     new_arrival: false
// });
// newMusic.save((err,result)=>{

// });

app.get("/", (req, res) => {
    musicRecord.find({},{'_id':0},(err,result) =>{
        if (!err){
            var musicList = result;
            var username;
            var loggedIn;
            var totalCart = 0;
            musicRecord.distinct("category", (err,result) =>{
                if (!err){
                    var categoryList = result;
                    if (!req.session.username){
                        // console.log("not logged in");
                        username = "There";
                        loggedIn = false;
        
                        if (!req.session.cart){
                            // console.log("not logged in and no items");
                            totalCart = 0;
                            res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart, categoryList: categoryList});
        
                        }
                        else{
                            // console.log("not logged in and no items");
                            for (var i=0;i<req.session.cart.length;i++){
                                var itemInCart = req.session.cart[i];
                                totalCart += itemInCart.quantity;
                            }
                            res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart, categoryList: categoryList});
                        }
                        
                    }
                    else{
                        // console.log("logged in");
                        username = req.session.username;
                        loggedIn = true;
                        cartRecord.find({UserId: username}, (err,result) =>{
                            if (result.length==0){
                                // console.log("logged in user has no items");
                                totalCart = 0;
                                res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart, categoryList: categoryList});
                            }
                            else{
                                // console.log("logged in user has items");
                                for (var i=0; i<result.length; i++){
                                    // console.log(result[i].quantity);
                                    totalCart += result[i].quantity;
                                }
                                res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart, categoryList: categoryList});
                            }
                        })
                    }

                }
            })
            // if (!req.session.username){
            //     // console.log("not logged in");
            //     username = "There";
            //     loggedIn = false;

            //     if (!req.session.cart){
            //         // console.log("not logged in and no items");
            //         totalCart = 0;
            //         res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart});

            //     }
            //     else{
            //         // console.log("not logged in and no items");
            //         for (var i=0;i<req.session.cart.length;i++){
            //             var itemInCart = req.session.cart[i];
            //             totalCart += itemInCart.quantity;
            //         }
            //         res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart});
            //     }
                
            // }
            // else{
            //     // console.log("logged in");
            //     username = req.session.username;
            //     loggedIn = true;
            //     cartRecord.find({UserId: username}, (err,result) =>{
            //         if (result.length==0){
            //             // console.log("logged in user has no items");
            //             totalCart = 0;
            //             res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //         else{
            //             // console.log("logged in user has items");
            //             for (var i=0; i<result.length; i++){
            //                 // console.log(result[i].quantity);
            //                 totalCart += result[i].quantity;
            //             }
            //             res.render("main",{musicList: musicList, username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //     })
            // }
        }
    })
});


app.get("/login", (req,res) =>{
    var totalCart = 0
    if (!req.session.cart){
        totalCart = 0;
        res.render('login',{alertUser:false,sendPopUp:false,totalCart:totalCart});

    }
    else{
        for (var i=0;i<req.session.cart.length;i++){
            var itemInCart = req.session.cart[i];
            totalCart += itemInCart.quantity;
        }
        res.render('login',{alertUser:false,sendPopUp:false,totalCart:totalCart});
    }

    // res.render('login',{alertUser:false,sendPopUp:false});
});

app.post("/login", (req, res) => {
    // console.log(req.body);
    const {username,password} = req.body;
    // console.log(username,password);
    if (username=="" || password==""){
        res.render('login',{alertUser:true,sendPopUp:false});
    }
    else{
        loginRecord.find({UserId: username, PW: password}, (err,result) =>{
            if (!err){
                if (result.length==0){
                    console.log("Wrong username and/or password!");
                    res.render('login',{alertUser:false,sendPopUp:true});
                }
                else{
                    /*add items in cart before login to logged in user's cart*/
                    if (req.session.cart)
                    {
                        console.log("Logged in, several items are in cart before login")
                        console.log("");
                        console.log(req.session.cart);
                        async function compareCarts(item){
                            const result = await cartRecord.find({UserId:username, musicId: item.musicId});
                            if (result.length==0){
                                var newCart = new cartRecord({
                                    musicId : item.musicId,
                                    UserId: username,
                                    quantity: item.quantity,
                                    musicName: item.musicName,
                                    price: item.price
                                });
                                await newCart.save( (err,result) =>{
                                    console.log("new cart record with login");
                                });
                            }
                            else{
                                const result = await cartRecord.updateOne({UserId:username, musicId: item.musicId},{$inc:{quantity:item.quantity}});
                                console.log("updated");
                            }
                        }

                        async function callCompareCarts(){
                            console.log("Starting");
                            try{
                                for (var i = 0; i <req.session.cart.length;i++){
                                    let x = await compareCarts(req.session.cart[i]);
                                }
                                req.session.cart=[];
                                console.log("Cart in session");
                                console.log(req.session.cart);
                                req.session.username = username;
                                res.redirect(301,"/");
                            }
                            catch(err){
                                console.log(err);
                            }
                        }
                        callCompareCarts();
                    }
                    else{
                        req.session.username = username;
                        res.redirect(301,"/");
                    }
                }
            }
        })
    }
});

app.get("/register", (req, res) => {
    var totalCart = 0;
    if (!req.session.cart){
        totalCart = 0;
        res.render('register',{alertUser:false,redirectLogin:false,sendPopUpSuccess:false,sendPopUpFail:false,totalCart:totalCart});

    }
    else{
        for (var i=0;i<req.session.cart.length;i++){
            var itemInCart = req.session.cart[i];
            totalCart += itemInCart.quantity;
        }
        res.render('register',{alertUser:false,redirectLogin:false,sendPopUpSuccess:false,sendPopUpFail:false,totalCart:totalCart});
    }
    // res.render('register',{alertUser:false,redirectLogin:false,sendPopUpSuccess:false,sendPopUpFail:false});
});

app.post("/register", (req,res) =>{
    const {username,password} = req.body;

    if (username=="" || password==""){
        res.render('register',{alertUser:true,redirectLogin:false,sendPopUpSuccess:false,sendPopUpFail:false});
    }
    else{
        loginRecord.find({UserId: username}, (err,result) =>{
            if (!err){
                if (result.length==0){
                    var newLogin = new loginRecord({
                        UserId: username,
                        PW: password
                    });
                    newLogin.save((err,result)=>{
                        if (err){
                            console.log("unable to add to login record");
                        }
                        else{
                            console.log("record added");
                            res.render('register',{alertUser:false,redirectLogin:true,sendPopUpSuccess:true,sendPopUpFail:false});
                            // res.redirect(301,"/login");
                        }
                    })
                }
                else{
                    console.log("Username is taken! Pick another username");
                    res.render('register',{alertUser:false,redirectLogin:false,sendPopUpSuccess:false,sendPopUpFail:true});
                }
            }
        })
    }
});

app.get("/Classical", (req,res)=>{
    musicRecord.find({category:'Classical'}, {'_id':0},(err,result)=>{
        if (!err){
            var musicList = result;
            var categoryName="Classical";
            var loggedIn;
            var totalCart = 0;
            musicRecord.distinct("category", (err,result) =>{
                if (!err){
                    var categoryList = result;
                    if (!req.session.username){
                        username="There";
                        loggedIn = false;
                        if (!req.session.cart){
                            // console.log("not logged in and no items");
                            totalCart = 0;
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
        
                        }
                        else{
                            // console.log("not logged in and no items");
                            for (var i=0;i<req.session.cart.length;i++){
                                var itemInCart = req.session.cart[i];
                                totalCart += itemInCart.quantity;
                            }
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
                        }
                    }
                    else{
                        username = req.session.username;
                        loggedIn = true;
                        cartRecord.find({UserId: username}, (err,result) =>{
                            if (result.length==0){
                                // console.log("logged in user has no items");
                                totalCart = 0;
                                res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
                            }
                            else{
                                // console.log("logged in user has items");
                                for (var i=0; i<result.length; i++){
                                    // console.log(result[i].quantity);
                                    totalCart += result[i].quantity;
                                }
                                res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
                            }
                        })
                    }

                }
            })
        }
    })
});

app.get("/Baroque", (req,res)=>{
    musicRecord.find({category:'Baroque'}, {'_id':0},(err,result)=>{
        if (!err){
            var musicList = result;
            var categoryName="Baroque";
            var loggedIn;
            var totalCart = 0;
            musicRecord.distinct("category", (err,result) => {
                if (!err){
                    var categoryList = result;
                    if (!req.session.username){
                        username="There";
                        loggedIn = false;
                        if (!req.session.cart){
                            // console.log("not logged in and no items");
                            totalCart = 0;
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
        
                        }
                        else{
                            // console.log("not logged in and no items");
                            for (var i=0;i<req.session.cart.length;i++){
                                var itemInCart = req.session.cart[i];
                                totalCart += itemInCart.quantity;
                            }
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                        }
                    }
                    else{
                        username = req.session.username;
                        loggedIn = true;
                        cartRecord.find({UserId: username}, (err,result) =>{
                            if (result.length==0){
                                // console.log("logged in user has no items");
                                totalCart = 0;
                                res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                            }
                            else{
                                // console.log("logged in user has items");
                                for (var i=0; i<result.length; i++){
                                    // console.log(result[i].quantity);
                                    totalCart += result[i].quantity;
                                }
                                res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                            }
                        })
                    }

                }
            })
            // if (!req.session.username){
            //     username="There";
            //     loggedIn = false;
            //     if (!req.session.cart){
            //         // console.log("not logged in and no items");
            //         totalCart = 0;
            //         res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});

            //     }
            //     else{
            //         // console.log("not logged in and no items");
            //         for (var i=0;i<req.session.cart.length;i++){
            //             var itemInCart = req.session.cart[i];
            //             totalCart += itemInCart.quantity;
            //         }
            //         res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //     }
            // }
            // else{
            //     username = req.session.username;
            //     loggedIn = true;
            //     cartRecord.find({UserId: username}, (err,result) =>{
            //         if (result.length==0){
            //             // console.log("logged in user has no items");
            //             totalCart = 0;
            //             res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //         else{
            //             // console.log("logged in user has items");
            //             for (var i=0; i<result.length; i++){
            //                 // console.log(result[i].quantity);
            //                 totalCart += result[i].quantity;
            //             }
            //             res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //     })
            // }
        }
    })
});

app.get("/Romantic", (req,res)=>{
    musicRecord.find({category:'Romantic'},{'_id':0}, (err,result)=>{
        if (!err){
            var musicList = result;
            var categoryName="Romantic";
            var loggedIn;
            var totalCart = 0;
            musicRecord.distinct("category", (err,result) =>{
                if (!err){
                    var categoryList = result;
                    if (!req.session.username){
                        username="There";
                        loggedIn=false;
                        if (!req.session.cart){
                            // console.log("not logged in and no items");
                            totalCart = 0;
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
        
                        }
                        else{
                            // console.log("not logged in and no items");
                            for (var i=0;i<req.session.cart.length;i++){
                                var itemInCart = req.session.cart[i];
                                totalCart += itemInCart.quantity;
                            }
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                        }
                    }
                    else{
                        username = req.session.username;
                        loggedIn=true;
                        cartRecord.find({UserId: username}, (err,result) =>{
                            if (result.length==0){
                                // console.log("logged in user has no items");
                                totalCart = 0;
                                res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                            }
                            else{
                                // console.log("logged in user has items");
                                for (var i=0; i<result.length; i++){
                                    // console.log(result[i].quantity);
                                    totalCart += result[i].quantity;
                                }
                                res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                            }
                        })
                    }
                }
            })
            // if (!req.session.username){
            //     username="There";
            //     loggedIn=false;
            //     if (!req.session.cart){
            //         // console.log("not logged in and no items");
            //         totalCart = 0;
            //         res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});

            //     }
            //     else{
            //         // console.log("not logged in and no items");
            //         for (var i=0;i<req.session.cart.length;i++){
            //             var itemInCart = req.session.cart[i];
            //             totalCart += itemInCart.quantity;
            //         }
            //         res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //     }
            // }
            // else{
            //     username = req.session.username;
            //     loggedIn=true;
            //     cartRecord.find({UserId: username}, (err,result) =>{
            //         if (result.length==0){
            //             // console.log("logged in user has no items");
            //             totalCart = 0;
            //             res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //         else{
            //             // console.log("logged in user has items");
            //             for (var i=0; i<result.length; i++){
            //                 // console.log(result[i].quantity);
            //                 totalCart += result[i].quantity;
            //             }
            //             res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //     })
            // }
        }
    })
});

app.get("/Late19th", (req,res)=>{
    musicRecord.find({category:'Late 19th'}, {'_id':0},(err,result)=>{
        if (!err){
            var musicList = result;
            var categoryName="Late 19th";
            var loggedIn;
            var totalCart = 0;
            musicRecord.distinct("category", (err,result) =>{
                var categoryList = result;
                if (!req.session.username){
                    username="There";
                    loggedIn= false;
                    if (!req.session.cart){
                        // console.log("not logged in and no items");
                        totalCart = 0;
                        res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
    
                    }
                    else{
                        // console.log("not logged in and no items");
                        for (var i=0;i<req.session.cart.length;i++){
                            var itemInCart = req.session.cart[i];
                            totalCart += itemInCart.quantity;
                        }
                        res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                    }
                }
                else{
                    username = req.session.username;
                    loggedIn = true;
                    cartRecord.find({UserId: username}, (err,result) =>{
                        if (result.length==0){
                            // console.log("logged in user has no items");
                            totalCart = 0;
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                        }
                        else{
                            // console.log("logged in user has items");
                            for (var i=0; i<result.length; i++){
                                // console.log(result[i].quantity);
                                totalCart += result[i].quantity;
                            }
                            res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                        }
                    })
                }

            })
            // if (!req.session.username){
            //     username="There";
            //     loggedIn= false;
            //     if (!req.session.cart){
            //         // console.log("not logged in and no items");
            //         totalCart = 0;
            //         res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});

            //     }
            //     else{
            //         // console.log("not logged in and no items");
            //         for (var i=0;i<req.session.cart.length;i++){
            //             var itemInCart = req.session.cart[i];
            //             totalCart += itemInCart.quantity;
            //         }
            //         res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //     }
            // }
            // else{
            //     username = req.session.username;
            //     loggedIn = true;
            //     cartRecord.find({UserId: username}, (err,result) =>{
            //         if (result.length==0){
            //             // console.log("logged in user has no items");
            //             totalCart = 0;
            //             res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //         else{
            //             // console.log("logged in user has items");
            //             for (var i=0; i<result.length; i++){
            //                 // console.log(result[i].quantity);
            //                 totalCart += result[i].quantity;
            //             }
            //             res.render("category",{musicList:musicList,categoryName:categoryName,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //     })
            // }
        }
    })
});


app.get("/music", (req,res) =>{
    var loggedIn;
    var totalCart=0;
    musicRecord.distinct("category",(err,result) =>{
        if (!err){
            var categoryList = result;
            console.log(categoryList);
            if (!req.session.username){
                username="There";
                loggedIn =false;
                if (!req.session.cart){
                    // console.log("not logged in and no items");
                    totalCart = 0;
                    res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
        
                }
                else{
                    // console.log("not logged in and no items");
                    for (var i=0;i<req.session.cart.length;i++){
                        var itemInCart = req.session.cart[i];
                        totalCart += itemInCart.quantity;
                    }
                    res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
                }
            }
            else{
                username = req.session.username;
                loggedIn = true
                cartRecord.find({UserId: username}, (err,result) =>{
                    if (result.length==0){
                        // console.log("logged in user has no items");
                        totalCart = 0;
                        res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
                    }
                    else{
                        // console.log("logged in user has items");
                        for (var i=0; i<result.length; i++){
                            // console.log(result[i].quantity);
                            totalCart += result[i].quantity;
                        }
                        res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList:categoryList});
                    }
                })
            }

        }
    })
    // if (!req.session.username){
    //     username="There";
    //     loggedIn =false;
    //     if (!req.session.cart){
    //         // console.log("not logged in and no items");
    //         totalCart = 0;
    //         res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart});

    //     }
    //     else{
    //         // console.log("not logged in and no items");
    //         for (var i=0;i<req.session.cart.length;i++){
    //             var itemInCart = req.session.cart[i];
    //             totalCart += itemInCart.quantity;
    //         }
    //         res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart});
    //     }
    // }
    // else{
    //     username = req.session.username;
    //     loggedIn = true
    //     cartRecord.find({UserId: username}, (err,result) =>{
    //         if (result.length==0){
    //             // console.log("logged in user has no items");
    //             totalCart = 0;
    //             res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart});
    //         }
    //         else{
    //             // console.log("logged in user has items");
    //             for (var i=0; i<result.length; i++){
    //                 // console.log(result[i].quantity);
    //                 totalCart += result[i].quantity;
    //             }
    //             res.render("music",{title:"",musicList:[],username:username,loggedIn:loggedIn,totalCart:totalCart});
    //         }
    //     })
    // }
});

app.post("/music",(req,res) =>{
    const {title} = req.body;
    // console.log(title);
    musicRecord.find({musicName:`${title}`},{'_id':0},(err,result)=>{
        if (!err){
            var musicList = result;
            var username;
            var loggedIn;
            var totalCart = 0;
            musicRecord.distinct("category", (err,result) =>{
                if (!err){
                    var categoryList = result;
                    if (!req.session.username){
                        username="There";
                        loggedIn=false;
                        if (!req.session.cart){
                            // console.log("not logged in and no items");
                            totalCart = 0;
                            res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                
                        }
                        else{
                            // console.log("not logged in and no items");
                            for (var i=0;i<req.session.cart.length;i++){
                                var itemInCart = req.session.cart[i];
                                totalCart += itemInCart.quantity;
                            }
                            res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                        }
                    }
                    else{
                        username = req.session.username;
                        loggedIn=true;
                        cartRecord.find({UserId: username}, (err,result) =>{
                            if (result.length==0){
                                // console.log("logged in user has no items");
                                totalCart = 0;
                                res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                            }
                            else{
                                // console.log("logged in user has items");
                                for (var i=0; i<result.length; i++){
                                    // console.log(result[i].quantity);
                                    totalCart += result[i].quantity;
                                }
                                res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart,categoryList: categoryList});
                            }
                        })
        
                    }
                    
                }
            })
            // if (!req.session.username){
            //     username="There";
            //     loggedIn=false;
            //     if (!req.session.cart){
            //         // console.log("not logged in and no items");
            //         totalCart = 0;
            //         res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart});
        
            //     }
            //     else{
            //         // console.log("not logged in and no items");
            //         for (var i=0;i<req.session.cart.length;i++){
            //             var itemInCart = req.session.cart[i];
            //             totalCart += itemInCart.quantity;
            //         }
            //         res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //     }
            // }
            // else{
            //     username = req.session.username;
            //     loggedIn=true;
            //     cartRecord.find({UserId: username}, (err,result) =>{
            //         if (result.length==0){
            //             // console.log("logged in user has no items");
            //             totalCart = 0;
            //             res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //         else{
            //             // console.log("logged in user has items");
            //             for (var i=0; i<result.length; i++){
            //                 // console.log(result[i].quantity);
            //                 totalCart += result[i].quantity;
            //             }
            //             res.render("music",{title:title,musicList:musicList,username:username,loggedIn:loggedIn,totalCart:totalCart});
            //         }
            //     })

            // }
        }
    })
});


app.get("/cart", (req,res) =>{
    var username;
    var loggedIn;
    var totalCart = 0;
    if (!req.session.username){
        var cartList = [];
        username="There";
        loggedIn = false;
        if (!req.session.cart){
            // console.log("not logged in and no items");
            totalCart = 0;
            res.render("cart",{username:username,loggedIn:loggedIn,cartList:cartList,totalCart:totalCart});
        }
        else{
            cartList = req.session.cart;
            // console.log("not logged in and no items");
            for (var i=0;i<req.session.cart.length;i++){
                var itemInCart = req.session.cart[i];
                totalCart += itemInCart.quantity;
            }
            res.render("cart",{username:username,loggedIn:loggedIn,cartList:cartList,totalCart:totalCart});
        }
    }
    else{
        username = req.session.username;
        loggedIn = true;
        cartRecord.find({UserId: username},(err,result) =>{
            var cartList = result;
            cartRecord.find({UserId: username}, (err,result) =>{
                if (result.length==0){
                    // console.log("logged in user has no items");
                    totalCart = 0;
                    res.render("cart",{username:username,loggedIn:loggedIn,cartList:cartList,totalCart:totalCart});
                }
                else{
                    // console.log("logged in user has items");
                    for (var i=0; i<result.length; i++){
                        // console.log(result[i].quantity);
                        totalCart += result[i].quantity;
                    }
                    res.render("cart",{username:username,loggedIn:loggedIn,cartList:cartList,totalCart:totalCart});
                }
            })
        })
    }


});

app.post("/cart",(req,res) =>{
    const {quantity,musicId,musicName,price} = req.body;
    // console.log(quantity);
    // console.log(musicId);
    // console.log(musicName);
    
    /*if not logged in*/
    if (!req.session.username){
        // console.log(req.session.sessionID);
        // console.log("Before");
        // console.log(req.session.cart);
        var cartItem = {musicId:parseInt(musicId),UserId:"",quantity:parseInt(quantity),musicName:musicName,price:parseInt(price)};
        if (!req.session.cart){
            let tempCart = [];
            tempCart.push(cartItem);
            req.session.cart = tempCart;
        }
        else{
            var newEntry = true;
            for (var i = 0; i < req.session.cart.length; i++){
                if (cartItem.musicName==req.session.cart[i].musicName){
                    req.session.cart[i].quantity += 1;
                    newEntry = false;
                }
            }
            if (newEntry){
                req.session.cart.push(cartItem);
            }
        }
        // console.log("After");
        // console.log(req.session.cart);
        // console.log("");
        req.session.save();
    }
    /*if logged in*/
    else{
        var username = req.session.username;
        cartRecord.find({UserId: username}, (err,result) =>{
            console.log(result);
            /* if user dont have a cart/ EMPTY cart */
            if (result.length==0){
                console.log("logged in but no items in cart yet");
                var newCart = new cartRecord({
                    musicId: musicId,
                    UserId: username,
                    quantity: quantity,
                    musicName:musicName,
                    price:price
                });
                newCart.save((err,result) =>{
                    console.log("new cart record with login");
                });
            }
            /*if user have items in their cart*/
            else{
                console.log("logged in with some items in cart");
                cartRecord.find({musicId: musicId, UserId: username},{quantity: 1}, (err,result) =>{
                    /* if the current music is not in the cart yet, ADD RECORD*/
                    if (result.length==0){
                        console.log("logged in but current music is not in the cart");
                        var newCart = new cartRecord({
                            musicId: musicId,
                            UserId: username,
                            quantity: quantity,
                            musicName:musicName,
                            price:price
                        });
                        newCart.save((err,result) =>{
                            // console.log("new cart record");
                        });
                    }
                    /*if the current music is in cart, UPDATE RECORD */
                    else{
                        console.log("logged in with current music in cart");
                        cartRecord.updateOne({musicId: musicId, UserId: username},{$inc:{quantity:quantity}}, (err,result) =>{
                            if(!err){
                                console.log("updated");
                            }
                        })
                    }
                })
            }
        })
    }
});



app.get("/checkout", (req, res) =>{
    var orderList;
    var loggedIn;
    if (req.session.username){
        cartRecord.find({UserId: req.session.username}, (err,result) =>{
            orderList = result;
            loggedIn = true
            res.render("checkout",{orderList:orderList,loggedIn:loggedIn});
        })
    }
    else{
        if (req.session.cart){
            orderList = req.session.cart;
        }
        else{
            orderList = [];
        }
        loggedIn = false;
        res.render("checkout",{orderList:orderList,loggedIn:loggedIn});
    }

    // res.render("checkout");
});

app.post("/checkUsername", (req,res) =>{
    const username = req.body.username;
    let userIsTaken;
    // console.log(username);
    loginRecord.find({UserId:username}, (err,result) =>{
        if (result.length==0){
            userIsTaken = false;
            res.send({response: userIsTaken});
        }
        else{
            userIsTaken = true;
            res.send({response: userIsTaken});

        }
    })
});

app.post("/main", (req,res) =>{
    const keywords = req.body.keywords;

    async function getMusic(keywords){
        const result = await musicRecord.find({$or: [ {musicName:{$regex: keywords}}, {composer: {$regex: keywords}} ]});
        return result;
    }
    async function callGetMusic(){
        console.log("starting...");
        let musicList=[]
        try{
            for (var i=0; i<keywords.length;i++){
                let searchedMusic = await getMusic(keywords[i]);
                musicList.push.apply(musicList, searchedMusic);
            }
            // let searchedMusic = await getMusic(keywords);
            console.log(musicList);
            res.send({response: musicList});
        }
        catch(err){
            console.log(err);
        }
    }
    callGetMusic();

})

app.get("/invoice", (req,res) =>{
    res.render("invoice");
});

app.post("/invoice", (req,res) =>{
    const invoiceList = req.body;
    // console.log(invoiceList);
    console.log(invoiceList);

    if (invoiceList.hasOwnProperty("username") && invoiceList.hasOwnProperty("password")){
        var newLogin = new loginRecord({
            UserId: invoiceList.username,
            PW: invoiceList.password
        });
        newLogin.save((err,result)=>{
            if (!err){
                var orderList = req.session.cart;
                req.session.cart =[];
                req.session.username = invoiceList.username;
                res.render("invoice", {orderList: orderList, invoiceList: invoiceList});
            }
        });
    }
    else{
        async function deleteUserCart(){
            await cartRecord.deleteMany({userId :req.session.username});
        }
    
        async function getUserCart(){
            const orderList = await cartRecord.find({UserId:req.session.username});
            deleteUserCart();
            res.render("invoice", {orderList:orderList, invoiceList: invoiceList});
        }
    
        getUserCart();

    }
    // cartRecord.find({UserId: req.session.username}, (err,result) =>{
    //     var orderList = result;
    //     res.render("invoice",{orderList:orderList,invoiceList:invoiceList});
    // });

});

app.post("/deleteItem", (req, res) =>{
    const musicName = req.body.musicName;
    // console.log(musicName);
    if (!req.session.username){
        if (req.session.cart){
            console.log("remove item from session");
            console.log(req.session.cart);
            var newCart = [];
            for (var i=0; i < req.session.cart.length; i++){
                if (musicName!= req.session.cart[i].musicName){
                    newCart.push(req.session.cart[i]);
                }
            }
            req.session.cart = newCart;
            req.session.save();
            console.log(req.session.cart);
        }
    }
    else{
        console.log("remove item from db");
        console.log(req.session.username);
        cartRecord.deleteOne({UserId:req.session.username, musicName: musicName}, (err,result) =>{
            if (err){
                console.log(err);
            }
            else{
                console.log(result);
            }
        });
    }
});



// app.post("/deleteItem", (req, res) =>{
//     const {musicName} = req.body;
//     // console.log(musicName);
//     if (!req.session.username){
//         if (req.session.cart){
//             console.log("remove item from session");
//             console.log(req.session.cart);
//             var newCart = [];
//             for (var i=0; i < req.session.cart.length; i++){
//                 if (musicName!= req.session.cart[i].musicName){
//                     newCart.push(req.session.cart[i]);
//                 }
//             }
//             req.session.cart = newCart;
//             req.session.save();
//             console.log(req.session.cart);
//         }
//     }
//     else{
//         console.log("remove item from db");
//         console.log(req.session.username);
//         cartRecord.deleteOne({UserId:req.session.username, musicName: musicName}, (err,result) =>{
//             if (err){
//                 console.log(err);
//             }
//             else{
//                 console.log(result);
//             }
//         });
//     }
// });

app.get("/logout", (req,res) =>{
    req.session.destroy( (err) =>{
        if (err){
            console.log("error in destroying session");
        }
    });
    res.render("logout");
})
// app.post("/logout", (req, res) =>{
    
// })


app.listen(3000, function () {
    console.log("Server started on port 3000");
  });