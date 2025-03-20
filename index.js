require('dotenv').config();

const express = require("express");
const passport = require("passport");
const path = require("path");
const session = require("express-session");

const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const GithubStrategy = require("passport-github2");
const TwitterStrategy = require("passport-twitter");
const DiscordStrategy = require("passport-discord");
const SteamStrategy = require("passport-steam");

const app = express();

const home_file_path = path.join(__dirname, '/index.html');
const PORT = 3000;

app.use(session({
    secret: "learn",
    resave: false,
    saveUninitialized: true
})) //*session settings

//*initialise passport and sessions
app.use(passport.initialize());
app.use(passport.session());


//?MENTION ALL STRATEGIES YOUR APP WILL INTEGRATE

passport.use( //*specify what the passport need to do and fetch info
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://social-logins-4xozqqnor-sanchitagarwal7s-projects.vercel.app/auth/google/callback'
    }, (accessToken, refreshToken, profile, done)=>{ //*get access token -> refresh the token -> get profile ->  done
        return done(null, profile);     //* when done -> return the profile
        } 
    )
);

passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'https://social-logins.vercel.app/auth/facebook/callback'
    }, (accessToken, refreshToken, profile, done)=>{
        return done(null, profile);
    })
)

passport.use(
    new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'https://social-logins.vercel.app/auth/github/callback'
    }, (accessToken, refreshToken, profile, done)=>{
        return done(null, profile);
    })
);

passport.use(
    new TwitterStrategy({
        consumerKey: process.env.TWITTER_CLIENT_ID,
        consumerSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: 'https://social-logins.vercel.app/auth/twitter/callback'
    }, (token, tokenSecret, profile, done)=>{
        return done(null, profile);
    })
)

let scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(
    new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: 'https://social-logins.vercel.app/auth/discord/callback',
        scope: scopes
    }, (accessToken, refreshToken, profile, done)=>{
        return done(null, profile);
    })
);

passport.use(
    new SteamStrategy({
        returnURL: 'https://social-logins.vercel.app/auth/steam/callback',
        realm: 'https://social-logins.vercel.app/',
        profile: false,
        apiKey: null
    }, (identifier, profile, done)=>{
        return done(null, profile);
    })
)

//? SERIALISE AND DESERIALISE USERS
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res)=>{
    res.sendFile(home_file_path)
});

//! GOOGLE
app.get("/auth/google", 
    passport.authenticate('google', {scope: ["profile", "email"]})
); //* when we reach this link, we want to get profile and email using google strategy

app.get("/auth/google/callback", passport.authenticate('google', {failureRedirect: "/"}), (req, res)=>{
    res.redirect("/profile"); //* if successful
})

//! FACEBOOK, need to make it live so as for this login to work
app.get("/auth/facebook", 
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);

app.get("/auth/facebook/callback", passport.authenticate('facebook', {failureRedirect: "/"}), (req, res)=>{
    res.redirect("/profile")
})

//! GITHUB
app.get("/auth/github", 
    passport.authenticate('github', { scope: [ 'user:email' ] })
)

app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: "/"}), (req, res)=>{
    res.redirect("/profile")
})

//! TWITTER, need to make it live so as for this login to work
app.get("/auth/twitter", 
    passport.authenticate('twitter')
)

app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: "/"}), (req, res)=>{
    res.redirect("/profile")
})

//! DISCORD
app.get("/auth/discord", 
    passport.authenticate('discord')
)

app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: "/"}), (req, res)=>{
    res.redirect("/profile_discord")
})

//! STEAM
app.get("/auth/steam", 
    passport.authenticate('steam')
)

app.get('/auth/steam/callback', passport.authenticate('steam', {failureRedirect: "/"}), (req, res)=>{
    res.redirect('/profile')
})

app.get("/profile", (req, res)=>{
    res.send(`Welcome user: ${req.user.displayName} with email: ${req.user.emails[0].value}`) //* remember we have profile and email in req
})

app.get("/profile_discord", (req, res)=>{
    const user = req.user; // User data from Discord
    res.send(`Welcome user: ${user.username}#${user.discriminator} with email: ${user.email}`);
})

app.listen(PORT, ()=>{
    console.log(`Running on ${PORT}`);
})














