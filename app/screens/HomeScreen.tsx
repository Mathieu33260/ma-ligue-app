import { observer } from "mobx-react-lite"
import React, {
    FC,
    useLayoutEffect, // @demo remove-current-line
} from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
    Button, // @demo remove-current-line
    Header, Screen, // @demo remove-current-line
    Text,
} from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models" // @demo remove-current-line
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { colors, spacing } from "../theme"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {} // @demo remove-current-line

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(
    _props,
) {
    const { navigation } = _props
    const {
        authenticationStore: { logout },
    } = useStores()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => <Header rightTx="common.logOut" onRightPress={logout} />,
        })
    }, [])

    return (
        <Screen
            preset="fixed"
            safeAreaEdges={["top", "bottom"]}
            contentContainerStyle={$container}
        >
            <Text>toto</Text>
        </Screen>
    )
})

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}
