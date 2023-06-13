import PumpRecord from '../models/pump-record';
import TemperatureRecord from '../models/temperature-record';
import HumidityRecord from '../models/humidity-record';
import sendHttpRequest from '../utils/request-api';

// type Mutable<T> = {
//     -readonly [k in keyof T]: T[k];
// };

class IotServer {
    private static instance: IotServer;
    private username: string;
    private password: string;

    private pumpCallbacks: ((result: PumpRecord) => void)[] = [];
    private temperatureCallbacks: ((result: TemperatureRecord) => void)[] = [];
    private humidityCallbacks: ((result: HumidityRecord) => void)[] = [];

    private constructor() {
        this.username = 'HungNguyenHung';
        this.password = '#';

        setInterval(this.update.bind(this), 6000);
    }

    public static getInstance(): IotServer {
        if (!IotServer.instance) {
            IotServer.instance = new IotServer();
        }
        return IotServer.instance;
    }

    public async getPumpRecord(): Promise<PumpRecord | null> {
        try {
            var res = await sendHttpRequest(
                `https://io.adafruit.com/api/v2/${this.username}/feeds/bbc-pump/data`,
                'GET',
                undefined,
                this.password,
            );
                return new PumpRecord(res.data[0]);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async getTemperatureRecord(): Promise<TemperatureRecord | null> {
        try {
            var res = await sendHttpRequest(
                `https://io.adafruit.com/api/v2/${this.username}/feeds/bbc-temp/data`,
                'GET',
                undefined,
                this.password,
            );
            return TemperatureRecord.factory(res.data[0]);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async getHumidityRecord(): Promise<HumidityRecord | null> {
        try {
            var res = await sendHttpRequest(
                `https://io.adafruit.com/api/v2/${this.username}/feeds/bbc-humi/data`,
                'GET',
                undefined,
                this.password,
            );
            
            return HumidityRecord.factory(res.data[0]);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    

    public subscribePump(callback: (result: PumpRecord) => void): void {
        this.getPumpRecord().then((result) => {
            if (result !== null) callback(result);
        });
        this.pumpCallbacks.push(callback);
    }

    public subscribeTemperature(
        callback: (result: TemperatureRecord) => void,
    ): void {
        this.getTemperatureRecord().then((result) => {
            if (result !== null) callback(result);
        });
        this.temperatureCallbacks.push(callback);
    }

    public subscribeHumidity(callback: (result: HumidityRecord) => void): void {
        this.getHumidityRecord().then((result) => {
            if (result !== null) callback(result);
        });
        this.humidityCallbacks.push(callback);
    }

    private async update(): Promise<void> {
        const records = await Promise.all([
            this.getPumpRecord(),
            this.getTemperatureRecord(),
            this.getHumidityRecord(),
        ]);
        const listOfListOfCallbacks = [
            this.pumpCallbacks,
            this.temperatureCallbacks,
            this.humidityCallbacks,
        ];

        for (let i = 0; i < listOfListOfCallbacks.length; ++i)
            listOfListOfCallbacks[i].forEach((callback) => {
                if (records[i] !== null) callback(records[i]);
            });
    }

    public async setPump(state: boolean): Promise<boolean> {
        try {
            const data = {
                id: '11',
                name: 'RELAY',
                data: state ? 3 : 2,
                unit: '',
            };
            const body = {
                value: data.data,
            };
            var res = await sendHttpRequest(
                `https://io.adafruit.com/api/v2/${this.username}/feeds/bbc-pump/data`,
                'POST',
                body,
                this.password,
            );
            return res.status === 200;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async getDeviceTypes(): Promise<string[]> {
        // return ['relay', 'dht11', 'soil-sensor'];
        // return new Promise((resolve, reject) => {resolve(['relay', 'dht11', 'soil-sensor'])});
        return Promise.resolve(['relay', 'dht11']);
    }

    public async getTopics(): Promise<string[]> {
        const res = await sendHttpRequest(
            `https://io.adafruit.com/api/v2/${this.username}/feeds/`,
            'GET',
            undefined,
            this.password,
        );
        return res.data.map((e) => 'HungNguyenHung/feeds/' + e.key);
    }

    public async createTopic(name: string): Promise<string> {
        const url = `https://io.adafruit.com/api/v2/${this.username}/feeds/`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-AIO-Key': this.password,
            },
            body: JSON.stringify({
                feed: {
                    name: name
                }
            })
        });
        const data = await res.json();
        const key = data['key'];
        return `${this.username}/feeds/${key}`;
    }
}

export default IotServer;