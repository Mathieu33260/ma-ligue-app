import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const LeagueModel = types
    .model("League")
    .props({
            '@id': types.string,
            id: types.identifierNumber,
            apiId: types.integer,
            name: types.string,
            type: types.string,
            logo: types.string,
            country: types.string,
            flag: types.string,
            season: types.integer,
            start: types.string,
            end: types.string,
    })
    .actions(withSetPropAction)
    .views(() => ({}))

export interface League extends Instance<typeof LeagueModel> {}
export interface LeagueSnapshotOut extends SnapshotOut<typeof LeagueModel> {}
export interface LeagueSnapshotIn extends SnapshotIn<typeof LeagueModel> {}
