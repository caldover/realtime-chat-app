import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// WebSocket Connection
const wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.us-west-2.graph.cool/v1/cjpcane9c5pnn0168z46wixnz',
    options: {
        reconnect: true
    }
});

// HTTP Connection for Request-Response Operations
const httpLink = new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cjpcane9c5pnn0168z46wixnz' 
});

// If query returns true, forward request to wsLink. Otherwise, forward to httpLink
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink,
)

// Client
const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});



ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
