import { createContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import LocationController from '../controller/location-controller';
import AuthController from '../controller/auth-controller';

const AppContext = createContext();

const Provider = ({ children }) => {
    const [area, setArea] = useState(0);
    const [areas, setAreas] = useState([]);
    const router = useRouter();
    const [init, setInit] = useState(false);

    const value = { area, setArea, areas, setAreas };
    const isUnmounted = useRef(false);

    useEffect(() => {
        (async () => {
            AuthController.getInstance().getAuthenticateState(async (user) => {
                if (user) {
                    if (router.route === '/login') await router.push('/');
                    var areaData =
                        await LocationController.getInstance().getLocations(
                            user,
                        );
                    if (areaData.length === 0) {
                        AuthController.getInstance().logout();
                    }
                    if (isUnmounted.current) return;
                    setAreas(areaData);
                } else {
                    if (router.route !== '/login') await router.push('/login');
                    var areaData = [];
                    if (isUnmounted.current) return;
                    setAreas(areaData);
                }

                if (isUnmounted.current) return;
                setInit(true);
            });
        })();
    }, [router]);

    useEffect(() => {
        var user = AuthController.getInstance().getCurrentUser();
        if (user) {
            var locations =
                LocationController.getInstance().getLocations(user);
        }

        return () => {
            isUnmounted.current = true;
        };
    }, []);

    return (
        <AppContext.Provider value={value}>
            {init ? children : null}
        </AppContext.Provider>
    );
};

export { Provider };
export default AppContext;
