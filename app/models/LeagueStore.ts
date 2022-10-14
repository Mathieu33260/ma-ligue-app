import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { LeagueModel } from "./League"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const LeagueStoreModel = types
    .model("LeagueStore")
    .props({
        leagues: types.array(LeagueModel),
    })
    .actions(withSetPropAction)
    .actions((store) => ({
        async fetchLeagues() {
            const response = await api.getLeagues()
            if (response.kind === "ok") {
                store.setProp("leagues", response.leagues)
            } else {
                console.tron.error(`Error fetching leagues: ${JSON.stringify(response)}`, [])
            }
        },
    }))
    .views((store) => ({
        get leaguesForList() {
            return store.leagues
        },
    }))
    .actions(() => ({}))

export interface LeagueStore extends Instance<typeof LeagueStoreModel> {}
export interface LeagueStoreSnapshot extends SnapshotOut<typeof LeagueStoreModel> {}
