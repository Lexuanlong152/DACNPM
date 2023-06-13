import Employee from '../models/employee';
import Location from '../models/location';
import firebase from '../config/firebase';

class EmployeeController {
    private static instance: EmployeeController;

    public static getInstance(): EmployeeController {
        if (!EmployeeController.instance) {
            EmployeeController.instance = new EmployeeController();
        }
        return EmployeeController.instance;
    }

    public async addEmployee(
        location: Location,
        email: string,
        isManager: boolean,
    ): Promise<boolean> {
        try {
            var res = await firebase
                .firestore()
                .collection('employees')
                .doc(email)
                .get();
            if (res.exists) {
                await firebase
                    .firestore()
                    .collection('employees')
                    .doc(email)
                    .update({
                        isManager: isManager,
                        date: new Date(),
                        locations: isManager
                            ? []
                            : firebase.firestore.FieldValue.arrayUnion(
                                  location.id,
                              ),
                    });
            } else {
                await firebase
                    .firestore()
                    .collection('employees')
                    .doc(email)
                    .set({
                        isManager: isManager,
                        date: new Date(),
                        locations: isManager
                            ? []
                            : firebase.firestore.FieldValue.arrayUnion(
                                  location.id,
                              ),
                    });
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    public async loadEmployees(location: Location): Promise<Employee[]> {
        try {
            var res1 = await firebase
                .firestore()
                .collection('employees')
                .where('isManager', '==', false)
                .where('locations', 'array-contains', location.id)
                .get();
            var res2 = await firebase
                .firestore()
                .collection('employees')
                .where('isManager', '==', true)
                .get();
            return res1.docs.concat(res2.docs).map((e) => Employee.factory(e));
        } catch (error) {
            return [];
        }
    }

    public async removeEmployee(
        location: Location,
        email: string,
    ): Promise<boolean> {
        try {
            var res = await firebase
                .firestore()
                .collection('employees')
                .doc(email)
                .get();
            if (!res.exists) return false;
            var employee = Employee.factory(res);
            if (
                employee.locations.length === 1 &&
                employee.locations[0] === location.id
            ) {
                await firebase
                    .firestore()
                    .collection('employees')
                    .doc(email)
                    .delete();
                return true;
            } else if (employee.isManager) {
                await firebase
                    .firestore()
                    .collection('employees')
                    .doc(email)
                    .delete();
                return true;
            } else {
                await firebase
                    .firestore()
                    .collection('employees')
                    .doc(email)
                    .update({
                        isManager: employee.isManager,
                        date: new Date(),
                        locations: employee.isManager
                            ? []
                            : firebase.firestore.FieldValue.arrayRemove(
                                  location.id,
                              ),
                    });
                return true;
            }
        } catch (error) {
            return false;
        }
    }
}

export default EmployeeController;