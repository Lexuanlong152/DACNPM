import firebase from 'firebase/compat';

class Location {
    public id: string;
    public name: string;
    public description: string;
    public date: Date;

    static factory(
        data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    ): Location {
        return new Location(
            data.id,
            data.get('name'),
            data.get('description'),
            data.get('date').toDate(),
        );
    }

    private constructor(
        id: string,
        name: string,
        description: string,
        date: Date,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
    }
}

export default Location;