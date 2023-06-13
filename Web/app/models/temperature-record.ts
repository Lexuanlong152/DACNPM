import firebase from 'firebase/compat';

class TemperatureRecord {
    public id: string;
    public deviceId: number; 
    public value: number;
    public name: string;
    public collectedTime: Date;

    static factory(data: {
        id: string,
        feed_id: number;
        feed_key: string;
        value: string;
        created_at: Date;
    }): TemperatureRecord {
        return new TemperatureRecord(
            data.id,
            +data.feed_id,
            +data.value,
            data.feed_key,
            data.created_at,
        );
    }

    static databaseFactory(
        data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    ): TemperatureRecord {
        return new TemperatureRecord(
            data.get('id'),
            +data.get('deviceId'),
            +data.get('value'),
            '',
            data.get('collectedTime'),
        );
    }

    // constructor(data: {id: string, name: string, data: string, unit: string}) {
    //     this.id = +data.id;
    //     this.value = +data.data.split('-')[0];
    //     this.name = data.name;
    // }

    private constructor(id: string, deviceId: number, value: number, name: string, collectedTime: Date) {
        this.id = id;
        this.deviceId = deviceId;
        this.value = value;
        this.name = name;
        this.collectedTime = collectedTime;
    }
}

export default TemperatureRecord;
