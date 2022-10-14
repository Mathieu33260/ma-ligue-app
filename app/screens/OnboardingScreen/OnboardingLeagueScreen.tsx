import { observer } from "mobx-react-lite"
import React, {FC, useEffect, useLayoutEffect} from "react"
import {
    ActivityIndicator,
    FlatList,
    Image, ImageStyle,
    TextStyle, TouchableOpacity,
    View,
    ViewStyle
} from "react-native"
import {Button, Header, Icon, Screen, Text} from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import {League} from '../../models/League';
const logo = require("../../../assets/images/logo.png")

interface OnboardingLeagueScreenProps extends AppStackScreenProps<"OnboardingLeague"> {}

export const OnboardingLeagueScreen: FC<OnboardingLeagueScreenProps> = observer(function OnboardingLeagueScreen(_props) {

    const [isLoading, setIsLoading] = React.useState(false)

    const { leagueStore } = useStores()

    const { navigation } = _props

    useEffect(() => {
        ;(async function load() {
            setIsLoading(true)
            await leagueStore.fetchLeagues()
            setIsLoading(false)
        })()
    }, [leagueStore])

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
                />,
        })
    }, [])

    return (
        <Screen
            preset="fixed"
            safeAreaEdges={["top"]}
            contentContainerStyle={$full}
        >
            <View style={$logoContainer}>
                <Image source={logo} style={$logoImage} />
            </View>

            <Text testID="welcome-heading" tx="onboardingScreen.welcome" preset="bold" style={$welcome} />

            <Text testID="choose-league" tx="onboardingScreen.chooseLeague" preset="subheading" style={$chooseLeague} />

            <FlatList<League>
                data={leagueStore.leaguesForList}
                extraData={leagueStore.leagues.length}
                scrollEnabled={false}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text testID="no-league" tx="onboardingScreen.emptyLeague" preset="heading" style={$signIn} />
                    )
                }
                renderItem={({ item }) => (
                    <Button
                        key={item.id}
                        testID={`league-${item.id}`}
                        style={item.apiId === 61 ? $league61 : $league62}
                        RightAccessory={() => (
                            <Image source={{uri: item.logo}} style={$logoLeague} />
                        )}
                        onPress={() => {
                            navigation.navigate('OnboardingTeam', { league: item.id })
                        }}
                    >
                        <Text preset="bold" style={$leagueText}>
                            { item.name }
                        </Text>
                    </Button>
                )}
            />
        </Screen>

    )
})

const $full: ViewStyle = {
    flex: 1,
}

const $league61: ViewStyle = {
    backgroundColor: colors.palette.ligue1.yellowGreen,
    marginTop: spacing.extraLarge,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.palette.ligue1.yellowGreen,
}

const $league62: ViewStyle = {
    backgroundColor: colors.palette.ligue2.yellowGreen,
    marginTop: spacing.extraLarge,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.palette.ligue2.yellowGreen,
}

const $leagueText: TextStyle = {
    fontSize: 17,
    color: colors.palette.ligue1.darkBlue,
    fontWeight: "bold",
}

const $welcome: TextStyle = {
    alignSelf: "center",
    fontSize: 26,
    marginTop: spacing.huge,
}

const $chooseLeague: TextStyle = {
    alignSelf: "center",
    marginTop: spacing.extraLarge,
    fontSize: 16,
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

const $logoLeague: ImageStyle = {
    height: 40,
    width: 30,
    marginLeft: 30
}

const $signIn: TextStyle = {
    marginBottom: spacing.small,
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
