import Location from '../models/location';
import 'firebase/compat/firestore';
import firebase from '../config/firebase';
import User from '../models/user';
import Employee from '../models/employee';
import TemperatureRecord from '../models/temperature-record';
import HumidityRecord from '../models/humidity-record';
import PumpHistoryRecord from '../models/pump-history-record';
import DeviceRecord from '../models/device-record';
import History from '../models/history';
import { ViewArray } from '@mui/icons-material';

class LocationController {
    private static instance: LocationController;

    public static getInstance(): LocationController {
        if (!LocationController.instance) {
            LocationController.instance = new LocationController();
        }
        return LocationController.instance;
    }

    public async getLocations(user: User): Promise<Location[]> {
        try {
            var employeeData = await firebase
                .firestore()
                .collection('employees')
                .doc(user.email)
                .get();
            
            if (employeeData.exists) {
                var employee = Employee.factory(employeeData);
                                  
                var res = employee.isManager
                    ? await firebase.firestore().collection('location').get()
                    : await firebase
                          .firestore()
                          .collection('location')
                          .where(
                              firebase.firestore.FieldPath.documentId(),
                              'in',
                              employee.locations,
                          )
                          .where(
                              "delete",
                              "==",
                              false
                          )
                          .get();

                return res.docs.sort((a, b) => {
                    return (a.get("date").toDate().getTime() - b.get("date").toDate().getTime())
                }).map((e) => Location.factory(e));
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    public async editLocations(id: string, name: string, description: string): Promise<Boolean> {
        try {
            await firebase
                .firestore()
                .collection('location')
                .doc(id).update({
                    name: name,
                    description: description
                });
            return true;
        } catch (error) {
            return false;
        }
    }

    public async deleteLocations(id: string): Promise<Boolean> {
        try {
            
            const query = await firebase
                .firestore()
                .collection('location')
                .doc(id)
                .get();

            query.ref.delete();
            
            return true;
        } catch (error) {
            return false;
        }
    }

    public async addLocation(
        name: string,
        description: string,
    ): Promise<boolean> {
        try {
            await firebase.firestore().collection('location').add({
                name: name,
                description: description,
                date: new Date(),
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    public async getTemperatureRecords(
        location: Location,
    ): Promise<History | null> {
        try {
            var res = await firebase
                .firestore()
                .collection('location')
                .doc(location.id)
                .collection('temperatureRecords')
                .orderBy('collectedTime', 'desc')
                .get();
            
            return History.factory(res, 'TEMPERATURE');
        } catch (error) {
            return null;
        }
    }

    public async getHumidityRecords(
        location: Location,
    ): Promise<History | null> {
        try {
            var res = await firebase
                .firestore()
                .collection('location')
                .doc(location.id)
                .collection('humidityRecords')
                .orderBy('collectedTime', 'desc')
                .get();
            return History.factory(res, 'AIR_HUMIDITY');
        } catch (error) {
            return null;
        }
    }

    public async getPumpRecords(
        location: Location,
    ): Promise<PumpHistoryRecord[]> {
        try {
            var res = await firebase
                .firestore()
                .collection('location')
                .doc(location.id)
                .collection('pumpRecords')
                .orderBy('startTime', 'desc')
                .get();
            
            return res.docs.map((e) => PumpHistoryRecord.factory(e));
        } catch (error) {
            return [];
        }
    }

    public async addPumpRecord(
        location: Location,
        record: PumpHistoryRecord,
    ): Promise<void> {
        firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('pumpRecords')
            .add({
                pumpRecordid: record.pumpRecordid,
                auto: record.auto,
                startTime: record.startTime,
                endTime: record.endTime,
                user: record.user,
            });
    }

    public async addTempRecord(
        location: Location,
        record: TemperatureRecord,
    ): Promise<void> {
        firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('temperatureRecords')
            .add({
                id: record.id,
                deviceId: record.deviceId,
                value: record.value,
                name: record.name,
                collectedTime: record.collectedTime
            }); 
    }

    public async addHumiRecord(
        location: Location,
        record: HumidityRecord,
    ): Promise<void> {
        firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('humidityRecords')
            .add({
                id: record.id,
                deviceId: record.deviceId,
                value: record.value,
                name: record.name,
                collectedTime: record.collectedTime
            }); 
    }

    public subscribeTemperature(
        location: Location,
        callback: (result: TemperatureRecord | null) => void,
    ): () => void {
        return firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('temperatureRecords')
            .orderBy('collectedTime', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    callback(null);
                } else {
                    callback(
                        TemperatureRecord.databaseFactory(snapshot.docs[0]),
                    );
                }
            });
    }

    public subscribeHumidity(
        location: Location,
        callback: (result: HumidityRecord | null) => void,
    ): () => void {
        return firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('humidityRecords')
            .orderBy('collectedTime', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    callback(null);
                } else {
                    callback(HumidityRecord.databaseFactory(snapshot.docs[0]));
                }
            });
    }


    public subscribePumpRecord(
        location: Location,
        callback: (result: PumpHistoryRecord | null) => void,
    ): () => void {
        
        return firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('pumpRecords')
            .orderBy('endTime', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    callback(null);
                } else {
                    callback(PumpHistoryRecord.factory(snapshot.docs[0]));
                }
            });
    }

    public async getDeviceRecords(
        location: Location,
    ): Promise<DeviceRecord[]> {
        try {
            var res = await firebase
                .firestore()
                .collection('location')
                .doc(location.id)
                .collection('devices')
                .get();
            return res.docs.map((e) => DeviceRecord.databaseFactory(e));
        } catch (error) {
            return [];
        }
    }

    public async setDeviceRecord(
        location: Location,
        record: DeviceRecord,
    ): Promise<void> {
        try {
            const query = await firebase
                .firestore()
                .collection('location')
                .doc(location.id)
                .collection('devices')
                .where('id', '==', record.id)
                .limit(1)
                .get();
            query.docs[0].ref.update(record.toObject());
        } catch (error) {
            console.error(error);
        }
    }

    public getDevices(
        location: Location,
        callback: (result: DeviceRecord[]) => void,
    ): void {
        firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('devices')
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    callback(null);
                } else {
                    callback(
                        snapshot.docs.map((e) =>
                            DeviceRecord.databaseFactory(e),
                        ),
                    );
                }
            });
    }

    public async addDevice(
        location: Location,
        record: DeviceRecord,
    ): Promise<void> {
        firebase
            .firestore()
            .collection('location')
            .doc(location.id)
            .collection('devices')
            .add(record.toObject());
    }

    public async removeDevice(
        location: Location,
        record: DeviceRecord,
    ): Promise<void> {
        try {
            const query = await firebase
                .firestore()
                .collection('location')
                .doc(location.id)
                .collection('devices')
                .where('id', '==', record.id)
                .limit(1)
                .get();
            query.docs[0].ref.delete();
        } catch (error) {
            console.error(error);
        }
    }
}

export default LocationController;