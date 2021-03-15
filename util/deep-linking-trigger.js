import * as Linking from 'expo-linking';

const getDeepLinkingURLParts = (url) => {
    const reDeepLinkURL = /^(\w+)\:\/\/([^\?]*)(\?(.*))?$/;
    const matches = reDeepLinkURL.exec(url);
    if (matches === null) {
        return {
            error: new Error(`Url inválida: ${url}`),
            scheme: null,
            path: null,
            queryParamsStr: null,
            url
        };
    }
    return {
        error: null,
        scheme: matches[1] || '', 
        path: '/' + (matches[2] || ''), 
        queryParamsStr: matches[4] || '',
        url
    };
};

const getObjectFromQueryString = (queryParamsStr) => {
    let queryParams = {};
    if (queryParamsStr.length > 0) {
        queryParamsStr.split('&').forEach(pairStr => {
            const pair = pairStr.split('=');
            queryParams[pair[0]] = pair[1];
        });
    }
    return queryParams;
};


export default class DeepLinkingTrigger {
    constructor(scheme) {
        this.scheme = scheme
    }

    parseURL(url) {
        //Para recuperar la ruta y los parámetros
        const { error, scheme, path, queryParamsStr } = getDeepLinkingURLParts(url);
        if (error !== null) {
            return { error, scheme, path, queryParamsStr, url };
        }
        if (scheme != this.scheme) {
            return { error: new Error('Scheme no corresponde al de esta aplicación.'), scheme, path, queryParams, url };
        }
        // Convertir el querystring en objeto queryParams
        const queryParams = getObjectFromQueryString(queryParamsStr);
        // Validaciones finales
        const wasTriggered = (path != '/') || (queryParamsStr != '');
        return { error: null, wasTriggered, scheme, path, queryParams, url };
    }

    async getInitialURL() {
        const iniUrl = await Linking.getInitialURL();
        const { error, wasTriggered, scheme, path, queryParams, url } = this.parseURL(iniUrl);
        if (error) { return Promise.reject(error); }
        return Promise.resolve({ wasTriggered, scheme, path, queryParams, url, wasInitial: true });
    }

    getEventURL() {
        return new Promise((resolve, reject) => {
            Linking.addEventListener('url', ( { url: eventUrl } ) => {
                const { error, wasTriggered, scheme, path, queryParams, url } = this.parseURL(eventUrl);
                if (error) { return reject(error); }
                resolve({ wasTriggered, scheme, path, queryParams, url, wasInitial: false });
            });
        });
    }
}

  