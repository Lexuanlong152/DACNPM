import firebase from 'firebase/compat';

class PumpHistoryRecord {
    public id: string;
    public pumpRecordid: string;
    public auto: boolean;
    public startTime: Date;
    public endTime: Date;
    public user: string;

    static factory(
        data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    ): PumpHistoryRecord {
        return new PumpHistoryRecord(
            data.id,
            data.get('pumpRecordid'),
            data.get('auto'),
            data.get('startTime').toDate(),
            data.get('endTime').toDate(),
            data.get('user'),
        );
    }

    constructor(
        id: string,
        pumpRecordid: string,
        auto: boolean,
        startTime: Date,
        endTime: Date,
        user: string,
    ) {
        this.id = id;
        this.pumpRecordid = pumpRecordid;
        this.auto = auto;
        this.startTime = startTime;
        this.endTime = endTime;
        this.user = user;
    }
}

export default PumpHistoryRecord;
