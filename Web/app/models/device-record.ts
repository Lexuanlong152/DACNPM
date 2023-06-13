import firebase from 'firebase/compat';

class DeviceRecord {
    public id: string;
    public name: string;
    public topic: string;
    public type: string;

    static factory(data: {
        id: string;
        name: string;
        topic: string;
        type: string;
    }) {
        return new DeviceRecord(data.id, data.name, data.topic, data.type);
    }

    static databaseFactory(
        data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    ): DeviceRecord {
        return new DeviceRecord(
            data.get('id'),
            data.get('name'),
            data.get('topic'),
            data.get('type'),
        );
    }

    // constructor(data: {id: string, name: string, data: string, unit: string}) {
    //     this.id = +data.id;
    //     this.value = +data.data.split('-')[0];
    //     this.name = data.name;
    // }

    private constructor(id: string, name: string, topic: string, type: string) {
        this.id = id;
        this.name = name;
        this.topic = topic;
        this.type = type;
    }

    public toObject(): Object {
        return {
            id: this.id,
            name: this.name,
            topic: this.topic,
            type: this.type,
        };
    }
}

export default DeviceRecord;
