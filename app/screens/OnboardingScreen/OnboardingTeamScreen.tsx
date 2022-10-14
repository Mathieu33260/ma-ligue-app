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
import {Header, Icon, Screen, Text} from "../../components"
import { useStores } from "../../models"
import { OnboardingStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { Team } from '../../models/Team';
const logo = require("../../../assets/images/logo.png")

interface OnboardingTeamScreenProps extends OnboardingStackScreenProps<"OnboardingTeam"> {}

export const OnboardingTeamScreen: FC<OnboardingTeamScreenProps> = observer(function OnboardingTeamScreen(_props) {

    const [isLoading, setIsLoading] = React.useState(false)

    const { teamStore } = useStores()

    const { navigation } = _props

    useEffect(() => {
        ;(async function load() {
            setIsLoading(true)
            await teamStore.fetchTeams(_props.route.params.league)
            setIsLoading(false)
        })()
    }, [teamStore])

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

    return (
        <Screen
            preset="fixed"
            safeAreaEdges={["top", "bottom"]}
            contentContainerStyle={$full}
        >
            <View style={$logoContainer}>
                <Image source={logo} style={$logoImage} />
            </View>

            <Text testID="choose-team" tx="onboardingScreen.chooseTeam" preset="subheading" style={$chooseTeam} />

            <FlatList<Team>
                data={teamStore.teamsForList}
                numColumns={4}
                extraData={teamStore.teams.length}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text testID="no-league" tx="onboardingScreen.emptyLeague" preset="heading" />
                    )
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('OnboardingLogin', { team: item['@id'] })
                        }}
                        style={$containerTeam}
                    >
                        <Image key={item.id} source={{uri: item.logo}} style={$logoTeam} />
                    </TouchableOpacity>
                )}
            />

        </Screen>

    )
})

const $full: ViewStyle = {
    flex: 1,
}

const $chooseTeam: TextStyle = {
    alignSelf: "center",
    marginTop: spacing.large,
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

const $logoTeam: ImageStyle = {
    height: 50,
    width: 50,
    alignSelf: 'center',
}

const $containerTeam: ViewStyle = {
    width: '25%',
    marginTop: spacing.extraLarge,
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: colors.transparent,
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
