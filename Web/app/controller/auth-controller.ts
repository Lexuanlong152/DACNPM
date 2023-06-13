import User from '../models/user';
import firebase from '../config/firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class AuthController {
    private static instance: AuthController;
    private static user: User;

    public static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public getCurrentUser(): User {
        return AuthController.user;
    }

    public async login(): Promise<boolean> {
        try {
            var result = await firebase
                .auth()
                .signInWithPopup(new firebase.auth.GoogleAuthProvider());
            var curUser = result.user;
            
            var manRes = await firebase
                .firestore()
                .collection('employees')
                .where(
                    firebase.firestore.FieldPath.documentId(),
                    '==',
                    curUser.email,
                )
                .where('isManager', '==', true)
                .get();
            
            if (curUser) {
                AuthController.user = User.factory(
                    curUser,
                    manRes.docs.length > 0,
                );
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            this.logout();
            AuthController.user = null;
            return false;
        }
    }

    public async logout(): Promise<boolean> {
        try {
            await firebase.auth().signOut();
            AuthController.user = null;
            return true;
        } catch (error) {
            return false;
        }
    }

    public getAuthenticateState(callback: (user: User) => void): void {
        firebase.auth().onAuthStateChanged((curUser) => {
            if (curUser) {
                firebase
                    .firestore()
                    .collection('employees')
                    .where(
                        firebase.firestore.FieldPath.documentId(),
                        '==',
                        curUser.email,
                    )
                    .where('isManager', '==', true)
                    .get()
                    .then((res) => {
                        AuthController.user = User.factory(
                            curUser,
                            res.docs.length > 0,
                        );
                        callback(AuthController.user);
                    });
            } else {
                callback(null);
            }
        });
    }
}

export default AuthController;