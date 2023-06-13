import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
    Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';

import AuthController from '../../controller/auth-controller';

const Login = () => {
    const router = useRouter();
    const [err, setErr] = useState('');

    return (
        <>
            <Head>
                <title>Login | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%',
                }}
            >
                <Container maxWidth="sm">
                    <form>
                        <Box sx={{ my: 3 }}>
                            <Typography color="textPrimary" variant="h4">
                                Đăng nhập
                            </Typography>
                        </Box>
                        {/* <TextField
              error={Boolean(err !== "")}
              fullWidth
              // helperText={formik.touched.email && formik.errors.email}
              label="Tên đăng nhập"
              margin="normal"
              name="username"
              // onBlur={formik.handleBlur}
              // onChange={formik.handleChange}
              onChange={(event) => {
                setUsername(event.target.value)
              }}
              type="text"
              value={username}
              variant="outlined"
            />
            <TextField
              error={Boolean(err !== "")}
              fullWidth
              // helperText={Boolean(password === "")}
              label="Mật khẩu"
              margin="normal"
              name="password"
              // onBlur={formik.handleBlur}
              // onChange={formik.handleChange}
              onChange={(event) => {
                setPassword(event.target.value)
              }}
              type="password"
              value={password}
              variant="outlined"
            /> */}
                        <Box
                            sx={{
                                py: 2,
                                marginTop: '20px',
                            }}
                        >
                            <Button
                                color="primary"
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={async () => {
                                    // var res = await sendHttpRequest('/api/login', 'POST',
                                    // {
                                    //   username: username,
                                    //   password: password,
                                    //   remember: true,
                                    // }, undefined);
                                    // if (res.status === 200) {
                                    //   if (typeof(Storage) !== "undefined") {
                                    //     localStorage.setItem("token", res.data['token']);
                                    //   }
                                    //   await router.push('/')
                                    // }
                                    // else {
                                    //   setErr("Tên đăng nhập hoặc mật khẩu không hợp lệ!")
                                    // }
                                    AuthController.getInstance().login();
                                }}
                            >
                                <GoogleIcon sx={{ marginRight: '8px' }} />
                                Đăng nhập với Google
                            </Button>
                        </Box>
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            {err}
                        </Typography>
                    </form>
                </Container>
            </Box>
        </>
    );
};

export default Login;
