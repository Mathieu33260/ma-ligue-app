import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const TeamModel = types
    .model("Team")
    .props({
        '@id': types.string,
        id: types.identifierNumber,
        apiId: types.integer,
        name: types.string,
        code: types.maybeNull(types.string),
        logo: types.string,
        country: types.string,
        founded: types.integer,
    })
    .actions(withSetPropAction)
    .views(() => ({}))

export interface Team extends Instance<typeof TeamModel> {}
export interface TeamSnapshotOut extends SnapshotOut<typeof TeamModel> {}
export interface TeamSnapshotIn extends SnapshotIn<typeof TeamModel> {}
