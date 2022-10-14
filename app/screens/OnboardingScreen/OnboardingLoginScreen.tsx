import { observer } from "mobx-react-lite"
import React, {FC, useLayoutEffect, useMemo, useRef} from "react"
import {
    ActivityIndicator,
    Image, ImageStyle, TextInput,
    TextStyle, TouchableOpacity,
    View,
    ViewStyle
} from "react-native"
import {Button, Header, Icon, Screen, Text, TextField, TextFieldAccessoryProps} from "../../components"
import { useStores } from "../../models"
import { OnboardingStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
const logo = require("../../../assets/images/logo.png")

interface OnboardingLoginScreenProps extends OnboardingStackScreenProps<"OnboardingLogin"> {}

export const OnboardingLoginScreen: FC<OnboardingLoginScreenProps> = observer(function OnboardingLoginScreen(_props) {

    const passwordInput = useRef<TextInput>()
    const [isPasswordHidden, setIsPasswordHidden] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const { authenticationStore } = useStores()

    const { navigation } = _props

    const team = _props.route.params.team;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () =>
                <Header
                    RightActionComponent={
                        <TouchableOpacity
                            onPress={() => console.log('pass')}
                            style={$passContainer}
                        >
                            <Text
                                tx="onboardingScreen.pass"
                                preset="subheading"
                                style={$pass}
                            />
                            <Icon icon="caretRight" style={$backBtn} color={colors.palette.white}/>
                        </TouchableOpacity>
                    }
                    LeftActionComponent={
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Icon icon="caretLeft" style={$backBtn} color={colors.palette.white}/>
                        </TouchableOpacity>
                    }
                />,
        })
    }, [])

    const PasswordRightAccessory = useMemo(
        () =>
            function PasswordRightAccessory(props: TextFieldAccessoryProps) {
                return (
                    <Icon
                        icon={isPasswordHidden ? "view" : "hidden"}
                        color={colors.palette.neutral800}
                        containerStyle={props.style}
                        onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                    />
                )
            },
        [isPasswordHidden],
    )

    const TextSendBtn = () => {
        return (
            isLoading ? (
                <ActivityIndicator />
            ) : (
                <Text tx="onboardingScreen.continue" preset="bold" style={$sendText}></Text>
            )
        )
    };

    return (
        <Screen
            preset="fixed"
            safeAreaEdges={["top", "bottom"]}
            contentContainerStyle={$full}
        >
            <View style={$logoContainer}>
                <Image source={logo} style={$logoImage} />
            </View>

            <Text testID="signin" tx="onboardingScreen.signin" preset="subheading" style={$signIn} />

            <TextField
                value={email}
                onChangeText={setEmail}
                containerStyle={$textField}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                labelTx="onboardingScreen.emailFieldLabel"
                placeholderTx="onboardingScreen.emailFieldPlaceholder"
                onSubmitEditing={() => passwordInput.current?.focus()}
            />

            <TextField
                ref={passwordInput}
                value={password}
                onChangeText={setPassword}
                containerStyle={$textField}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry={isPasswordHidden}
                labelTx="onboardingScreen.passwordFieldLabel"
                placeholderTx="onboardingScreen.passwordFieldLabel"
                onSubmitEditing={() => {
                    setIsLoading(true);
                    authenticationStore.createUser(email, password, team)
                }}
                RightAccessory={PasswordRightAccessory}
            />

            <Button
                style={!(email && password) || isLoading === true ? $continueBtnDisabled : $continueBtn}
                disabled={!(email && password) || isLoading === true}
                onPress={() => {
                    setIsLoading(true);
                    authenticationStore.createUser(email, password, team)
                }}
            >
                <TextSendBtn/>
            </Button>

        </Screen>

    )
})

const $full: ViewStyle = {
    flex: 1,
}

const $continueBtn: ViewStyle = {
    backgroundColor: colors.palette.ligue1.yellowGreen,
    marginTop: spacing.extraLarge,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.palette.ligue1.yellowGreen,
}

const $continueBtnDisabled: ViewStyle = {
    marginTop: spacing.extraLarge,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.palette.ligue1.yellowGreen,
    opacity: .2,
    backgroundColor: colors.palette.ligue1.yellowGreen,
}

const $logoContainer: ViewStyle = {
    alignSelf: "center",
    height: 56,
    marginTop: spacing.huge,
}

const $logoImage: ImageStyle = {
    height: 42,
    width: 77,
}

const $sendText: TextStyle = {
    fontSize: 17,
    color: colors.palette.ligue1.darkBlue,
    fontWeight: "bold",
}

const $textField: ViewStyle = {
    marginBottom: spacing.large,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.transparent,
}

const $signIn: TextStyle = {
    marginTop: spacing.large,
    marginBottom: spacing.large,
    fontSize: 16,
    width: "90%",
    alignSelf: "center",
    textAlign: "justify",
}

const $backBtn: ImageStyle = {
    height: 20,
    width: 20,
}

const $passContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: 'center',
}

const $pass: TextStyle = {
    fontSize: 14,
    textAlign: 'center',
}
