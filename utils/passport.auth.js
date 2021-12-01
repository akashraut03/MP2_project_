const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')

passport.use(
    new LocalStrategy({
            usernameField: 'Username',
            passwordField: 'Password',
        },
        async (Username, Password, done) => {
            try {
                const user = await User.findOne({Username})
                if (!user) 
                {
                    return done(null, false,{message: "Username not registered",})
                } 
                else 
                {
                    const isMatch = await user.isValidPassword(Password)
                    return isMatch ? done(null, user) : 
                    done(null, false, {message: "Incorrect password"})
                }
            } catch (error) {
                done(error)
            }
        }
    )
)


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});