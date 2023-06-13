import firebase from 'firebase/compat';

class User {
    public username: string;
    public email: string;
    public userId: string;
    public avt: string;
    public isManager: boolean;

    static factory(userData: firebase.User, isManager: boolean): User {
        return new User(
            userData.displayName,
            userData.email,
            userData.uid,
            userData.photoURL,
            isManager,
        );  
    }

    private constructor(
        username: string,
        email: string,
        userId: string,
        avt: string,
        isManager: boolean,
    ) {
        this.username = username;
        this.email = email;
        this.userId = userId;
        this.avt = avt;
        this.isManager = isManager;
    }
}

export default User;