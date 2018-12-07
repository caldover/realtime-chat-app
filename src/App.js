import React, { Component } from 'react';
import './App.css';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Chatbox from './components/Chatbox';

class App extends Component {

  state = {
    from: 'anonymous',
    content: '',
    scrolled: false
  };

  componentDidMount() {
    const from = 'anon';
    from && this.setState({ from });
    this._subscribeToNewChats();
  }

  componentDidUpdate(prevState) {
    const chatHistory = document.querySelector('.chat-history');
    if(this.state.scrolled === false && chatHistory.scrollHeight > 0) {
      console.log('update');
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    const chatHistory = document.querySelector('.chat-history');
    console.log('Scroll Top(Original): ' + chatHistory.scrollTop);
    console.log('Scroll Height: ' + chatHistory.scrollHeight);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    console.log('Scroll Top(Updated): ' + chatHistory.scrollTop);
    this.setState({ scrolled: true });
  }

  _subscribeToNewChats = () => {
    this.props.allChatsQuery.subscribeToMore({
      document: gql`
        subscription {
          Chat(filter: { mutation_in: [CREATED] }) {
            node {
              id
              from
              content
              createdAt
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newChatLinks = [
          ...previous.allChats,
          subscriptionData.data.Chat.node
        ];
        const result = {
          ...previous,
          allChats: newChatLinks
        };
        console.log(result, previous, subscriptionData);
        return result;
      }
    });
  };

  _createChat = async e => {
    if (e.key === 'Enter') {
      const { content, from } = this.state;
      await this.props.createChatMutation({
        variables: { content, from }
      });
      this.setState({ content: '' });
    }
  };

  render() {
    const allChats = this.props.allChatsQuery.allChats || [];
    return (
      <div className="container">
        <div className="chat-header">
          Open Chat
        </div>
        <div className="chat-history" ref={chatHistory => { this.chatHistory = chatHistory;}}>

          {allChats.map(message => (
            <Chatbox key={message.id} message={message} />
          ))}



        </div>
        {/* Message content input */}
        <input
          value={this.state.content}
          onChange={e => this.setState({ content: e.target.value })}
          type="text"
          placeholder="Start typing"
          onKeyPress={this._createChat}
        />
      </div>
    );
  }

}

const ALL_CHATS_QUERY = gql`
  query AllChatsQuery {
    allChats {
      id
      createdAt
      from
      content
    }
  }
`;

const CREATE_CHAT_MUTATION = gql`
  mutation CreateChatMutation($content: String!, $from: String!) {
    createChat(content: $content, from: $from) {
      id
      createdAt
      from
      content
    }
  }
`;

export default compose(
  graphql(ALL_CHATS_QUERY, { name : 'allChatsQuery' }),
  graphql(CREATE_CHAT_MUTATION, {name: 'createChatMutation'})
)(App);
