const fr = {
    common: {
        ok: "OK!",
        cancel: "Cancel",
        back: "Back",
        logOut: "Log Out",
    },
    onboardingScreen: {
        appName: "Ma Ligue",
        welcome: "Bienvenue",
        emptyLeague: "Pas de leagues",
        chooseLeague: "Sélectionnez votre ligue favorite",
        chooseTeam: "Sélectionnez votre équipe favorite",
        signin: "Dernière étape, renseigne ton email et un mot passe et c'est tout bon !",
        emailFieldLabel: "Email",
        passwordFieldLabel: "Mot de passe",
        emailFieldPlaceholder: "super@email.fr",
        continue: "Continuer",
        pass: "Passer cette étape",
    },
    loginScreen: {
        welcome: "Bienvenue",
        signIn: "Sign In",
        enterDetails:
            "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
        emailFieldLabel: "Email",
        passwordFieldLabel: "Password",
        emailFieldPlaceholder: "Enter your email address",
        passwordFieldPlaceholder: "Super secret password here",
        tapToSignIn: "Tap to sign in!",
        hint: "Hint: you can use any email address and your favorite password :)",
    },
}

export default fr
export type Translations = typeof fr
