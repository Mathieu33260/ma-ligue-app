import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const UserModel = types
    .model("User")
    .props({
        '@id': types.string,
        id: types.identifierNumber,
        email: types.string,
        favoriteTeam: types.string,
    })
    .actions(withSetPropAction)
    .views(() => ({}))

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
