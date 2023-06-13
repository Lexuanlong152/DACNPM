export default async function sendHttpRequest(path, method, body, key) {
    const response = await fetch(path, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': key,
        },
    });
    let data = await response.json();

    return {
        status: response.status,
        data: data,
    };
}
