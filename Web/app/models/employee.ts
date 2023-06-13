import firebase from 'firebase/compat';

class Employee {
    public email: string;
    public locations: string[];
    public isManager: boolean;
    public date: Date;

    static factory(
        data: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
    ): Employee {
        return new Employee(
            data.id,
            data.get('locations'),
            data.get('isManager'),
            data.get('date').toDate(),
        );
    }

    private constructor(
        email: string,
        locations: string[],
        isManager: boolean,
        date: Date,
    ) {
        this.email = email;
        this.locations = locations;
        this.isManager = isManager;
        this.date = date;
    }
}

export default Employee;