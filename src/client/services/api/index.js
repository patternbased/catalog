import fetch from 'unfetch';

const apiCall = (method, json = true) => (url, fetchOptions) => {
    fetchOptions = {
        method,
        credentials: 'include',
        ...fetchOptions,
    };

    return new Promise((resolve, reject) => {
        fetch(url, fetchOptions)
            .then(response => {
                if (response.status === 200) {
                    resolve(json ? response.json() : response);
                } else {
                    reject({
                        type: 'server',
                        status: response.status,
                        response,
                    });
                }
            })
            .catch(error => {
                reject({
                    type: 'network',
                    error,
                });
            });
    });
};

const api = {
    get: apiCall('get'),
    post: apiCall('post'),
    put: apiCall('put'),
    delete: apiCall('delete'),
    getRaw: apiCall('get', false),
    postRaw: apiCall('get', false),
};

api.postJson = (url, body) => {
    return api.post(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
};

api.putJson = (url, body) => {
    return api.put(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
};

export default api;
