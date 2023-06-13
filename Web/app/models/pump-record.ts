class PumpRecord {
    public id: string;
    public status: boolean;
    public name: string;

    constructor(data: {
        id: string;
        feed_key: string;
        value: string;
    }) {
        this.id = data.id;
        this.status = data.value === '3';
        this.name = data.feed_key;
    }
}

export default PumpRecord;
