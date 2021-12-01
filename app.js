const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const connectMongo = require('connect-mongo')
const { ensureLoggedIn } = require('connect-ensure-login');
const { roles } = require('./utils/constants');

// Initialization
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
// app.use('/*',express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoStore = connectMongo(session)
//init session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            //secure:true
            httpOnly: true,
        },
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);
//passport js authentication
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

app.use((req, res, next) => {
    //res.locals.guide = req.guide 
    res.locals.user = req.user
    next()
})
//connect flash
app.use(connectFlash())
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});
//routes
app.use('/', require('./routes/index.route'))
app.use('/auth', require('./routes/auth.route'))


app.use('/user',
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/user.route')
)

app.use('/api',
    // ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/api.route')
)

app.use('/sites',
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/sites.route')
)

app.use('/explore',ensureTourist,
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/explore.route')
)

app.use('/profile',ensureTourist,
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/profile.route')
)

app.use('/info',
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/info.route')
)

app.use('/post',
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    require('./routes/post.route')
)
app.use('/admin',
    ensureLoggedIn({ redirectTo: '/auth/login' })
    , ensureAdmin, require('./routes/admin.route'))


//404 handlers
app.use((req, res, next) => {
    next(createHttpError.NotFound())
})


//error handlers
app.use((error, req, res, next) => {
    error.status = error.status || 500
    res.status(error.status)
    res.render('error_40x', { error })
})


//setting the port
const PORT = process.env.PORT || 3000


//making a connection to mongodb
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,

}).then(() => {
    console.log("connected")
    app.listen(PORT, () => {
        console.log(`server run at ${PORT}`)
    })
}).catch(err => console.log(err.message))


function ensureAdmin(req, res, next) {
    if (req.user.role === roles.admin) {
        next();
    } else {
        req.flash('warning', 'you are not Authorized to see this route');
        res.redirect('/');
    }
}

function ensureTourist(req, res, next) {
    if (req.user.role === 'Tourist') {
        next();
    } else {
        req.flash('warning', 'you are not Authorized to see this route');
        res.redirect('/');
    }
}
function ensureGuide(req, res, next) {
    if (req.user.role === 'Guide') {
        next();
    } else {
        req.flash('warning', 'you are not Authorized to see this route');
        res.redirect('/');
    }
}