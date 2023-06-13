import '../styles/globals.css';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { Provider } from '../context/app-context';

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;
    const getLayout = Component.getLayout ?? ((page) => page);

    // const router = useRouter()
    // const [init, setInit] = useState(false)
    // const isUnmounted = useRef(false);

    // useEffect(() => {
    //     (async () => {
    //         AuthController.getInstance().getAuthenticateState(async (user) => {
    //             if (isUnmounted.current) return;
    //             if (user) {
    //                 if (router.route === '/login') await router.push('/')
    //             }
    //             else {
    //                 if (router.route !== '/login') await router.push('/login')
    //             }
    //             if (isUnmounted.current) return;
    //             setInit(true);
    //         })
    //     })()
    // }, [router]);

    // useEffect(() => {
    //     return () => {
    //         isUnmounted.current = true;
    //     }
    // }, []);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Greenhouse Web</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            {/* {init ? */}
            <Provider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {getLayout(<Component {...pageProps} />)}
                    </ThemeProvider>
                </LocalizationProvider>
            </Provider>
            {/* : null} */}
        </CacheProvider>
    );
};

export default App;
