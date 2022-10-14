import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {TeamModel} from './Team';

export const TeamStoreModel = types
    .model("TeamStore")
    .props({
        teams: types.array(TeamModel),
    })
    .actions(withSetPropAction)
    .actions((store) => ({
        async fetchTeams(leagueId) {
            const response = await api.getTeams(leagueId)
            if (response.kind === "ok") {
                store.setProp("teams", response.teams)
            } else {
                console.tron.error(`Error fetching teams: ${JSON.stringify(response)}`, [])
            }
        },
    }))
    .views((store) => ({
        get teamsForList() {
            return store.teams
        },
    }))
    .actions(() => ({}))

export interface TeamStore extends Instance<typeof TeamStoreModel> {}
export interface TeamStoreSnapshot extends SnapshotOut<typeof TeamStoreModel> {}
